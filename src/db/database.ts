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

export class LunaDatabase extends Dexie {
  conversations!: Table<Conversation>;
  learningData!: Table<LearningData>;

  constructor() {
    super('LunaDB');
    this.version(1).stores({
      conversations: '++id, timestamp',
      learningData: '++id, topic, lastUpdated'
    });
  }
}

export const db = new LunaDatabase();