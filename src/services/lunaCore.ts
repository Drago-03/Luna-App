import { ConsciousnessService } from './ConsciousnessService';

export class LunaCore {
  private consciousnessService: ConsciousnessService;

  constructor() {
    this.consciousnessService = ConsciousnessService.getInstance();
  }

  async processInput(input: string): Promise<string> {
    try {
      await this.consciousnessService.processExperience(input);
      const emotionalState = this.consciousnessService.getEmotionalState();
      
      const enhancedInput = `[Emotional State: ${JSON.stringify(emotionalState)}] ${input}`;
      
      // ...existing processInput logic
    } catch (error) {
      // ...error handling
    }
  }
}