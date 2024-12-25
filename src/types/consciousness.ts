export interface EmotionalState {
    valence: number;    // -1 to 1, representing negative to positive
    arousal: number;    // 0 to 1, representing intensity
    dominance: number;  // 0 to 1, representing feeling of control
    culturalAwareness: number;  // 0 to 1, representing cultural sensitivity
    languageFluency: Map<string, number>;  // language code to fluency level mapping
}

export interface CulturalContext {
  language: string;
  region: string;
  confidence: number;
  lastInteraction: Date;
  respectLevel: string;
  greeting: string;
}

// Keep the enum if needed for other purposes
export enum CulturalContextType {
  Western = 'Western',
  Eastern = 'Eastern'
} 