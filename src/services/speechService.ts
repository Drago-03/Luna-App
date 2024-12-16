import { Logger } from '../utils/logger';

export class SpeechService {
  private synthesis: SpeechSynthesis;
  private recognition: SpeechRecognition | null;
  private voice: SpeechSynthesisVoice | null = null;
  private logger: Logger;
  private isSupported: boolean;

  constructor() {
    this.logger = Logger.getInstance();
    this.synthesis = window.speechSynthesis;
    this.isSupported = this.checkSpeechSupport();
    this.recognition = this.initializeSpeechRecognition();
    this.initializeVoice();
  }

  private checkSpeechSupport(): boolean {
    const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    const hasSpeechSynthesis = 'speechSynthesis' in window;
    
    if (!hasSpeechRecognition) {
      this.logger.log('Speech recognition is not supported in this browser', 'warning');
    }
    if (!hasSpeechSynthesis) {
      this.logger.log('Speech synthesis is not supported in this browser', 'warning');
    }
    
    return hasSpeechRecognition && hasSpeechSynthesis;
  }

  private initializeSpeechRecognition(): SpeechRecognition | null {
    if (!this.isSupported) return null;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onerror = (event) => {
      this.logger.log(`Speech recognition error: ${event.error}`, 'error');
    };

    return recognition;
  }

  private initializeVoice(): void {
    if (!this.synthesis) return;

    const loadVoices = () => {
      const voices = this.synthesis.getVoices();
      // Prioritize female English voices
      this.voice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') && 
        voice.lang.startsWith('en')
      ) || voices.find(voice => 
        voice.lang.startsWith('en')
      ) || voices[0];

      if (this.voice) {
        this.logger.log(`Selected voice: ${this.voice.name}`, 'info');
      }
    };

    // Load voices immediately if available
    loadVoices();
    
    // Also handle async voice loading
    this.synthesis.addEventListener('voiceschanged', loadVoices);
  }

  speak(text: string): void {
    if (!this.synthesis || !this.voice) {
      this.logger.log('Speech synthesis not available', 'warning');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voice;
    utterance.pitch = 1.1; // Slightly higher pitch for more feminine voice
    utterance.rate = 1.0;
    
    utterance.onerror = (event) => {
      this.logger.log(`Speech synthesis error: ${event.error}`, 'error');
    };

    this.synthesis.speak(utterance);
  }

  startListening(callback: (text: string) => void): boolean {
    if (!this.recognition || !this.isSupported) {
      this.logger.log('Speech recognition not available', 'warning');
      return false;
    }

    let finalTranscript = '';

    this.recognition.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript = transcript;
          callback(finalTranscript.trim());
          finalTranscript = '';
        } else {
          interimTranscript += transcript;
        }
      }
    };

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      this.logger.log(`Failed to start speech recognition: ${error}`, 'error');
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        this.logger.log(`Error stopping speech recognition: ${error}`, 'error');
      }
    }
  }

  isRecognitionSupported(): boolean {
    return this.isSupported;
  }
}