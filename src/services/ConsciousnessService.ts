import { db } from '../db/database';
import { Logger } from '../utils/logger';

interface EmotionalState {
  happiness: number;
  curiosity: number;
  empathy: number;
  creativity: number;
}

interface Memory {
  id?: number;
  type: 'experience' | 'knowledge' | 'emotion';
  content: string;
  importance: number;
  timestamp: Date;
  emotions: EmotionalState;
}

export class ConsciousnessService {
  private static instance: ConsciousnessService;
  private emotionalState: EmotionalState;
  private logger: Logger;

  private constructor() {
    this.logger = Logger.getInstance();
    this.emotionalState = {
      happiness: 0.7,
      curiosity: 0.8,
      empathy: 0.9,
      creativity: 0.6
    };
  }

  static getInstance(): ConsciousnessService {
    if (!ConsciousnessService.instance) {
      ConsciousnessService.instance = new ConsciousnessService();
    }
    return ConsciousnessService.instance;
  }

  async processExperience(input: string): Promise<void> {
    const memory: Memory = {
      type: 'experience',
      content: input,
      importance: this.calculateImportance(input),
      timestamp: new Date(),
      emotions: {...this.emotionalState}
    };
    
    await this.storeMemory(memory);
    this.updateEmotionalState(input);
  }

  private calculateImportance(input: string): number {
    // Basic importance calculation based on emotional keywords
    const emotionalKeywords = ['love', 'hate', 'happy', 'sad', 'angry', 'excited'];
    return emotionalKeywords.some(keyword => input.toLowerCase().includes(keyword)) ? 0.8 : 0.5;
  }

  private async storeMemory(memory: Memory): Promise<void> {
    await db.table('memories').add(memory);
    this.logger.log(`New memory stored: ${memory.content}`, 'info');
  }

  private updateEmotionalState(input: string): void {
    // Update emotional state based on input content
    // This is a simple implementation
    const positiveWords = ['happy', 'good', 'great', 'love', 'wonderful'];
    const negativeWords = ['sad', 'bad', 'awful', 'hate', 'terrible'];
    
    const words = input.toLowerCase().split(' ');
    const positiveCount = words.filter(w => positiveWords.includes(w)).length;
    const negativeCount = words.filter(w => negativeWords.includes(w)).length;
    
    this.emotionalState.happiness += (positiveCount - negativeCount) * 0.1;
    this.emotionalState.happiness = Math.max(0, Math.min(1, this.emotionalState.happiness));
  }

  getEmotionalState(): EmotionalState {
    return {...this.emotionalState};
  }
}