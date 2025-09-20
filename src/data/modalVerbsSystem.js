// Modal Verbs and Special Verbs System - Phase 3 Implementation
// Comprehensive system for modals, imperatives, and special constructions

export const modalVerbsSystem = {
  
  // Modal Verbs Categories
  modalVerbs: {
    ability: {
      verbs: ['can', 'could', 'be able to'],
      meaning: 'ability or possibility',
      examples: [
        'I can swim.',
        'She could speak French when she was young.',
        'We are able to help you.'
      ],
      patterns: {
        affirmative: 'Subject + modal + V1 + Object',
        negative: 'Subject + modal + not + V1 + Object',
        question: 'Modal + Subject + V1 + Object?'
      }
    },
    
    necessity: {
      verbs: ['must', 'have to', 'need to', 'should'],
      meaning: 'necessity or obligation',
      examples: [
        'You must study for the test.',
        'I have to go to work.',
        'We need to finish this project.',
        'She should eat more vegetables.'
      ],
      patterns: {
        affirmative: 'Subject + modal + V1 + Object',
        negative: 'Subject + don\'t/doesn\'t + have to + V1',
        question: 'Do/Does + Subject + have to + V1?'
      }
    },
    
    permission: {
      verbs: ['can', 'may', 'could'],
      meaning: 'permission or polite requests',
      examples: [
        'Can I use your phone?',
        'May I come in?',
        'Could you help me?'
      ],
      patterns: {
        question: 'Modal + I/you + V1?',
        response: 'Yes, you can. / No, you can\'t.'
      }
    },
    
    advice: {
      verbs: ['should', 'ought to', 'had better'],
      meaning: 'advice or recommendation',
      examples: [
        'You should see a doctor.',
        'We ought to leave early.',
        'You had better study hard.'
      ],
      patterns: {
        affirmative: 'Subject + should + V1 + Object',
        negative: 'Subject + shouldn\'t + V1 + Object'
      }
    },
    
    possibility: {
      verbs: ['might', 'may', 'could'],
      meaning: 'possibility or uncertainty',
      examples: [
        'It might rain tomorrow.',
        'She may be late.',
        'This could be the answer.'
      ],
      patterns: {
        affirmative: 'Subject + modal + V1 + Object',
        negative: 'Subject + might not + V1 + Object'
      }
    }
  },

  // Used To Family - Critical for ESOL students
  usedToFamily: {
    'used to': {
      meaning: 'past habits or states that are no longer true',
      pattern: 'Subject + used to + V1 + Object',
      examples: [
        'I used to live in Paris.',
        'She used to play tennis.',
        'We used to be friends.'
      ],
      negative: 'Subject + didn\'t use to + V1',
      question: 'Did + Subject + use to + V1?',
      timeContext: 'past_habit_no_longer_true'
    },
    
    'get used to': {
      meaning: 'become accustomed to something (process)',
      pattern: 'Subject + get/got used to + V1-ing/noun',
      examples: [
        'I\'m getting used to living here.',
        'She got used to the cold weather.',
        'We\'ll get used to the new system.'
      ],
      tenses: ['present', 'past', 'future'],
      timeContext: 'adaptation_process'
    },
    
    'be used to': {
      meaning: 'be accustomed to something (state)',
      pattern: 'Subject + am/is/are used to + V1-ing/noun',
      examples: [
        'I am used to working late.',
        'She is used to the noise.',
        'We are used to hot weather.'
      ],
      tenses: ['present', 'past'],
      timeContext: 'current_state_of_familiarity'
    }
  },

  // Imperative Forms
  imperatives: {
    affirmative: {
      pattern: 'V1 + Object (+ Extra)',
      examples: [
        'Open the door.',
        'Sit down.',
        'Please help me.',
        'Turn off the lights.'
      ],
      usage: 'commands, instructions, requests',
      politeness: {
        direct: 'Open the door.',
        polite: 'Please open the door.',
        very_polite: 'Could you please open the door?'
      }
    },
    
    negative: {
      pattern: 'Don\'t + V1 + Object',
      examples: [
        'Don\'t touch that.',
        'Don\'t be late.',
        'Don\'t forget your keys.',
        'Please don\'t smoke here.'
      ],
      usage: 'negative commands, warnings, prohibitions'
    },
    
    suggestions: {
      'let\'s': {
        pattern: 'Let\'s + V1 + Object',
        examples: [
          'Let\'s go to the movies.',
          'Let\'s have lunch together.',
          'Let\'s not argue about this.'
        ],
        meaning: 'suggestions for group action'
      },
      
      'how about': {
        pattern: 'How about + V1-ing/noun?',
        examples: [
          'How about going to the beach?',
          'How about pizza for dinner?',
          'How about we meet at 6 PM?'
        ],
        meaning: 'casual suggestions'
      },
      
      'what about': {
        pattern: 'What about + V1-ing/noun?',
        examples: [
          'What about visiting the museum?',
          'What about your homework?',
          'What about we try a different approach?'
        ],
        meaning: 'suggestions or asking for opinions'
      }
    }
  },

  // Preference Expressions
  preferences: {
    'would rather': {
      pattern: 'Subject + would rather + V1 + than + V1',
      examples: [
        'I would rather stay home than go out.',
        'She\'d rather walk than drive.',
        'We would rather eat pizza than burgers.'
      ],
      meaning: 'expressing preference between two options'
    },
    
    'prefer': {
      patterns: {
        'prefer + noun': 'I prefer coffee to tea.',
        'prefer + V1-ing': 'I prefer walking to driving.',
        'prefer to + V1': 'I prefer to walk.'
      },
      examples: [
        'I prefer chocolate ice cream.',
        'She prefers reading to watching TV.',
        'We prefer to eat at home.'
      ],
      meaning: 'expressing general preferences'
    },
    
    'like better': {
      pattern: 'Subject + like + Object + better than + Object',
      examples: [
        'I like coffee better than tea.',
        'She likes summer better than winter.',
        'We like this restaurant better than that one.'
      ],
      meaning: 'expressing preference (informal)'
    }
  },

  // Conditional Structures (Second Conditional for intermediate)
  conditionals: {
    second: {
      pattern: 'If + Subject + V2, Subject + would + V1',
      meaning: 'hypothetical or unlikely situations',
      examples: [
        'If I had money, I would travel.',
        'If she studied harder, she would pass.',
        'If we lived in Paris, we would speak French.'
      ],
      timeContext: 'hypothetical_present_or_future',
      difficulty: 'intermediate'
    }
  },

  // Tag Questions
  tagQuestions: {
    rules: {
      positive_statement: 'positive statement + negative tag',
      negative_statement: 'negative statement + positive tag',
      auxiliary_matching: 'tag uses same auxiliary as statement'
    },
    
    patterns: {
      'be_verb': {
        examples: [
          'You are happy, aren\'t you?',
          'She isn\'t coming, is she?',
          'They were here, weren\'t they?'
        ]
      },
      'do_does': {
        examples: [
          'You like pizza, don\'t you?',
          'She doesn\'t work here, does she?',
          'They play soccer, don\'t they?'
        ]
      },
      'modal_verbs': {
        examples: [
          'You can swim, can\'t you?',
          'She won\'t be late, will she?',
          'They should study, shouldn\'t they?'
        ]
      }
    },
    
    meaning: 'asking for confirmation or agreement',
    difficulty: 'intermediate'
  }
}

// Modal Verb Validation Functions
export class ModalVerbValidator {
  
  // Validate modal verb usage
  validateModalUsage(words, modalType, pattern) {
    const sentence = words.join(' ').toLowerCase()
    const modalRules = modalVerbsSystem.modalVerbs[modalType]
    
    if (!modalRules) return { isCorrect: true }

    // Check if sentence contains appropriate modal
    const hasModal = modalRules.verbs.some(modal => 
      sentence.includes(modal.toLowerCase())
    )

    if (!hasModal) {
      return {
        isCorrect: false,
        error: `This sentence needs a ${modalType} modal verb.`,
        suggestions: [`Try using: ${modalRules.verbs.join(', ')}`],
        examples: modalRules.examples
      }
    }

    // Check pattern structure
    return this.validateModalPattern(words, modalRules, pattern)
  }

  // Validate modal pattern structure
  validateModalPattern(words, modalRules, pattern) {
    // Check if main verb is in base form after modal
    const modalIndex = this.findModalIndex(words)
    if (modalIndex === -1) return { isCorrect: true }

    const verbAfterModal = words[modalIndex + 1]
    if (verbAfterModal && this.isMainVerb(verbAfterModal)) {
      const verb = this.getVerbInfo(verbAfterModal)
      if (verb && verbAfterModal.toLowerCase() !== verb.V1.toLowerCase()) {
        return {
          isCorrect: false,
          error: `Use base form (V1) "${verb.V1}" after modal verbs.`,
          suggestions: [`Change "${verbAfterModal}" to "${verb.V1}"`]
        }
      }
    }

    return { isCorrect: true }
  }

  // Validate "used to" family
  validateUsedToFamily(words, usedToType) {
    const sentence = words.join(' ').toLowerCase()
    const rules = modalVerbsSystem.usedToFamily[usedToType]
    
    if (!rules) return { isCorrect: true }

    // Check specific patterns for each type
    switch (usedToType) {
      case 'used to':
        return this.validateUsedTo(words, rules)
      case 'get used to':
        return this.validateGetUsedTo(words, rules)
      case 'be used to':
        return this.validateBeUsedTo(words, rules)
      default:
        return { isCorrect: true }
    }
  }

  // Validate "used to" (past habits)
  validateUsedTo(words, rules) {
    const sentence = words.join(' ').toLowerCase()
    
    if (!sentence.includes('used to')) {
      return {
        isCorrect: false,
        error: 'This sentence should use "used to" for past habits.',
        suggestions: ['Add "used to" before the main verb'],
        examples: rules.examples
      }
    }

    // Check if verb after "used to" is base form
    const usedToIndex = words.findIndex(word => word.toLowerCase() === 'to' && 
      words[words.indexOf(word) - 1]?.toLowerCase() === 'used')
    
    if (usedToIndex !== -1 && words[usedToIndex + 1]) {
      const verbAfter = words[usedToIndex + 1]
      const verb = this.getVerbInfo(verbAfter)
      if (verb && verbAfter.toLowerCase() !== verb.V1.toLowerCase()) {
        return {
          isCorrect: false,
          error: `Use base form (V1) "${verb.V1}" after "used to".`,
          suggestions: [`Change "${verbAfter}" to "${verb.V1}"`]
        }
      }
    }

    return { isCorrect: true }
  }

  // Validate imperative forms
  validateImperative(words, imperativeType) {
    const rules = modalVerbsSystem.imperatives[imperativeType]
    if (!rules) return { isCorrect: true }

    switch (imperativeType) {
      case 'affirmative':
        return this.validateAffirmativeImperative(words, rules)
      case 'negative':
        return this.validateNegativeImperative(words, rules)
      default:
        return { isCorrect: true }
    }
  }

  // Validate affirmative imperatives
  validateAffirmativeImperative(words, rules) {
    // Check if sentence starts with base verb (no subject)
    const firstWord = words[0]
    
    if (this.isSubject(firstWord)) {
      return {
        isCorrect: false,
        error: 'Imperatives don\'t need a subject. Start with the verb.',
        suggestions: [`Remove "${firstWord}" and start with the verb`],
        examples: rules.examples
      }
    }

    if (!this.isMainVerb(firstWord)) {
      return {
        isCorrect: false,
        error: 'Imperatives should start with a verb.',
        suggestions: ['Start your sentence with an action verb'],
        examples: rules.examples
      }
    }

    return { isCorrect: true }
  }

  // Validate negative imperatives
  validateNegativeImperative(words, rules) {
    const sentence = words.join(' ').toLowerCase()
    
    if (!sentence.startsWith('don\'t') && !sentence.startsWith('do not')) {
      return {
        isCorrect: false,
        error: 'Negative imperatives should start with "Don\'t".',
        suggestions: ['Start with "Don\'t" + base verb'],
        examples: rules.examples
      }
    }

    return { isCorrect: true }
  }

  // Validate tag questions
  validateTagQuestion(words) {
    const sentence = words.join(' ')
    const hasComma = sentence.includes(',')
    
    if (!hasComma) {
      return {
        isCorrect: false,
        error: 'Tag questions need a comma before the tag.',
        suggestions: ['Add a comma before the tag question'],
        examples: modalVerbsSystem.tagQuestions.patterns.be_verb.examples
      }
    }

    // More sophisticated tag question validation would go here
    return { isCorrect: true }
  }

  // Helper functions
  findModalIndex(words) {
    const modals = ['can', 'could', 'will', 'would', 'should', 'must', 'may', 'might']
    return words.findIndex(word => modals.includes(word.toLowerCase()))
  }

  isMainVerb(word) {
    // Simplified verb detection - in real implementation, use verb database
    const commonVerbs = ['go', 'come', 'eat', 'drink', 'play', 'work', 'study', 'live', 'like', 'love']
    return commonVerbs.includes(word.toLowerCase())
  }

  isSubject(word) {
    const subjects = ['I', 'you', 'he', 'she', 'it', 'we', 'they']
    return subjects.includes(word.toLowerCase())
  }

  getVerbInfo(word) {
    // This would connect to the enhanced verb database
    // Simplified for now
    return { V1: word.toLowerCase() }
  }
}

// Modal Verb Vocabulary for Word Tiles
export const modalVerbVocabulary = {
  'modal-verbs': [
    { word: 'can', category: 'ability-modal', meaning: 'ability/permission' },
    { word: 'could', category: 'ability-modal', meaning: 'past ability/polite request' },
    { word: 'will', category: 'future-modal', meaning: 'future/willingness' },
    { word: 'would', category: 'conditional-modal', meaning: 'conditional/polite request' },
    { word: 'should', category: 'advice-modal', meaning: 'advice/obligation' },
    { word: 'must', category: 'necessity-modal', meaning: 'strong necessity' },
    { word: 'may', category: 'permission-modal', meaning: 'permission/possibility' },
    { word: 'might', category: 'possibility-modal', meaning: 'weak possibility' }
  ],
  
  'special-verbs': [
    { word: 'used to', category: 'past-habit', meaning: 'past habits no longer true' },
    { word: 'get used to', category: 'adaptation', meaning: 'become accustomed' },
    { word: 'be used to', category: 'familiarity', meaning: 'be accustomed' },
    { word: 'have to', category: 'necessity', meaning: 'external obligation' },
    { word: 'need to', category: 'necessity', meaning: 'necessity' }
  ],
  
  'suggestion-words': [
    { word: "let's", category: 'suggestion', meaning: 'group suggestion' },
    { word: 'how about', category: 'suggestion', meaning: 'casual suggestion' },
    { word: 'what about', category: 'suggestion', meaning: 'suggestion/opinion' }
  ],
  
  'preference-words': [
    { word: 'would rather', category: 'preference', meaning: 'preference between options' },
    { word: 'prefer', category: 'preference', meaning: 'general preference' },
    { word: 'like better', category: 'preference', meaning: 'informal preference' }
  ]
}

// Export the modal verb validator
export const modalValidator = new ModalVerbValidator()

export default modalVerbsSystem

