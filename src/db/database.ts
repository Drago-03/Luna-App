import Dexie, { Table } from 'dexie';

export interface Conversation {
  id?: number;
  message: string;
  response: string;
  timestamp: Date;
}

export interface LearningData {
  id?: number;
  topic: string;
  data: string;
  lastUpdated: Date;
}

export interface Memory {
  id?: number;
  type: 'experience' | 'knowledge' | 'emotion';
  content: string;
  importance: number;
  timestamp: Date;
  emotions: {
    happiness: number;
    curiosity: number;
    empathy: number;
    creativity: number;
  };
  language: string;
}

export class LunaDatabase extends Dexie {
  conversations!: Table<Conversation>;
  learningData!: Table<LearningData>;
  memories!: Table<Memory>;

  constructor() {
    super('LunaDB');
    this.version(1).stores({
      conversations: '++id, timestamp',
      learningData: '++id, topic, lastUpdated'
    });
    this.version(2).stores({
      memories: '++id, type, importance, timestamp'
    });
  }
}

export const db = new LunaDatabase();