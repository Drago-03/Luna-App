export interface EmotionalState {
    valence: number;    // -1 to 1, representing negative to positive
    arousal: number;    // 0 to 1, representing intensity
    dominance: number;  // 0 to 1, representing feeling of control
}

export enum CulturalContext {
    Western = 'Western',
    Eastern = 'Eastern',
    // Add other cultural contexts as needed
} 