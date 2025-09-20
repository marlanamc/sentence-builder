// Enhanced Verb Database - Phase 2 Implementation
// Comprehensive verb system with all forms and difficulty levels
import { VerbData } from './types';

export const enhancedVerbDatabase: Record<string, VerbData[]> = {
  
  // High-frequency verbs for beginners (Levels 1-8)
  beginner: [
    {
      V1: 'be', V1_3rd: 'is', V1_ing: 'being', V2: 'was/were', V3: 'been',
      type: 'irregular', frequency: 10, difficulty: 'beginner',
      irregular: true
    },
    {
      V1: 'have', V1_3rd: 'has', V1_ing: 'having', V2: 'had', V3: 'had',
      type: 'irregular', frequency: 10, difficulty: 'beginner',
      irregular: true
    },
    {
      V1: 'do', V1_3rd: 'does', V1_ing: 'doing', V2: 'did', V3: 'done',
      type: 'irregular', frequency: 10, difficulty: 'beginner',
      irregular: true
    },
    {
      V1: 'go', V1_3rd: 'goes', V1_ing: 'going', V2: 'went', V3: 'gone',
      type: 'irregular', frequency: 10, difficulty: 'beginner',
      irregular: true
    },
    {
      V1: 'get', V1_3rd: 'gets', V1_ing: 'getting', V2: 'got', V3: 'gotten',
      type: 'irregular', frequency: 10, difficulty: 'beginner',
      irregular: true
    },
    {
      V1: 'make', V1_3rd: 'makes', V1_ing: 'making', V2: 'made', V3: 'made',
      type: 'irregular', frequency: 10, difficulty: 'beginner',
      irregular: true
    },
    {
      V1: 'take', V1_3rd: 'takes', V1_ing: 'taking', V2: 'took', V3: 'taken',
      type: 'irregular', frequency: 10, difficulty: 'beginner',
      irregular: true
    },
    {
      V1: 'come', V1_3rd: 'comes', V1_ing: 'coming', V2: 'came', V3: 'come',
      type: 'irregular', frequency: 10, difficulty: 'beginner',
      irregular: true
    },
    {
      V1: 'see', V1_3rd: 'sees', V1_ing: 'seeing', V2: 'saw', V3: 'seen',
      type: 'irregular', frequency: 10, difficulty: 'beginner',
      irregular: true
    },
    {
      V1: 'know', V1_3rd: 'knows', V1_ing: 'knowing', V2: 'knew', V3: 'known',
      type: 'irregular', frequency: 10, difficulty: 'beginner',
      irregular: true
    },
    {
      V1: 'want', V1_3rd: 'wants', V1_ing: 'wanting', V2: 'wanted', V3: 'wanted',
      type: 'regular', frequency: 10, difficulty: 'beginner',
      irregular: false
    },
    {
      V1: 'like', V1_3rd: 'likes', V1_ing: 'liking', V2: 'liked', V3: 'liked',
      type: 'regular', frequency: 10, difficulty: 'beginner',
      irregular: false
    },
    {
      V1: 'eat', V1_3rd: 'eats', V1_ing: 'eating', V2: 'ate', V3: 'eaten',
      type: 'irregular', frequency: 9, difficulty: 'beginner',
      irregular: true
    },
    {
      V1: 'drink', V1_3rd: 'drinks', V1_ing: 'drinking', V2: 'drank', V3: 'drunk',
      type: 'irregular', frequency: 9, difficulty: 'beginner',
      irregular: true
    },
    {
      V1: 'sleep', V1_3rd: 'sleeps', V1_ing: 'sleeping', V2: 'slept', V3: 'slept',
      type: 'irregular', frequency: 9, difficulty: 'beginner',
      irregular: true
    },
    {
      V1: 'work', V1_3rd: 'works', V1_ing: 'working', V2: 'worked', V3: 'worked',
      type: 'regular', frequency: 9, difficulty: 'beginner',
      irregular: false
    }
  ],

  // Elementary level verbs (Levels 9-17)
  elementary: [
    {
      V1: 'play', V1_3rd: 'plays', V1_ing: 'playing', V2: 'played', V3: 'played',
      type: 'regular', frequency: 8, difficulty: 'elementary',
      irregular: false
    },
    {
      V1: 'read', V1_3rd: 'reads', V1_ing: 'reading', V2: 'read', V3: 'read',
      type: 'irregular', frequency: 8, difficulty: 'elementary',
      irregular: true
    },
    {
      V1: 'write', V1_3rd: 'writes', V1_ing: 'writing', V2: 'wrote', V3: 'written',
      type: 'irregular', frequency: 8, difficulty: 'elementary',
      irregular: true
    },
    {
      V1: 'speak', V1_3rd: 'speaks', V1_ing: 'speaking', V2: 'spoke', V3: 'spoken',
      type: 'irregular', frequency: 8, difficulty: 'elementary',
      irregular: true
    },
    {
      V1: 'listen', V1_3rd: 'listens', V1_ing: 'listening', V2: 'listened', V3: 'listened',
      type: 'regular', frequency: 8, difficulty: 'elementary',
      irregular: false
    },
    {
      V1: 'watch', V1_3rd: 'watches', V1_ing: 'watching', V2: 'watched', V3: 'watched',
      type: 'regular', frequency: 8, difficulty: 'elementary',
      irregular: false
    },
    {
      V1: 'live', V1_3rd: 'lives', V1_ing: 'living', V2: 'lived', V3: 'lived',
      type: 'regular', frequency: 8, difficulty: 'elementary',
      irregular: false
    },
    {
      V1: 'study', V1_3rd: 'studies', V1_ing: 'studying', V2: 'studied', V3: 'studied',
      type: 'regular', frequency: 8, difficulty: 'elementary',
      irregular: false
    },
    {
      V1: 'learn', V1_3rd: 'learns', V1_ing: 'learning', V2: 'learned', V3: 'learned',
      type: 'regular', frequency: 8, difficulty: 'elementary',
      irregular: false
    },
    {
      V1: 'teach', V1_3rd: 'teaches', V1_ing: 'teaching', V2: 'taught', V3: 'taught',
      type: 'irregular', frequency: 8, difficulty: 'elementary',
      irregular: true
    },
    {
      V1: 'help', V1_3rd: 'helps', V1_ing: 'helping', V2: 'helped', V3: 'helped',
      type: 'regular', frequency: 8, difficulty: 'elementary',
      irregular: false
    },
    {
      V1: 'find', V1_3rd: 'finds', V1_ing: 'finding', V2: 'found', V3: 'found',
      type: 'irregular', frequency: 8, difficulty: 'elementary',
      irregular: true
    },
    {
      V1: 'give', V1_3rd: 'gives', V1_ing: 'giving', V2: 'gave', V3: 'given',
      type: 'irregular', frequency: 8, difficulty: 'elementary',
      irregular: true
    },
    {
      V1: 'buy', V1_3rd: 'buys', V1_ing: 'buying', V2: 'bought', V3: 'bought',
      type: 'irregular', frequency: 8, difficulty: 'elementary',
      irregular: true
    },
    {
      V1: 'sell', V1_3rd: 'sells', V1_ing: 'selling', V2: 'sold', V3: 'sold',
      type: 'irregular', frequency: 8, difficulty: 'elementary',
      irregular: true
    },
    {
      V1: 'pay', V1_3rd: 'pays', V1_ing: 'paying', V2: 'paid', V3: 'paid',
      type: 'irregular', frequency: 8, difficulty: 'elementary',
      irregular: true
    }
  ],

  // Intermediate level verbs (Levels 18-33)
  intermediate: [
    {
      V1: 'understand', V1_3rd: 'understands', V1_ing: 'understanding', V2: 'understood', V3: 'understood',
      type: 'irregular', frequency: 7, difficulty: 'intermediate',
      irregular: true
    },
    {
      V1: 'remember', V1_3rd: 'remembers', V1_ing: 'remembering', V2: 'remembered', V3: 'remembered',
      type: 'regular', frequency: 7, difficulty: 'intermediate',
      irregular: false
    },
    {
      V1: 'forget', V1_3rd: 'forgets', V1_ing: 'forgetting', V2: 'forgot', V3: 'forgotten',
      type: 'irregular', frequency: 7, difficulty: 'intermediate',
      irregular: true
    },
    {
      V1: 'think', V1_3rd: 'thinks', V1_ing: 'thinking', V2: 'thought', V3: 'thought',
      type: 'irregular', frequency: 7, difficulty: 'intermediate',
      irregular: true
    },
    {
      V1: 'believe', V1_3rd: 'believes', V1_ing: 'believing', V2: 'believed', V3: 'believed',
      type: 'regular', frequency: 7, difficulty: 'intermediate',
      irregular: false
    },
    {
      V1: 'hope', V1_3rd: 'hopes', V1_ing: 'hoping', V2: 'hoped', V3: 'hoped',
      type: 'regular', frequency: 7, difficulty: 'intermediate',
      irregular: false
    },
    {
      V1: 'wish', V1_3rd: 'wishes', V1_ing: 'wishing', V2: 'wished', V3: 'wished',
      type: 'regular', frequency: 7, difficulty: 'intermediate',
      irregular: false
    },
    {
      V1: 'expect', V1_3rd: 'expects', V1_ing: 'expecting', V2: 'expected', V3: 'expected',
      type: 'regular', frequency: 7, difficulty: 'intermediate',
      irregular: false
    },
    {
      V1: 'plan', V1_3rd: 'plans', V1_ing: 'planning', V2: 'planned', V3: 'planned',
      type: 'regular', frequency: 7, difficulty: 'intermediate',
      irregular: false
    },
    {
      V1: 'decide', V1_3rd: 'decides', V1_ing: 'deciding', V2: 'decided', V3: 'decided',
      type: 'regular', frequency: 7, difficulty: 'intermediate',
      irregular: false
    },
    {
      V1: 'choose', V1_3rd: 'chooses', V1_ing: 'choosing', V2: 'chose', V3: 'chosen',
      type: 'irregular', frequency: 7, difficulty: 'intermediate',
      irregular: true
    },
    {
      V1: 'prefer', V1_3rd: 'prefers', V1_ing: 'preferring', V2: 'preferred', V3: 'preferred',
      type: 'regular', frequency: 7, difficulty: 'intermediate',
      irregular: false
    },
    {
      V1: 'enjoy', V1_3rd: 'enjoys', V1_ing: 'enjoying', V2: 'enjoyed', V3: 'enjoyed',
      type: 'regular', frequency: 7, difficulty: 'intermediate',
      irregular: false
    },
    {
      V1: 'hate', V1_3rd: 'hates', V1_ing: 'hating', V2: 'hated', V3: 'hated',
      type: 'regular', frequency: 7, difficulty: 'intermediate',
      irregular: false
    },
    {
      V1: 'love', V1_3rd: 'loves', V1_ing: 'loving', V2: 'loved', V3: 'loved',
      type: 'regular', frequency: 7, difficulty: 'intermediate',
      irregular: false
    },
    {
      V1: 'need', V1_3rd: 'needs', V1_ing: 'needing', V2: 'needed', V3: 'needed',
      type: 'regular', frequency: 7, difficulty: 'intermediate',
      irregular: false
    }
  ],

  // Advanced level verbs (Levels 34-45)
  advanced: [
    {
      V1: 'achieve', V1_3rd: 'achieves', V1_ing: 'achieving', V2: 'achieved', V3: 'achieved',
      type: 'regular', frequency: 6, difficulty: 'advanced',
      irregular: false
    },
    {
      V1: 'accomplish', V1_3rd: 'accomplishes', V1_ing: 'accomplishing', V2: 'accomplished', V3: 'accomplished',
      type: 'regular', frequency: 6, difficulty: 'advanced',
      irregular: false
    },
    {
      V1: 'succeed', V1_3rd: 'succeeds', V1_ing: 'succeeding', V2: 'succeeded', V3: 'succeeded',
      type: 'regular', frequency: 6, difficulty: 'advanced',
      irregular: false
    },
    {
      V1: 'fail', V1_3rd: 'fails', V1_ing: 'failing', V2: 'failed', V3: 'failed',
      type: 'regular', frequency: 6, difficulty: 'advanced',
      irregular: false
    },
    {
      V1: 'manage', V1_3rd: 'manages', V1_ing: 'managing', V2: 'managed', V3: 'managed',
      type: 'regular', frequency: 6, difficulty: 'advanced',
      irregular: false
    },
    {
      V1: 'organize', V1_3rd: 'organizes', V1_ing: 'organizing', V2: 'organized', V3: 'organized',
      type: 'regular', frequency: 6, difficulty: 'advanced',
      irregular: false
    },
    {
      V1: 'develop', V1_3rd: 'develops', V1_ing: 'developing', V2: 'developed', V3: 'developed',
      type: 'regular', frequency: 6, difficulty: 'advanced',
      irregular: false
    },
    {
      V1: 'improve', V1_3rd: 'improves', V1_ing: 'improving', V2: 'improved', V3: 'improved',
      type: 'regular', frequency: 6, difficulty: 'advanced',
      irregular: false
    },
    {
      V1: 'create', V1_3rd: 'creates', V1_ing: 'creating', V2: 'created', V3: 'created',
      type: 'regular', frequency: 6, difficulty: 'advanced',
      irregular: false
    },
    {
      V1: 'design', V1_3rd: 'designs', V1_ing: 'designing', V2: 'designed', V3: 'designed',
      type: 'regular', frequency: 6, difficulty: 'advanced',
      irregular: false
    }
  ]
};

// Verb Selector Class
export class VerbSelector {
  private verbDatabase: Record<string, VerbData[]>;

  constructor() {
    this.verbDatabase = enhancedVerbDatabase;
  }

  getVerbsForLevel(levelId: number): VerbData[] {
    let difficulty: string;
    
    if (levelId <= 8) {
      difficulty = 'beginner';
    } else if (levelId <= 17) {
      difficulty = 'elementary';
    } else if (levelId <= 33) {
      difficulty = 'intermediate';
    } else {
      difficulty = 'advanced';
    }

    return this.verbDatabase[difficulty] || [];
  }

  getVerbByBase(baseForm: string): VerbData | undefined {
    for (const difficulty in this.verbDatabase) {
      const verb = this.verbDatabase[difficulty].find(v => v.V1.toLowerCase() === baseForm.toLowerCase());
      if (verb) return verb;
    }
    return undefined;
  }

  getAllVerbs(): VerbData[] {
    return Object.values(this.verbDatabase).flat();
  }

  getVerbsByDifficulty(difficulty: string): VerbData[] {
    return this.verbDatabase[difficulty] || [];
  }

  getHighFrequencyVerbs(limit: number = 20): VerbData[] {
    const allVerbs = this.getAllVerbs();
    return allVerbs
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }
}

// Export the verb selector instance
export const verbSelector = new VerbSelector();

export default enhancedVerbDatabase;
