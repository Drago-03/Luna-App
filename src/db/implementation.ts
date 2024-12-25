// importing services
import { db } from '../db/database';
import { EmotionalState, CulturalContext } from '../types/consciousness';

// Define currentEmotionalState (assuming EmotionalState has proper interface)
const currentEmotionalState: EmotionalState = {
    valence: 0.8,
    arousal: 0.5,
    dominance: 0.6
}; 

// Wrap the DB operation in an async function
async function storeMemory() {
    await db.memories.add({
        type: 'experience',
        content: 'Hello Luna',
        language: 'en',
        importance: 0.8,
        timestamp: new Date(),
        emotions: currentEmotionalState,
        culturalContext: CulturalContext.Western,
        associations: [],
        lastAccessed: new Date()
    });
}

// Call the function
storeMemory();