import { Pipeline } from '@xenova/transformers';
import * as Comlink from 'comlink';

export class ModelService {
  private static instance: ModelService;
  private model: Pipeline | null = null;
  private worker: Worker | null = null;

  private constructor() {
    // Initialize web worker for model operations
    this.worker = new Worker(new URL('../workers/model.worker.ts', import.meta.url), {
      type: 'module'
    });
  }

  static getInstance(): ModelService {
    if (!ModelService.instance) {
      ModelService.instance = new ModelService();
    }
    return ModelService.instance;
  }

  async initialize(): Promise<void> {
    if (!this.worker) return;
    
    const workerApi = Comlink.wrap(this.worker);
    await workerApi.initializeModel();
  }

  async generate(prompt: string): Promise<string> {
    if (!this.worker) return "Model not initialized";
    
    const workerApi = Comlink.wrap(this.worker);
    return await workerApi.generate(prompt);
  }

  async train(data: Array<{input: string, output: string}>): Promise<void> {
    if (!this.worker) return;
    
    const workerApi = Comlink.wrap(this.worker);
    await workerApi.train(data);
  }
}