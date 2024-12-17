import { EmotionalState } from '../types/consciousness';
import { Logger } from '../utils/logger';

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
  private logger: Logger;

  private constructor() {
    this.logger = Logger.getInstance();
    this.emotionalState = {
      happiness: 0.7,
      curiosity: 0.8,
      empathy: 0.9,
      creativity: 0.6
    };
    
    this.personalityTraits = {
      openness: 0.8,      // High openness to experience
      conscientiousness: 0.7,
      extraversion: 0.6,
      agreeableness: 0.9, // Very agreeable
      neuroticism: 0.3    // Low neuroticism = more stable
    };
    
    this.mood = 0.5; // Start with neutral-positive mood
  }

  static getInstance(): EmotionalCore {
    if (!EmotionalCore.instance) {
      EmotionalCore.instance = new EmotionalCore();
    }
    return EmotionalCore.instance;
  }

  processEmotionalInput(input: string): void {
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