declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;

export class SpeechService {
  private synthesis: SpeechSynthesis;
  private recognizers: Map<string, SpeechRecognition>;
  private voices: Map<string, SpeechSynthesisVoice>;
  private currentLanguage: string = 'en-US';

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.recognizers = new Map();
    this.voices = new Map();
    this.initializeMultilingualSupport();
  }

  private initializeMultilingualSupport() {
    const languages = [
      'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 
      'ja-JP', 'ko-KR', 'zh-CN', 'ru-RU', 'ar-SA'
    ];

    languages.forEach(lang => {
      const recognition = this.createRecognizer(lang);
      this.recognizers.set(lang, recognition);
    });

    this.loadVoices();
  }
  createRecognizer(lang: string): SpeechRecognition {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    return recognition;
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
}