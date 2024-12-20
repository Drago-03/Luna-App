import { useState, useEffect } from 'react';
import { Mic, MicOff, Bot, AlertCircle } from 'lucide-react';
import { SpeechService } from './services/speechService';
import { LunaCore } from './services/lunaCore';
import { FloatingWave } from './components/FloatingWave';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [speechService] = useState(() => new SpeechService());
  const [lunaCore] = useState(() => new LunaCore());
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    setIsSpeechSupported(speechService.isRecognitionSupported());
    handleLunaResponse("Hello! I'm Luna, your AI assistant. How can I help you today?");
  }, []);

  useEffect(() => {
    // Listen for wake word
    const handleWakeWord = (event: CustomEvent) => {
      setIsMinimized(false);
    };

    window.addEventListener('wake-word-detected', handleWakeWord);
    return () => window.removeEventListener('wake-word-detected', handleWakeWord);
  }, []);

  const handleLunaResponse = async (text: string) => {
    setMessages(prev => [...prev, { text, isUser: false }]);
    speechService.speak(text);
  };

  const toggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      const started = speechService.startListening(async (text) => {
        setMessages(prev => [...prev, { text, isUser: true }]);
        const response = await lunaCore.processInput(text);
        handleLunaResponse(response);
      });
      setIsListening(started);
    }
  };

  return (
    <>
      <FloatingWave />
      {!isMinimized && (
        <div className="fixed top-0 right-0 mt-16 mr-4 w-96 bg-gray-900 rounded-lg shadow-xl">
          <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-center mb-8">
                <Bot className="w-12 h-12 text-blue-400 mr-4" />
                <h1 className="text-4xl font-bold">Luna AI Assistant</h1>
              </div>

              {!isSpeechSupported && (
                <div className="bg-yellow-600 text-white p-4 rounded-lg mb-6 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2" />
                  <p>Speech recognition is not supported in your browser. Please try using a modern browser like Chrome.</p>
                </div>
              )}

              <div className="bg-gray-800 rounded-lg p-6 mb-6 h-[60vh] overflow-y-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.isUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block p-4 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={toggleListening}
                  disabled={!isSpeechSupported}
                  className={`p-4 rounded-full ${
                    isListening ? 'bg-red-500' : 'bg-blue-500'
                  } hover:opacity-90 transition-opacity ${
                    !isSpeechSupported ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;