import { Pipeline, AutoModelForCausalLM } from '@xenova/transformers';
import * as Comlink from 'comlink';

class ModelWorker {
  private model: Pipeline | null = null;

  async initializeModel() {
    try {
      const model = await AutoModelForCausalLM.from_pretrained('Xenova/LLaMA-70b');
      this.model = new Pipeline({
        task: 'text-generation',
        model: model
      });
    } catch (error) {
      console.error('Error initializing model:', error);
      throw error;
    }
  }

  async generate(prompt: string) {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    try {
      // Configure Llama specific parameters
      const result = await this.model(prompt, {
        max_new_tokens: 256, // Adjust based on your needs
        temperature: 0.7,    // Controls randomness (0-1)
        top_p: 0.95,        // Nucleus sampling
        top_k: 50,          // Top-k sampling
        repetition_penalty: 1.2, // Helps prevent repetitive text
        do_sample: true     // Enable sampling
      });

      // Extract generated text, removing the prompt
      const generatedText = result[0].generated_text.slice(prompt.length).trim();
      return generatedText;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  // Remove or comment out the train method since it's not supported
  /* async train(data: Array<{input: string, output: string}>) {
    // Training is not supported by the Pipeline class
  } */
}

Comlink.expose(new ModelWorker());

export class ModelService {
  private static instance: ModelService;
  private worker: Worker | null = null;
  private isInitialized: boolean = false;

  private constructor() {
    this.worker = new Worker(
      new URL('../workers/model.worker.ts', import.meta.url),
      { type: 'module' }
    );
  }

  static getInstance(): ModelService {
    if (!ModelService.instance) {
      ModelService.instance = new ModelService();
    }
    return ModelService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    if (!this.worker) {
      throw new Error('Worker not initialized');
    }
    
    const workerApi = Comlink.wrap<ModelWorker>(this.worker);
    await workerApi.initializeModel();
    this.isInitialized = true;
  }

  async generate(prompt: string): Promise<string> {
    if (!this.worker || !this.isInitialized) {
      throw new Error('Model not initialized');
    }
    
    const workerApi = Comlink.wrap<ModelWorker>(this.worker);
    return await workerApi.generate(prompt);
  }
}