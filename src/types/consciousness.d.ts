export interface EmotionalState {
  happiness: number;
  curiosity: number;
  empathy: number;
  creativity: number;
}

export interface Memory {
  id?: number;
  type: 'experience' | 'knowledge' | 'emotion';
  content: string;
  importance: number;
  timestamp: Date;
  emotions: EmotionalState;
}