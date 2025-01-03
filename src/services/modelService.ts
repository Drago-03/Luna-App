import { T5Model } from '@xenova/transformers';

export class ModelService {
  private static instance: ModelService;
  private model: T5Model | null = null;

  private constructor() {}

  static getInstance(): ModelService {
    if (!ModelService.instance) {
      ModelService.instance = new ModelService();
    }
    return ModelService.instance;
  }

  async loadModel(modelPath: string): Promise<void> {
    this.model = await T5Model.from_pretrained(modelPath);
  }

  async predict(input: string): Promise<string> {
    if (!this.model) {
      throw new Error('Model not loaded');
    }
    const result = await this.model.generate([input]);
    return result;
  }
  }