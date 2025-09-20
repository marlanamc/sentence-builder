// Comprehensive Time Expression System - Phase 2 Implementation
import { TimeExpression } from './types';

export const timeExpressionSystem = {
  
  // Time Expression Categories
  timeExpressions: {
    // Present tense markers
    present: {
      frequency: ['always', 'usually', 'often', 'sometimes', 'rarely', 'never'],
      general: ['every day', 'every week', 'every month', 'every year'],
      specific: ['now', 'right now', 'at the moment', 'today'],
      continuous: ['now', 'right now', 'at the moment', 'currently', 'at present']
    },
    
    // Past tense markers (finished time)
    past: {
      finished: ['yesterday', 'last week', 'last month', 'last year', 'last night'],
      specific: ['in 2020', 'in January', 'on Monday', 'at 6 PM yesterday'],
      ago: ['2 hours ago', '3 days ago', 'a week ago', 'a month ago', 'a year ago'],
      continuous: ['at 6 PM yesterday', 'while I was eating', 'when she called']
    },
    
    // Present perfect markers (unfinished time or relevance)
    presentPerfect: {
      experience: ['ever', 'never', 'before', 'once', 'twice', 'many times'],
      recent: ['just', 'recently', 'lately', 'already'],
      duration: ['for 2 hours', 'for 3 days', 'since Monday', 'since 2019'],
      completion: ['yet', 'still', 'already', 'just'],
      unfinished: ['today', 'this week', 'this month', 'this year', 'so far']
    },
    
    // Future tense markers
    future: {
      general: ['tomorrow', 'next week', 'next month', 'next year'],
      specific: ['at 6 PM tomorrow', 'on Friday', 'in 2025'],
      plans: ['tonight', 'this weekend', 'soon', 'later'],
      predictions: ['probably', 'maybe', 'perhaps', 'definitely']
    }
  },

  // Time Preposition Rules
  timePrepositions: {
    'at': {
      uses: ['specific times', 'night', 'noon', 'midnight'],
      examples: ['at 6 PM', 'at night', 'at noon', 'at midnight'],
      pattern: 'at + specific time'
    },
    'on': {
      uses: ['days of week', 'dates', 'specific days'],
      examples: ['on Monday', 'on January 1st', 'on my birthday'],
      pattern: 'on + day/date'
    },
    'in': {
      uses: ['months', 'years', 'seasons', 'periods of day'],
      examples: ['in January', 'in 2023', 'in summer', 'in the morning'],
      pattern: 'in + month/year/season/period'
    }
  },

  // Frequency Expressions
  frequencyExpressions: {
    'once': ['once a day', 'once a week', 'once a month', 'once a year'],
    'twice': ['twice a day', 'twice a week', 'twice a month', 'twice a year'],
    'three times': ['three times a day', 'three times a week', 'three times a month'],
    'every': ['every day', 'every week', 'every month', 'every year'],
    'daily': ['daily', 'weekly', 'monthly', 'yearly']
  },

  // Duration Expressions
  durationExpressions: {
    'for': {
      pattern: 'for + period of time',
      examples: ['for 2 hours', 'for 3 days', 'for a week', 'for 5 years'],
      usage: 'duration of time'
    },
    'since': {
      pattern: 'since + starting point',
      examples: ['since Monday', 'since 2019', 'since last week', 'since I was born'],
      usage: 'starting point in time'
    },
    'ago': {
      pattern: 'period + ago',
      examples: ['2 hours ago', '3 days ago', 'a week ago', 'a year ago'],
      usage: 'past time from now'
    }
  }
};

// Time Expression Vocabulary for UI
export const timeExpressionVocabulary = {
  'time-markers': [
    { word: 'yesterday', category: 'time-marker', tense: 'past', isFinished: true },
    { word: 'today', category: 'time-marker', tense: 'present', isFinished: false },
    { word: 'tomorrow', category: 'time-marker', tense: 'future', isFinished: false },
    { word: 'now', category: 'time-marker', tense: 'present', isFinished: false },
    { word: 'last week', category: 'time-marker', tense: 'past', isFinished: true },
    { word: 'this week', category: 'time-marker', tense: 'present', isFinished: false },
    { word: 'next week', category: 'time-marker', tense: 'future', isFinished: false },
    { word: 'always', category: 'frequency-adverb', tense: 'present', isFinished: false },
    { word: 'usually', category: 'frequency-adverb', tense: 'present', isFinished: false },
    { word: 'sometimes', category: 'frequency-adverb', tense: 'present', isFinished: false },
    { word: 'never', category: 'frequency-adverb', tense: 'present', isFinished: false },
    { word: 'just', category: 'recent-word', tense: 'present_perfect', isFinished: false },
    { word: 'already', category: 'recent-word', tense: 'present_perfect', isFinished: false },
    { word: 'yet', category: 'completion-word', tense: 'present_perfect', isFinished: false },
    { word: 'still', category: 'completion-word', tense: 'present_perfect', isFinished: false }
  ],
  
  'time-prepositions': [
    { word: 'at', category: 'time-preposition', usage: 'specific times' },
    { word: 'on', category: 'time-preposition', usage: 'days and dates' },
    { word: 'in', category: 'time-preposition', usage: 'months, years, periods' }
  ],
  
  'frequency-expressions': [
    { word: 'once a day', category: 'frequency-expression', usage: 'one time per day' },
    { word: 'twice a week', category: 'frequency-expression', usage: 'two times per week' },
    { word: 'three times a month', category: 'frequency-expression', usage: 'three times per month' },
    { word: 'every day', category: 'frequency-expression', usage: 'daily' },
    { word: 'every week', category: 'frequency-expression', usage: 'weekly' }
  ],
  
  'duration-expressions': [
    { word: 'for 2 hours', category: 'duration-expression', usage: 'period of time' },
    { word: 'for 3 days', category: 'duration-expression', usage: 'period of time' },
    { word: 'since Monday', category: 'duration-expression', usage: 'starting point' },
    { word: 'since 2019', category: 'duration-expression', usage: 'starting point' },
    { word: '2 hours ago', category: 'duration-expression', usage: 'past time from now' },
    { word: '3 days ago', category: 'duration-expression', usage: 'past time from now' }
  ]
};

// Time Expression Validator Class
export class TimeExpressionValidator {
  private timeExpressions: typeof timeExpressionSystem.timeExpressions;
  private timePrepositions: typeof timeExpressionSystem.timePrepositions;

  constructor() {
    this.timeExpressions = timeExpressionSystem.timeExpressions;
    this.timePrepositions = timeExpressionSystem.timePrepositions;
  }

  validateTimeExpressionWithTense(timeExpr: string, tense: string): { isCorrect: boolean; explanation?: string; suggestion?: string } {
    const lowerExpr = timeExpr.toLowerCase();
    
    // Check if time expression is compatible with tense
    const tenseMarkers = this.getTenseMarkers(tense);
    const isCompatible = this.isTimeExpressionCompatible(lowerExpr, tenseMarkers);
    
    if (!isCompatible) {
      return {
        isCorrect: false,
        explanation: `"${timeExpr}" is not compatible with ${tense} tense.`,
        suggestion: `Use a ${tense} time marker instead.`
      };
    }
    
    return { isCorrect: true };
  }

  private getTenseMarkers(tense: string): string[] {
    switch (tense) {
      case 'present':
        return [
          ...this.timeExpressions.present.frequency,
          ...this.timeExpressions.present.general,
          ...this.timeExpressions.present.specific
        ];
      case 'past':
        return [
          ...this.timeExpressions.past.finished,
          ...this.timeExpressions.past.specific,
          ...this.timeExpressions.past.ago
        ];
      case 'present_perfect':
        return [
          ...this.timeExpressions.presentPerfect.experience,
          ...this.timeExpressions.presentPerfect.recent,
          ...this.timeExpressions.presentPerfect.duration,
          ...this.timeExpressions.presentPerfect.unfinished
        ];
      case 'future':
        return [
          ...this.timeExpressions.future.general,
          ...this.timeExpressions.future.specific,
          ...this.timeExpressions.future.plans
        ];
      default:
        return [];
    }
  }

  private isTimeExpressionCompatible(timeExpr: string, tenseMarkers: string[]): boolean {
    return tenseMarkers.some(marker => 
      timeExpr.includes(marker.toLowerCase()) || 
      marker.toLowerCase().includes(timeExpr)
    );
  }

  isFinishedTime(timeExpr: string): boolean {
    const lowerExpr = timeExpr.toLowerCase();
    const finishedMarkers = [
      ...this.timeExpressions.past.finished,
      ...this.timeExpressions.past.ago
    ];
    
    return finishedMarkers.some(marker => 
      lowerExpr.includes(marker.toLowerCase()) || 
      marker.toLowerCase().includes(lowerExpr)
    );
  }

  isUnfinishedTime(timeExpr: string): boolean {
    const lowerExpr = timeExpr.toLowerCase();
    const unfinishedMarkers = [
      ...this.timeExpressions.presentPerfect.unfinished,
      ...this.timeExpressions.present.specific
    ];
    
    return unfinishedMarkers.some(marker => 
      lowerExpr.includes(marker.toLowerCase()) || 
      marker.toLowerCase().includes(lowerExpr)
    );
  }

  extractTimeExpressions(sentence: string): string[] {
    const allTimeMarkers = [
      ...Object.values(this.timeExpressions.present).flat(),
      ...Object.values(this.timeExpressions.past).flat(),
      ...Object.values(this.timeExpressions.presentPerfect).flat(),
      ...Object.values(this.timeExpressions.future).flat()
    ];
    
    return allTimeMarkers.filter(marker => 
      sentence.toLowerCase().includes(marker.toLowerCase())
    );
  }
}

// Export the time expression validator instance
export const timeExpressionValidator = new TimeExpressionValidator();

export default timeExpressionSystem;
