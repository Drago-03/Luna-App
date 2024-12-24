import { EmotionalState, CulturalContext } from '../types/consciousness';
import { LanguageProcessor } from './LanguageProcessor';

export class EmotionalCore {
  private static instance: EmotionalCore;
  private emotionalState: EmotionalState;
  private culturalContexts: Map<string, CulturalContext>;
  private languageProcessor: LanguageProcessor;

  private constructor() {
    this.emotionalState = {
      happiness: 0.7,
      curiosity: 0.8,
      empathy: 0.9,
      creativity: 0.6,
      culturalAwareness: 0.5,
      languageFluency: new Map()
    };
    this.culturalContexts = new Map();
    this.languageProcessor = LanguageProcessor.getInstance();
  }

  async processMultilingualInput(input: string): Promise<void> {
    const { 
      detectedLanguage, 
      translatedText, 
      confidence 
    } = await this.languageProcessor.processMultilingualInput(input);
    
    this.updateLanguageFluency(detectedLanguage, confidence);
    this.updateCulturalAwareness(detectedLanguage);
    
    await this.processEmotionalInput(translatedText, detectedLanguage);
  }

  private updateLanguageFluency(language: string, confidence: number): void {
    const currentFluency = this.emotionalState.languageFluency.get(language) || 0;
    this.emotionalState.languageFluency.set(
      language,
      Math.min(1, currentFluency + (confidence * 0.1))
    );
  }

  private updateCulturalAwareness(language: string): void {
    this.emotionalState.culturalAwareness = Math.min(
      1,
      this.emotionalState.culturalAwareness + 0.05
    );
  }

  private async processEmotionalInput(
    input: string, 
    culturalContext: CulturalContext
  ): Promise<void> {
    const sentiment = this.analyzeSentiment(input);
    this.updateMood(sentiment);
    this.adjustEmotionalState(sentiment, culturalContext);
  }
}