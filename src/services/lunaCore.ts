import { db } from '../db/database';
import { ModelService } from './modelService';
import { Logger } from '../utils/logger';

export class LunaCore {
  private context: Map<string, any> = new Map();
  private modelService: ModelService;
  private logger: Logger;

  constructor() {
    this.modelService = ModelService.getInstance();
    this.logger = Logger.getInstance();
    this.initialize();
  }

  private async initialize() {
    try {
      await this.modelService.initialize();
      this.logger.log('Model initialized successfully', 'info');
    } catch (error) {
      this.logger.log(`Error initializing model: ${error}`, 'error');
    }
  }

  async processInput(input: string): Promise<string> {
    try {
      const timestamp = new Date();
      
      // Log the incoming message
      this.logger.log(`Processing input: ${input}`, 'info');
      
      // Generate response using the Llama model
      const response = await this.modelService.generate(input);
      
      // Store conversation in database
      await db.conversations.add({
        message: input,
        response,
        timestamp
      });

      this.logger.log(`Generated response: ${response}`, 'info');
      return response;
    } catch (error) {
      this.logger.log(`Error processing input: ${error}`, 'error');
      return "I'm sorry, I encountered an error processing your request.";
    }
  }

  async learn(data: Array<{input: string, output: string}>): Promise<void> {
    try {
      // Train the model with new data
      await this.modelService.train(data);
      
      // Store learning data
      for (const item of data) {
        await db.learningData.add({
          topic: item.input,
          data: item.output,
          lastUpdated: new Date()
        });
      }
      
      this.logger.log(`Successfully trained on ${data.length} examples`, 'info');
    } catch (error) {
      this.logger.log(`Error during learning: ${error}`, 'error');
      throw error;
    }
  }
}