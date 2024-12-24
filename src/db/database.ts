import Dexie, { Table } from 'dexie';
import { EmotionalState, CulturalContext } from '../types/consciousness';

export interface Conversation {
  id?: number;
  message: string;
  response: string;
  timestamp: Date;
  emotionalContext: EmotionalState;
  language: string;
}

export interface LearningData {
  id?: number;
  topic: string;
  data: string;
  lastUpdated: Date;
  importance: number;
  category: 'knowledge' | 'experience' | 'skill';
}

export interface Memory {
  id?: number;
  type: 'experience' | 'knowledge' | 'emotion';
  content: string;
  language: string;
  importance: number;
  timestamp: Date;
  emotions: EmotionalState;
  culturalContext: CulturalContext;
  associations: number[];
  lastAccessed: Date;
}

export class LunaDatabase extends Dexie {
  conversations!: Table<Conversation>;
  learningData!: Table<LearningData>;
  memories!: Table<Memory>;
  private static instance: LunaDatabase;

  private constructor() {
    super('LunaDB');
    
    this.version(3).stores({
      conversations: '++id, timestamp, language',
      learningData: '++id, topic, category, lastUpdated, importance',
      memories: '++id, type, language, importance, timestamp, lastAccessed, content'
    }).upgrade(tx => {
      return tx.table('memories').toCollection().modify(memory => {
        memory.language = memory.language || 'en';
        memory.lastAccessed = memory.lastAccessed || new Date();
        memory.associations = memory.associations || [];
      });
    });

    this.memories.hook('creating', function(primKey, obj) {
      obj.lastAccessed = new Date();
      return undefined;
    });
  }

  static getInstance(): LunaDatabase {
    if (!LunaDatabase.instance) {
      LunaDatabase.instance = new LunaDatabase();
    }
    return LunaDatabase.instance;
  }

  async findSimilarMemories(content: string, limit: number = 5): Promise<Memory[]> {
    return await this.memories
      .orderBy('importance')
      .filter(memory => this.calculateSimilarity(content, memory.content) > 0.5)
      .limit(limit)
      .toArray();
  }

  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(' '));
    const words2 = new Set(text2.toLowerCase().split(' '));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  async consolidateMemories(): Promise<void> {
    const memories = await this.memories.toArray();
    for (let i = 0; i < memories.length; i++) {
      for (let j = i + 1; j < memories.length; j++) {
        const similarity = this.calculateSimilarity(
          memories[i].content,
          memories[j].content
        );
        if (similarity > 0.8) {
          memories[i].associations = [...new Set([
            ...memories[i].associations,
            memories[j].id as number
          ])];
          await this.memories.update(memories[i].id!, memories[i]);
        }
      }
    }
  }
}

export const db = LunaDatabase.getInstance();