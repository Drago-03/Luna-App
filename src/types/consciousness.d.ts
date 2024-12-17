export interface EmotionalState {
  happiness: number;
  curiosity: number;
  empathy: number;
  creativity: number;
  culturalAwareness: number;
  languageFluency: Map<string, number>;
}

export interface CulturalContext {
  language: string;
  region: string;
  confidence: number;
  lastInteraction: Date;
}

export interface LanguageCapability {
  code: string;
  name: string;
  fluency: number;
  culturalUnderstanding: number;
  examples: string[];
}

export interface Memory {
  id?: number;
  type: 'experience' | 'knowledge' | 'emotion';
  content: string;
  language: string;  // This is required
  importance: number;
  timestamp: Date;
  emotions: EmotionalState;
  culturalContext?: CulturalContext;
  // Missing the language property
  // ...other properties
}