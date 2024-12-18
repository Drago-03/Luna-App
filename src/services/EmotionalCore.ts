import { EmotionalState } from '../types/consciousness';
import { Logger } from '../utils/logger';
import { detectLanguage, translateText, SUPPORTED_LANGUAGES } from '../utils/languageUtils';
import { LanguageProcessor } from './LanguageProcessor';
import { CulturalContextProcessor } from './CulturalContextProcessor';

interface PersonalityTraits {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export class EmotionalCore {
  private static instance: EmotionalCore;
  private emotionalState: EmotionalState;
  private personalityTraits: PersonalityTraits;
  private mood: number; // -1 to 1
  private languageProcessor: LanguageProcessor;
  private culturalProcessor: CulturalContextProcessor;
  private logger: Logger;

  private constructor() {
    this.emotionalState = {
      happiness: 0.7,
      curiosity: 0.8,
      empathy: 0.9,
      creativity: 0.6,
      culturalAwareness: 0.5,
      languageFluency: new Map()
    };
    
    this.personalityTraits = {
      openness: 0.8,      // High openness to experience
      conscientiousness: 0.7,
      extraversion: 0.6,
      agreeableness: 0.9, // Very agreeable
      neuroticism: 0.3    // Low neuroticism = more stable
    };
    
    this.mood = 0.5; // Start with neutral-positive mood
    this.languageProcessor = LanguageProcessor.getInstance();
    this.culturalProcessor = CulturalContextProcessor.getInstance();
    this.logger = Logger.getInstance();
    this.culturalProcessor = CulturalContextProcessor.getInstance();
  }

  static getInstance(): EmotionalCore {
    if (!EmotionalCore.instance) {
      EmotionalCore.instance = new EmotionalCore();
    }
    return EmotionalCore.instance;
  }

  async processMultilingualInput(input: string): Promise<void> {
    const { 
      detectedLanguage, 
      translatedText, 
      confidence 
    } = await this.languageProcessor.processMultilingualInput(input);
    
    // Add cultural processing
    const culturalContext = await this.culturalProcessor
      .processCulturalContext(input, detectedLanguage);
    
    this.updateLanguageFluency(detectedLanguage, confidence);
    this.updateCulturalAwareness();
    
    await this.processEmotionalInput(translatedText, culturalContext);
  }

  private updateLanguageFluency(language: string, confidence: number): void {
    const currentFluency = this.emotionalState.languageFluency.get(language) || 0;
    this.emotionalState.languageFluency.set(
      language,
      Math.min(1, currentFluency + (confidence * 0.1))
    );
  }

  private updateCulturalAwareness(): void {
    this.emotionalState.culturalAwareness = Math.min(
      1,
      this.emotionalState.culturalAwareness + 0.05
    );
  }

  private async processEmotionalInput(
    input: string,
    _culturalContext: any
  ): Promise<void> {
    const sentiment = this.analyzeSentiment(input);
    this.updateMood(sentiment);
    this.adjustEmotionalState(sentiment);
    this.logger.log(`Processed emotional input: Sentiment=${sentiment}, Mood=${this.mood}`, 'info');
  }

  private analyzeSentiment(input: string): number {
    const positiveWords = ['happy', 'good', 'great', 'love', 'wonderful', 'excited'];
    const negativeWords = ['sad', 'bad', 'awful', 'hate', 'terrible', 'angry'];
    
    const words = input.toLowerCase().split(' ');
    const positiveCount = words.filter(w => positiveWords.includes(w)).length;
    const negativeCount = words.filter(w => negativeWords.includes(w)).length;
    
    return (positiveCount - negativeCount) / words.length;
  }

  private updateMood(sentiment: number): void {
    // Mood changes slowly, personality affects how much
    const sensitivity = this.personalityTraits.neuroticism;
    this.mood += sentiment * sensitivity * 0.1;
    this.mood = Math.max(-1, Math.min(1, this.mood));
  }

  private adjustEmotionalState(sentiment: number): void {
    // Update emotional state based on mood and personality
    this.emotionalState.happiness = this.calculateHappiness(sentiment);
    this.emotionalState.curiosity = this.calculateCuriosity();
    this.emotionalState.empathy = this.calculateEmpathy();
    this.emotionalState.creativity = this.calculateCreativity();
  }

  private calculateHappiness(sentiment: number): number {
    return Math.max(0, Math.min(1, 
      this.emotionalState.happiness + 
      (sentiment * 0.1) + 
      (this.mood * 0.05)
    ));
  }

  private calculateCuriosity(): number {
    return Math.max(0, Math.min(1,
      this.emotionalState.curiosity +
      (this.personalityTraits.openness * 0.1) -
      (Math.abs(this.mood) * 0.05)
    ));
  }

  private calculateEmpathy(): number {
    return Math.max(0, Math.min(1,
      this.emotionalState.empathy +
      (this.personalityTraits.agreeableness * 0.1)
    ));
  }

  private calculateCreativity(): number {
    return Math.max(0, Math.min(1,
      this.emotionalState.creativity +
      (this.personalityTraits.openness * 0.1) +
      (this.mood > 0 ? this.mood * 0.1 : 0)
    ));
  }

  getEmotionalState(): EmotionalState {
    return { ...this.emotionalState };
  }

  getMood(): number {
    return this.mood;
  }

  getPersonalityTraits(): PersonalityTraits {
    return { ...this.personalityTraits };
  }
}

class LanguageProcessor {
  private static instance: LanguageProcessor;
  private languageConfidence: Map<string, number>;

  private constructor() {
    this.languageConfidence = new Map();
    SUPPORTED_LANGUAGES.forEach(({ code }: { code: string }) => {
      this.languageConfidence.set(code, 0.1); // Base confidence
    });
  }

  static getInstance(): LanguageProcessor {
    if (!this.instance) {
      this.instance = new LanguageProcessor();
    }
    return this.instance;
  }

  async processMultilingualInput(input: string): Promise<{
    originalText: string;
    detectedLanguage: string;
    translatedText: string;
    confidence: number;
  }> {
    const { code: detectedLang } = await detectLanguage(input);
    const { translatedText } = await translateText(input);
    
    // Update confidence for detected language
    this.updateLanguageConfidence(detectedLang);

    return {
      originalText: input,
      detectedLanguage: detectedLang,
      translatedText,
      confidence: this.languageConfidence.get(detectedLang) || 0
    };
  }

  private updateLanguageConfidence(language: string): void {
    const currentConfidence = this.languageConfidence.get(language) || 0;
    this.languageConfidence.set(
      language,
      Math.min(1, currentConfidence + 0.05)
    );
  }

  getLanguageConfidence(): Map<string, number> {
    return new Map(this.languageConfidence);
  }
}

export default LanguageProcessor;