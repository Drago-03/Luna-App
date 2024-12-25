import { db } from '../db/database';
import { Logger } from '../utils/logger';
import { Memory } from '../types/Memory';

export class MemoryService {
  private static instance: MemoryService;
  private readonly logger: Logger = Logger.getInstance();
  private memories: Map<number, Memory> = new Map();
  private importantMemories: Set<number> = new Set();

  private constructor() {
    this.logger = Logger.getInstance();
    this.loadMemories();
  }

  static getInstance(): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService();
    }
    return MemoryService.instance;
  }

  private async loadMemories(): Promise<void> {
    try {
      const allMemories = await db.memories.toArray();
      allMemories.forEach(memory => {
        const newMemory: Memory = {
          id: memory.id!,
          content: memory.content,
          emotions: {
            happiness: 0,
            curiosity: 0,
            empathy: 0,
            creativity: 0,
            culturalAwareness: 0,
            languageFluency: new Map<string, number>()
          },
          importance: memory.importance,
          type: 'experience',
          language: '',
          timestamp: new Date()
        };
        this.memories.set(memory.id!, newMemory);
        if (memory.importance > 0.7) {
          this.importantMemories.add(memory.id!);
        }
      });
      this.logger.log(`Loaded ${allMemories.length} memories`, 'info');
    } catch (error) {
      this.logger.log(`Error loading memories: ${error}`, 'error');
    }
  }

  async storeMemory(memory: Memory): Promise<number> {
    try {
      const dbMemory: any = {
        id: memory.id,
        content: memory.content,
        importance: memory.importance
      };
      const id = await db.memories.add(dbMemory);
      memory.id = Number(id);
      this.memories.set(Number(id), memory);
      
      if (memory.importance > 0.7) {
        this.importantMemories.add(Number(id));
      }
      
      this.logger.log(`Stored new memory with ID: ${id}`, 'info');
      return Number(id);
    } catch (error) {
      this.logger.log(`Error storing memory: ${error}`, 'error');
      throw error;
    }
  }

  async retrieveMemory(id: number): Promise<Memory | undefined> {
    return this.memories.get(id);
  }

  async searchMemories(query: string): Promise<Memory[]> {
    const results: Memory[] = [];
    for (const memory of this.memories.values()) {
      if (memory.content.toLowerCase().includes(query.toLowerCase())) {
        results.push(memory);
      }
    }
    return results;
  }

  async findSimilarMemories(content: string, limit: number = 5): Promise<Memory[]> {
    const memories = Array.from(this.memories.values());
    return memories
      .map(memory => ({
        memory,
        similarity: this.calculateSimilarity(content, memory.content)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(result => result.memory);
  }

  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(' '));
    const words2 = new Set(text2.toLowerCase().split(' '));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  async getImportantMemories(): Promise<Memory[]> {
    return Array.from(this.importantMemories)
      .map(id => this.memories.get(id)!)
      .filter(memory => memory !== undefined);
  }

  async consolidateMemories(): Promise<void> {
    try {
      const memories = Array.from(this.memories.values());
      for (let i = 0; i < memories.length; i++) {
        for (let j = i + 1; j < memories.length; j++) {
          const similarity = this.calculateSimilarity(
            memories[i].content,
            memories[j].content
          );
          if (similarity > 0.8) {
            memories[i].importance = Math.max(
              memories[i].importance,
              memories[j].importance
            );
            await db.memories.update(memories[i].id!, memories[i]);
          }
        }
      }
      this.logger.log('Memory consolidation complete', 'info');
    } catch (error) {
      this.logger.log(`Error consolidating memories: ${error}`, 'error');
    }
  }
}