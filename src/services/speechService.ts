import { Logger } from '../utils/logger';
import type { SpeechRecognition } from 'web-speech-api';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export class SpeechService {
  private synthesis: SpeechSynthesis;
  private recognition: SpeechRecognition | null;
  private voice: SpeechSynthesisVoice | null = null;
  private logger: Logger;
  private isSupported: boolean;
  private recognizers: Map<string, SpeechRecognition>;
  private voices: Map<string, SpeechSynthesisVoice>;
  private currentLanguage: string = 'en-US';
  createRecognizer: any;

  constructor() {
    this.logger = Logger.getInstance();
    this.synthesis = window.speechSynthesis;
    this.isSupported = this.checkSpeechSupport();
    this.recognition = this.initializeSpeechRecognition();
    this.initializeVoice();
    this.recognizers = new Map();
    this.voices = new Map();
    this.initializeMultilingualSupport();
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

    recognition.onerror = (event: { error: any; }) => {
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

  private initializeMultilingualSupport() {
    // Initialize for major languages
    const languages = [
      'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 
      'ja-JP', 'ko-KR', 'zh-CN', 'ru-RU', 'ar-SA'
    ];

    languages.forEach(lang => {
      const recognition = this.createRecognizer(lang);
      if (recognition) {
        this.recognizers.set(lang, recognition);
      }
    });

    // Load voices for all languages
    this.loadVoices();
  }

  private loadVoices() {
    const loadVoicesCallback = () => {
      const availableVoices = this.synthesis.getVoices();
      availableVoices.forEach(voice => {
        this.voices.set(voice.lang, voice);
      });
    };

    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoicesCallback;
    }
    loadVoicesCallback();
  }

  speak(text: string, language: string = this.currentLanguage): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voices.get(language) || null;
    utterance.lang = language;
    this.synthesis.speak(utterance);
  }

  startListening(callback: (text: string) => void): boolean {
    if (!this.recognition || !this.isSupported) {
      this.logger.log('Speech recognition not available', 'warning');
      return false;
    }

    let finalTranscript = '';

    this.recognition.onresult = (event: { resultIndex: any; results: string | any[]; }) => {
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