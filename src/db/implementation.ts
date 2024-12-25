// importing services
import { db } from '../db/database';
import { EmotionalState, CulturalContext } from '../types/consciousness';

// Define currentEmotionalState (assuming EmotionalState has proper interface)
const currentEmotionalState: EmotionalState = {
    valence: 0.8,
    arousal: 0.5,
    dominance: 0.6
}; 

const culturalContext: CulturalContext = {
    language: 'en',
    region: 'Global/Western',
    confidence: 1.0,
    lastInteraction: new Date(),
    respectLevel: 'formal',
    greeting: 'Hello'
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
        culturalContext: culturalContext,
        associations: [],
        lastAccessed: new Date()
    });
}

// Call the function
storeMemory();