// importing services
import { db } from '../db/database';
import { EmotionalState } from '../types/consciousness';

// Define currentEmotionalState
const currentEmotionalState: EmotionalState = { mood: 'Happy' }; // Example value, replace with actual state

// Define currentCulturalContext
const currentCulturalContext = 'Western'; // Example value, replace with actual context

// Store memory
await db.memories.add({
    type: 'experience',
    content: 'Hello Luna',
    language: 'en',
    importance: 0.8,
    timestamp: new Date(),
    emotions: currentEmotionalState,
    culturalContext: currentCulturalContext,
    associations: [],
    lastAccessed: null
});