// Comprehensive Time Expression System - Phase 2 Implementation
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
      uses: ['months', 'years', 'seasons', 'periods'],
      examples: ['in January', 'in 2023', 'in winter', 'in the morning'],
      pattern: 'in + period'
    }
  },

  // Duration vs Point in Time
  durationExpressions: {
    'for': {
      type: 'duration',
      meaning: 'period of time',
      examples: ['for 2 hours', 'for 3 days', 'for a week'],
      compatibleTenses: ['present_perfect', 'past', 'future'],
      pattern: 'for + period'
    },
    'since': {
      type: 'starting_point',
      meaning: 'from a specific time until now',
      examples: ['since Monday', 'since 2019', 'since I was young'],
      compatibleTenses: ['present_perfect'],
      pattern: 'since + starting point'
    },
    'ago': {
      type: 'past_from_now',
      meaning: 'time before now',
      examples: ['2 hours ago', '3 days ago', 'a year ago'],
      compatibleTenses: ['past'],
      pattern: 'period + ago'
    }
  },

  // Finished vs Unfinished Time (Critical for Present Perfect vs Past Simple)
  timeContexts: {
    finished: {
      markers: ['yesterday', 'last week', 'last month', 'last year', 'in 2020', 'ago'],
      tense: 'past_simple',
      explanation: 'Use Past Simple for finished time periods',
      examples: [
        'I ate pizza yesterday. (yesterday is finished)',
        'She worked last week. (last week is finished)',
        'They lived in Paris in 2020. (2020 is finished)'
      ]
    },
    unfinished: {
      markers: ['today', 'this week', 'this month', 'this year', 'recently'],
      tense: 'present_perfect',
      explanation: 'Use Present Perfect for unfinished time periods',
      examples: [
        'I have eaten pizza today. (today is not finished)',
        'She has worked this week. (this week is not finished)',
        'They have lived in Paris this year. (this year is not finished)'
      ]
    }
  },

  // Frequency Expressions
  frequencyExpressions: {
    adverbs: {
      position: 'before_main_verb',
      examples: ['always', 'usually', 'often', 'sometimes', 'rarely', 'never'],
      pattern: 'subject + frequency adverb + verb'
    },
    phrases: {
      position: 'end_of_sentence',
      pattern: 'number + times + a + period',
      examples: ['once a day', 'twice a week', 'three times a month'],
      structure: {
        numbers: ['once', 'twice', 'three times', 'four times'],
        periods: ['a day', 'a week', 'a month', 'a year']
      }
    }
  }
}

// Time Expression Validation Functions
export class TimeExpressionValidator {
  
  // Check if time expression is compatible with tense
  validateTimeExpressionWithTense(timeExpression, tense) {
    const expression = timeExpression.toLowerCase()
    
    // Check finished vs unfinished time for present perfect vs past simple
    if (tense === 'present_perfect' || tense === 'past_simple') {
      return this.validatePresentPerfectVsPastSimple(expression, tense)
    }
    
    // Check other tense compatibility
    return this.checkGeneralTenseCompatibility(expression, tense)
  }
  
  // The critical validation for present perfect vs past simple
  validatePresentPerfectVsPastSimple(expression, tense) {
    const finishedMarkers = timeExpressionSystem.timeContexts.finished.markers
    const unfinishedMarkers = timeExpressionSystem.timeContexts.unfinished.markers
    
    const isFinishedTime = finishedMarkers.some(marker => 
      expression.includes(marker) || expression.endsWith('ago')
    )
    const isUnfinishedTime = unfinishedMarkers.some(marker => 
      expression.includes(marker)
    )
    
    if (isFinishedTime && tense === 'past_simple') {
      return {
        isCorrect: true,
        explanation: `Correct! "${expression}" is finished time, so we use Past Simple.`
      }
    }
    
    if (isUnfinishedTime && tense === 'present_perfect') {
      return {
        isCorrect: true,
        explanation: `Correct! "${expression}" is unfinished time, so we use Present Perfect.`
      }
    }
    
    if (isFinishedTime && tense === 'present_perfect') {
      return {
        isCorrect: false,
        explanation: `"${expression}" is finished time. Use Past Simple, not Present Perfect.`,
        suggestion: 'Change to Past Simple (V2 form)'
      }
    }
    
    if (isUnfinishedTime && tense === 'past_simple') {
      return {
        isCorrect: false,
        explanation: `"${expression}" is unfinished time. Use Present Perfect, not Past Simple.`,
        suggestion: 'Change to Present Perfect (have/has + V3)'
      }
    }
    
    return { isCorrect: true } // No specific time marker found
  }
  
  // Check general tense compatibility
  checkGeneralTenseCompatibility(expression, tense) {
    const tenseMarkers = {
      present: timeExpressionSystem.timeExpressions.present,
      past: timeExpressionSystem.timeExpressions.past,
      future: timeExpressionSystem.timeExpressions.future
    }
    
    // Check if expression matches expected tense
    const expectedMarkers = tenseMarkers[tense.split('_')[0]] // Get base tense
    if (!expectedMarkers) return { isCorrect: true }
    
    const isCompatible = Object.values(expectedMarkers).some(markerArray =>
      markerArray.some(marker => expression.includes(marker))
    )
    
    return {
      isCorrect: isCompatible,
      explanation: isCompatible ? 
        `Good! "${expression}" works with ${tense}.` :
        `"${expression}" doesn't match ${tense}. Check your time expression.`
    }
  }
  
  // Validate duration expressions (for/since/ago)
  validateDurationExpression(expression, tense) {
    const durationTypes = timeExpressionSystem.durationExpressions
    
    for (const [word, rules] of Object.entries(durationTypes)) {
      if (expression.includes(word)) {
        const isCompatible = rules.compatibleTenses.includes(tense)
        return {
          isCorrect: isCompatible,
          explanation: isCompatible ?
            `Correct! "${word}" is used for ${rules.meaning}.` :
            `"${word}" is not compatible with ${tense}. ${rules.meaning}.`,
          suggestion: isCompatible ? null : `Use ${rules.compatibleTenses.join(' or ')}`
        }
      }
    }
    
    return { isCorrect: true }
  }
  
  // Validate time prepositions
  validateTimePreposition(expression) {
    const prepositions = timeExpressionSystem.timePrepositions
    
    for (const [prep, rules] of Object.entries(prepositions)) {
      if (expression.startsWith(prep + ' ')) {
        // Check if the usage follows the pattern
        const timeWord = expression.substring(prep.length + 1)
        const isCorrectUsage = this.checkPrepositionUsage(prep, timeWord, rules)
        
        return {
          isCorrect: isCorrectUsage,
          explanation: isCorrectUsage ?
            `Correct! Use "${prep}" ${rules.pattern}.` :
            `Check your preposition. ${rules.pattern}.`,
          examples: rules.examples
        }
      }
    }
    
    return { isCorrect: true }
  }
  
  checkPrepositionUsage(preposition, timeWord, rules) {
    // Simplified check - in real implementation, this would be more sophisticated
    const commonPatterns = {
      'at': /^\d+\s*(AM|PM|o'clock)|night|noon|midnight/i,
      'on': /monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d+/i,
      'in': /january|february|march|april|may|june|july|august|september|october|november|december|\d{4}|morning|afternoon|evening/i
    }
    
    const pattern = commonPatterns[preposition]
    return pattern ? pattern.test(timeWord) : true
  }
  
  // Get suggestions for time expressions based on tense
  getSuggestionsForTense(tense) {
    const suggestions = {
      present: timeExpressionSystem.timeExpressions.present.general,
      past: timeExpressionSystem.timeExpressions.past.finished,
      present_perfect: timeExpressionSystem.timeExpressions.presentPerfect.unfinished,
      future: timeExpressionSystem.timeExpressions.future.general
    }
    
    return suggestions[tense] || []
  }
  
  // Explain the difference between finished and unfinished time
  explainFinishedVsUnfinishedTime() {
    return {
      finished: {
        explanation: timeExpressionSystem.timeContexts.finished.explanation,
        examples: timeExpressionSystem.timeContexts.finished.examples,
        markers: timeExpressionSystem.timeContexts.finished.markers
      },
      unfinished: {
        explanation: timeExpressionSystem.timeContexts.unfinished.explanation,
        examples: timeExpressionSystem.timeContexts.unfinished.examples,
        markers: timeExpressionSystem.timeContexts.unfinished.markers
      }
    }
  }
}

// Time Expression Vocabulary for Word Tiles
export const timeExpressionVocabulary = {
  'time-prepositions': [
    { word: 'at', category: 'time-preposition', usage: 'specific times' },
    { word: 'on', category: 'time-preposition', usage: 'days and dates' },
    { word: 'in', category: 'time-preposition', usage: 'months, years, periods' }
  ],
  
  'time-markers': [
    { word: 'yesterday', category: 'past-marker', timeContext: 'finished' },
    { word: 'today', category: 'present-marker', timeContext: 'unfinished' },
    { word: 'tomorrow', category: 'future-marker', timeContext: 'future' },
    { word: 'last week', category: 'past-marker', timeContext: 'finished' },
    { word: 'this week', category: 'present-marker', timeContext: 'unfinished' },
    { word: 'next week', category: 'future-marker', timeContext: 'future' }
  ],
  
  'duration-expressions': [
    { word: 'for', category: 'duration', meaning: 'period of time', example: 'for 2 hours' },
    { word: 'since', category: 'starting-point', meaning: 'from specific time', example: 'since Monday' },
    { word: 'ago', category: 'past-from-now', meaning: 'time before now', example: '2 hours ago' }
  ],
  
  'frequency-expressions': [
    { word: 'always', category: 'frequency-adverb', position: 'before-verb' },
    { word: 'usually', category: 'frequency-adverb', position: 'before-verb' },
    { word: 'sometimes', category: 'frequency-adverb', position: 'before-verb' },
    { word: 'never', category: 'frequency-adverb', position: 'before-verb' },
    { word: 'once a day', category: 'frequency-phrase', position: 'end-sentence' },
    { word: 'twice a week', category: 'frequency-phrase', position: 'end-sentence' }
  ],
  
  'present-perfect-markers': [
    { word: 'ever', category: 'experience', usage: 'questions about life experience' },
    { word: 'never', category: 'experience', usage: 'negative life experience' },
    { word: 'just', category: 'recent', usage: 'very recent actions' },
    { word: 'already', category: 'completion', usage: 'completed actions' },
    { word: 'yet', category: 'completion', usage: 'questions and negatives' },
    { word: 'recently', category: 'recent', usage: 'recent actions' }
  ]
}

export default timeExpressionSystem

