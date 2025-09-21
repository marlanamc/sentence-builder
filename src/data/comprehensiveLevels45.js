// Complete 47-Level Grammar System - Based on Updated CSV Data
export const comprehensiveLevels47 = [

  // 🟢 PRESENT TENSE BASICS (Levels 1-8)
  {
    id: 1,
    name: 'Basic Affirmative',
    shortDescription: 'Simple sentences with subject + verb + object (no articles needed)',
    category: 'present-basics',
    pattern: 'Subject + V1/V1-3rd + Object (uncountable/plural)',
    formula: 'subject + verb + object',
    example: 'She eats pizza. / They play soccer. / We drink coffee.',
    explanation: 'Use V1 (base form) with I, you, we, they. Use V1-3rd (adds -s/-es) with he, she, it. Use uncountable nouns (pizza, soccer, coffee) or plural nouns (apples, books) - no articles needed.',
    requiredCategories: ['subjects', 'verbs', 'objects'],
    color: 'bg-green-50 border-green-200',
    points: 15,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['every day', 'usually', 'always'],
    grammarRules: {
      verbForm: 'present',
      subjectVerbAgreement: true,
      requiresObject: true,
      objectTypes: ['uncountable', 'plural'],
      noArticles: true
    }
  },
  {
    id: 2,
    name: 'Articles & Nouns',
    shortDescription: 'Using a, an, the with nouns',
    category: 'present-basics',
    pattern: 'Subject + V1/V1-3rd + a/an/the + Object',
    formula: 'subject + verb + a/an/the + object',
    example: 'I eat a sandwich. / She drinks the coffee.',
    explanation: 'Use "a" or "an" with singular countable nouns. Use "the" for specific things. No article with plural or uncountable nouns.',
    requiredCategories: ['subjects', 'verbs', 'objects', 'articles'],
    color: 'bg-green-50 border-green-200',
    points: 20,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['every morning', 'in the evening'],
    grammarRules: {
      verbForm: 'present',
      subjectVerbAgreement: true,
      requiresArticle: true,
      articleRules: 'countable'
    }
  },
  {
    id: 3,
    name: 'Negative Present',
    shortDescription: 'Making negative sentences with do/does not',
    category: 'present-basics',
    pattern: 'Subject + do/does + not + V1 + Object',
    formula: 'subject + do(es) + not + verb + object',
    example: 'I don\'t like vegetables. / She doesn\'t eat meat.',
    explanation: 'Use "do not" with I, you, we, they. Use "does not" with he, she, it. Always use V1 after do/does.',
    requiredCategories: ['subjects', 'verbs', 'objects', 'helpers', 'negatives'],
    color: 'bg-green-50 border-green-200',
    points: 25,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['never', 'not usually', 'rarely'],
    grammarRules: {
      verbForm: 'base',
      isNegative: true,
      requiresAuxiliary: 'do/does',
      auxiliaryAgreement: true
    }
  },
  {
    id: 4,
    name: 'Yes/No Questions',
    shortDescription: 'Asking questions with do/does',
    category: 'present-basics',
    pattern: 'Do/Does + Subject + V1 + Object?',
    formula: 'do(es) + subject + verb + object?',
    example: 'Do you like pizza? / Does she eat breakfast?',
    explanation: 'Use "Do" with I, you, we, they. Use "Does" with he, she, it. Always use V1 after do/does.',
    requiredCategories: ['helpers', 'subjects', 'verbs', 'objects'],
    color: 'bg-green-50 border-green-200',
    points: 30,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['every day', 'usually', 'often'],
    grammarRules: {
      verbForm: 'base',
      isQuestion: true,
      questionType: 'yes/no',
      requiresAuxiliary: 'do/does',
      auxiliaryFirst: true
    }
  },
  {
    id: 5,
    name: 'Wh-Questions (What)',
    shortDescription: 'Asking what questions',
    category: 'present-basics',
    pattern: 'What + do/does + Subject + V1?',
    formula: 'what + do(es) + subject + verb?',
    example: 'What do you eat?',
    explanation: 'Start with question word, then use do/does + subject + V1.',
    requiredCategories: ['question-words', 'helpers', 'subjects', 'verbs'],
    color: 'bg-green-50 border-green-200',
    points: 35,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['usually', 'every day', 'often'],
    grammarRules: {
      verbForm: 'base',
      isQuestion: true,
      questionType: 'wh',
      requiresQuestionWord: true,
      requiresAuxiliary: 'do/does'
    }
  },
  {
    id: 6,
    name: 'Wh-Questions (Who/Where/When)',
    shortDescription: 'Asking who, where, when questions',
    category: 'present-basics',
    pattern: 'Wh-word + do/does + Subject + V1?',
    formula: 'wh-word + do(es) + subject + verb?',
    example: 'Where do you live?',
    explanation: 'Use different question words (who, where, when) with the same pattern.',
    requiredCategories: ['question-words', 'helpers', 'subjects', 'verbs'],
    color: 'bg-green-50 border-green-200',
    points: 40,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['usually', 'every day', 'often'],
    grammarRules: {
      verbForm: 'base',
      isQuestion: true,
      questionType: 'wh',
      requiresQuestionWord: true,
      requiresAuxiliary: 'do/does'
    }
  },
  {
    id: 7,
    name: 'Present Continuous',
    shortDescription: 'Actions happening now with am/is/are + verb-ing',
    category: 'present-basics',
    pattern: 'Subject + am/is/are + V1-ing + Object',
    formula: 'subject + be + verb-ing + object',
    example: 'I am eating lunch. / She is studying English.',
    explanation: 'Use am (I), is (he/she/it), are (you/we/they) + verb-ing for actions happening now.',
    requiredCategories: ['subjects', 'be-verbs', 'verbs', 'objects'],
    color: 'bg-green-50 border-green-200',
    points: 45,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['now', 'right now', 'at the moment'],
    grammarRules: {
      verbForm: 'continuous',
      requiresAuxiliary: 'be',
      auxiliaryAgreement: true,
      verbEnding: '-ing'
    }
  },
  {
    id: 8,
    name: 'Present Continuous Questions',
    shortDescription: 'What are you doing? Where is she going?',
    category: 'present-basics',
    pattern: 'Wh-word + am/is/are + Subject + V1-ing?',
    formula: 'wh-word + be + subject + verb-ing?',
    example: 'What are you doing?',
    explanation: 'Start with question word, then am/is/are + subject + verb-ing.',
    requiredCategories: ['question-words', 'be-verbs', 'subjects', 'verbs'],
    color: 'bg-green-50 border-green-200',
    points: 50,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['now', 'right now', 'today'],
    grammarRules: {
      verbForm: 'continuous',
      isQuestion: true,
      questionType: 'wh',
      requiresQuestionWord: true,
      requiresAuxiliary: 'be',
      auxiliaryFirst: true,
      verbEnding: '-ing'
    }
  },

  // 🟡 TIME & EXPRESSIONS (Levels 9-12)
  {
    id: 9,
    name: 'Time Prepositions',
    shortDescription: 'Using at, on, in with time expressions',
    category: 'time-expressions',
    pattern: 'Subject + V1 + at/on/in + time',
    formula: 'subject + verb + time preposition + time',
    example: 'She studies on Monday.',
    explanation: 'Use "at" for specific times, "on" for days/dates, "in" for months/years/periods.',
    requiredCategories: ['subjects', 'verbs', 'time-prepositions', 'time-expressions'],
    color: 'bg-yellow-50 border-yellow-200',
    points: 55,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['at 3 PM', 'on Monday', 'in January', 'in the morning'],
    grammarRules: {
      verbForm: 'present',
      subjectVerbAgreement: true,
      requiresTimeExpression: true,
      timePrepositionRules: {
        'at': ['specific times', 'night'],
        'on': ['days', 'dates'],
        'in': ['months', 'years', 'periods']
      }
    }
  },
  {
    id: 10,
    name: 'Frequency Adverbs',
    shortDescription: 'Always, usually, sometimes, never with present tense',
    category: 'time-expressions',
    pattern: 'Subject + adv + V1 + Object',
    formula: 'subject + always/usually/sometimes + verb + object',
    example: 'I always eat breakfast.',
    explanation: 'Frequency adverbs go before the main verb but after "be" verbs.',
    requiredCategories: ['subjects', 'frequency-adverbs', 'verbs', 'objects'],
    color: 'bg-yellow-50 border-yellow-200',
    points: 60,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['always', 'usually', 'sometimes', 'never'],
    grammarRules: {
      verbForm: 'present',
      subjectVerbAgreement: true,
      requiresAdverb: 'frequency',
      adverbPosition: 'before-verb'
    }
  },
  {
    id: 11,
    name: 'Frequency Expressions',
    shortDescription: 'Once a week, twice a day, three times a month',
    category: 'time-expressions',
    pattern: 'Subject + V1 + Object + frequency expression',
    formula: 'subject + verb + object + once/twice/three times + period',
    example: 'She visits once a month.',
    explanation: 'Use once/twice/three times + a + time period to show how often.',
    requiredCategories: ['subjects', 'verbs', 'objects', 'frequency-expressions'],
    color: 'bg-yellow-50 border-yellow-200',
    points: 65,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['once a day', 'twice a week', 'three times a month'],
    grammarRules: {
      verbForm: 'present',
      subjectVerbAgreement: true,
      requiresFrequencyExpression: true,
      frequencyPattern: 'number + times + a + period'
    }
  },
  {
    id: 12,
    name: 'Zero Conditional',
    shortDescription: 'Facts and rules with if + present simple',
    category: 'time-expressions',
    pattern: 'If + Present Simple, Present Simple',
    formula: 'if + present, present',
    example: 'If you heat water, it boils.',
    explanation: 'Use zero conditional for facts, rules, and general truths. Both clauses use present simple.',
    requiredCategories: ['subjects', 'verbs', 'duration-expressions'],
    color: 'bg-yellow-50 border-yellow-200',
    points: 70,
    unlockRequirement: 0,
    difficulty: 'elementary',
    timeExpressions: ['for 2 hours', 'since Monday', '3 days ago'],
    grammarRules: {
      verbForm: 'conditional',
      conditionalType: 'zero',
      conditionalStructure: {
        'if_clause': 'present_simple',
        'result_clause': 'present_simple'
      },
      usedFor: ['facts', 'rules', 'general_truths']
    }
  },

  // 🔴 PAST TENSE (Levels 13-17)
  {
    id: 13,
    name: 'Past Simple Affirmative',
    shortDescription: 'V2 forms and irregular verbs',
    category: 'past-tense',
    pattern: 'Subject + V2 + Object',
    formula: 'subject + past verb + object',
    example: 'I ate pizza yesterday.',
    explanation: 'Use V2 (past form) for completed actions in the past. Regular verbs add -ed, irregular verbs change completely.',
    requiredCategories: ['subjects', 'verbs', 'objects', 'time-markers'],
    color: 'bg-red-50 border-red-200',
    points: 75,
    unlockRequirement: 0,
    difficulty: 'elementary',
    timeExpressions: ['yesterday', 'last week', 'in 2020', '3 days ago'],
    grammarRules: {
      verbForm: 'past',
      requiresV2: true,
      timeContext: 'finished',
      irregularVerbsAllowed: true
    }
  },
  {
    id: 14,
    name: 'Past Simple Negative',
    shortDescription: 'Didn\'t + V1 structure',
    category: 'past-tense',
    pattern: 'Subject + didn\'t + V1 + Object',
    formula: 'subject + didn\'t + verb + object',
    example: 'She didn\'t go to work.',
    explanation: 'Use "didn\'t" + V1 (base form) for negative past sentences. Don\'t use V2 after didn\'t.',
    requiredCategories: ['subjects', 'helpers', 'negatives', 'verbs', 'objects'],
    color: 'bg-red-50 border-red-200',
    points: 80,
    unlockRequirement: 0,
    difficulty: 'elementary',
    timeExpressions: ['yesterday', 'last night', 'last week'],
    grammarRules: {
      verbForm: 'base',
      isNegative: true,
      requiresAuxiliary: 'did',
      timeContext: 'finished',
      noV2AfterAuxiliary: true
    }
  },
  {
    id: 15,
    name: 'Past Simple Questions',
    shortDescription: 'Did + subject + V1?',
    category: 'past-tense',
    pattern: 'Did + Subject + V1 + Object?',
    formula: 'did + subject + verb + object?',
    example: 'Did you eat lunch?',
    explanation: 'Use "Did" + subject + V1 (base form) for past questions. Don\'t use V2 after did.',
    requiredCategories: ['helpers', 'subjects', 'verbs', 'objects'],
    color: 'bg-red-50 border-red-200',
    points: 85,
    unlockRequirement: 0,
    difficulty: 'elementary',
    timeExpressions: ['yesterday', 'last week', 'in 2020'],
    grammarRules: {
      verbForm: 'base',
      isQuestion: true,
      questionType: 'yes/no',
      requiresAuxiliary: 'did',
      auxiliaryFirst: true,
      timeContext: 'finished',
      noV2AfterAuxiliary: true
    }
  },
  {
    id: 16,
    name: 'Past Continuous',
    shortDescription: 'Was/were + verb-ing for ongoing past actions',
    category: 'past-tense',
    pattern: 'Subject + was/were + V1-ing + Object',
    formula: 'subject + was/were + verb-ing + object',
    example: 'They were playing soccer.',
    explanation: 'Use was (I/he/she/it) or were (you/we/they) + verb-ing for ongoing actions in the past.',
    requiredCategories: ['subjects', 'be-verbs', 'verbs', 'objects'],
    color: 'bg-red-50 border-red-200',
    points: 90,
    unlockRequirement: 0,
    difficulty: 'elementary',
    timeExpressions: ['at 6 PM yesterday', 'while', 'when'],
    grammarRules: {
      verbForm: 'continuous',
      requiresAuxiliary: 'was/were',
      auxiliaryAgreement: true,
      verbEnding: '-ing',
      timeContext: 'ongoing_past'
    }
  },
  {
    id: 17,
    name: 'Passive Voice (Intro)',
    shortDescription: 'Simple passives with was/were + V3',
    category: 'past-tense',
    pattern: 'Subject + was/were + V3',
    formula: 'subject + be verb + past participle',
    example: 'The book was read by Maria.',
    explanation: 'Use passive voice when the action is more important than who does it. Use was/were + V3.',
    requiredCategories: ['subjects', 'be-verbs', 'verbs'],
    color: 'bg-red-50 border-red-200',
    points: 95,
    unlockRequirement: 0,
    difficulty: 'elementary',
    timeExpressions: ['yesterday', 'last week', 'by someone'],
    grammarRules: {
      verbForm: 'passive',
      requiresAuxiliary: 'was/were',
      requiresV3: true,
      passiveStructure: 'be_verb_plus_v3',
      focusOnAction: true
    }
  },

  // 🟣 PRESENT PERFECT (Levels 18-24)
  {
    id: 18,
    name: 'Present Perfect Introduction',
    shortDescription: 'Have/has + V3 basics',
    category: 'present-perfect',
    pattern: 'Subject + have/has + V3 + Object',
    formula: 'subject + have/has + past participle + object',
    example: 'She has visited Paris.',
    explanation: 'Use have (I/you/we/they) or has (he/she/it) + V3 (past participle) for actions with present relevance.',
    requiredCategories: ['subjects', 'have-verbs', 'verbs', 'objects'],
    color: 'bg-purple-50 border-purple-200',
    points: 100,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: ['already', 'just', 'recently'],
    isChallengingLevel: true,
    grammarRules: {
      verbForm: 'perfect',
      requiresAuxiliary: 'have/has',
      auxiliaryAgreement: true,
      requiresV3: true,
      timeContext: 'unfinished_or_relevant'
    }
  },
  {
    id: 19,
    name: 'Present Perfect Experience',
    shortDescription: 'Ever/never questions and responses',
    category: 'present-perfect',
    pattern: 'Have/Has + Subject + ever + V3?',
    formula: 'have/has + subject + ever + past participle?',
    example: 'Have you ever been to Japan?',
    explanation: 'Use "ever" in questions about life experiences. Use "never" for negative experiences.',
    requiredCategories: ['have-verbs', 'subjects', 'experience-words', 'verbs'],
    color: 'bg-purple-50 border-purple-200',
    points: 105,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: ['ever', 'never', 'before'],
    isChallengingLevel: true,
    grammarRules: {
      verbForm: 'perfect',
      isQuestion: true,
      questionType: 'experience',
      requiresAuxiliary: 'have/has',
      requiresV3: true,
      experienceWords: ['ever', 'never', 'before'],
      timeContext: 'life_experience'
    }
  },
  {
    id: 20,
    name: 'Present Perfect Recent Actions',
    shortDescription: 'Just, recently, already for recent past',
    category: 'present-perfect',
    pattern: 'Subject + have/has + just/already + V3',
    formula: 'subject + have/has + just/recently/already + past participle',
    example: 'I have just finished homework.',
    explanation: 'Use "just" for very recent actions, "recently" for recent actions, "already" for completed actions.',
    requiredCategories: ['subjects', 'have-verbs', 'recent-words', 'verbs'],
    color: 'bg-purple-50 border-purple-200',
    points: 110,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: ['just', 'recently', 'already'],
    isChallengingLevel: true,
    grammarRules: {
      verbForm: 'perfect',
      requiresAuxiliary: 'have/has',
      requiresV3: true,
      recentWords: ['just', 'recently', 'already'],
      timeContext: 'recent_past_with_present_relevance'
    }
  },
  {
    id: 21,
    name: 'Present Perfect Duration',
    shortDescription: 'For/since with unfinished actions',
    category: 'present-perfect',
    pattern: 'Subject + have/has + V3 + for/since',
    formula: 'subject + have/has + past participle + for/since + time',
    example: 'I have lived here for 5 years.',
    explanation: 'Use "for" + period of time, "since" + starting point for actions continuing to now.',
    requiredCategories: ['subjects', 'have-verbs', 'verbs', 'duration-expressions'],
    color: 'bg-purple-50 border-purple-200',
    points: 115,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: ['for 5 years', 'since 2019', 'since Monday'],
    isChallengingLevel: true,
    grammarRules: {
      verbForm: 'perfect',
      requiresAuxiliary: 'have/has',
      requiresV3: true,
      requiresDurationExpression: true,
      durationRules: {
        'for': 'period_of_time',
        'since': 'starting_point'
      },
      timeContext: 'unfinished_duration'
    }
  },
  {
    id: 22,
    name: 'Present Perfect vs Past Simple',
    shortDescription: 'THE CRITICAL COMPARISON - finished vs unfinished time',
    category: 'present-perfect',
    pattern: 'Finished time = Past Simple / Unfinished time = Present Perfect',
    formula: 'yesterday/last week = past / today/this week = present perfect',
    example: 'I ate pizza yesterday. / I have eaten pizza today.',
    explanation: 'Use Past Simple for finished time periods. Use Present Perfect for unfinished time periods.',
    requiredCategories: ['subjects', 'verbs', 'time-markers', 'have-verbs'],
    color: 'bg-purple-50 border-purple-200',
    points: 120,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: ['yesterday vs today', 'last week vs this week', 'in 2020 vs this year'],
    isChallengingLevel: true,
    isCriticalLevel: true,
    grammarRules: {
      tenseComparison: true,
      finishedTimeMarkers: ['yesterday', 'last week', 'last month', 'in 2020', 'ago'],
      unfinishedTimeMarkers: ['today', 'this week', 'this month', 'this year'],
      tenseSelection: {
        'finished_time': 'past_simple',
        'unfinished_time': 'present_perfect'
      }
    }
  },
  {
    id: 23,
    name: 'Present Perfect with Yet/Still',
    shortDescription: 'Yet for questions/negatives, still for ongoing situations',
    category: 'present-perfect',
    pattern: 'Subject + haven\'t/hasn\'t + V3 + yet/still',
    formula: 'subject + haven\'t/hasn\'t + past participle + yet',
    example: 'I haven\'t finished yet.',
    explanation: 'Use "yet" in questions and negatives about expected completion. "Still" emphasizes ongoing situation.',
    requiredCategories: ['have-verbs', 'subjects', 'verbs', 'completion-words'],
    color: 'bg-purple-50 border-purple-200',
    points: 125,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: ['yet', 'still', 'not yet'],
    isChallengingLevel: true,
    grammarRules: {
      verbForm: 'perfect',
      requiresAuxiliary: 'have/has',
      requiresV3: true,
      completionWords: ['yet', 'still'],
      yetRules: 'questions_and_negatives_only',
      stillRules: 'emphasizes_ongoing_situation'
    }
  },
  {
    id: 24,
    name: 'Present Perfect Mixed Practice',
    shortDescription: 'Real-world usage combining all present perfect forms',
    category: 'present-perfect',
    pattern: 'All PP forms',
    formula: 'experience + recent + duration + completion',
    example: 'Real-life usage',
    explanation: 'Practice all present perfect uses together: experience, recent actions, duration, and completion.',
    requiredCategories: ['subjects', 'have-verbs', 'verbs', 'objects', 'time-expressions'],
    color: 'bg-purple-50 border-purple-200',
    points: 130,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: ['ever', 'never', 'just', 'already', 'yet', 'for', 'since'],
    isChallengingLevel: true,
    grammarRules: {
      verbForm: 'perfect',
      mixedPractice: true,
      allPresentPerfectUses: ['experience', 'recent', 'duration', 'completion'],
      requiresAuxiliary: 'have/has',
      requiresV3: true
    }
  },

  // 🔵 FUTURE TENSE (Levels 25-28)
  {
    id: 25,
    name: 'Going to',
    shortDescription: 'Plans and intentions',
    category: 'future-tenses',
    pattern: 'Subject + am/is/are + going to + V1',
    formula: 'subject + be + going to + verb',
    example: 'I am going to study tonight.',
    explanation: 'Use "going to" for plans, intentions, and predictions based on evidence.',
    requiredCategories: ['subjects', 'be-verbs', 'going-to', 'verbs'],
    color: 'bg-blue-50 border-blue-200',
    points: 135,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: ['tomorrow', 'next week', 'next year', 'soon'],
    grammarRules: {
      verbForm: 'future',
      futureType: 'going_to',
      requiresAuxiliary: 'be',
      auxiliaryAgreement: true,
      requiresBaseVerb: true,
      usedFor: ['plans', 'intentions', 'predictions_with_evidence']
    }
  },
  {
    id: 26,
    name: 'Will',
    shortDescription: 'Predictions and promises',
    category: 'future-tenses',
    pattern: 'Subject + will + V1 + Object',
    formula: 'subject + will + verb + object',
    example: 'I will help you.',
    explanation: 'Use "will" for predictions, promises, spontaneous decisions, and offers.',
    requiredCategories: ['subjects', 'will', 'verbs', 'objects'],
    color: 'bg-blue-50 border-blue-200',
    points: 140,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: ['tomorrow', 'next week', 'in the future', 'probably'],
    grammarRules: {
      verbForm: 'future',
      futureType: 'will',
      requiresModal: 'will',
      requiresBaseVerb: true,
      usedFor: ['predictions', 'promises', 'spontaneous_decisions', 'offers']
    }
  },
  {
    id: 27,
    name: 'First Conditional',
    shortDescription: 'Future possibilities with if + present, will',
    category: 'future-tenses',
    pattern: 'If + Present, will + V1',
    formula: 'if + present simple, will + base verb',
    example: 'If it rains, I will stay home.',
    explanation: 'Use first conditional for future possibilities. If-clause uses present simple, result clause uses will.',
    requiredCategories: ['conditionals', 'subjects', 'verbs'],
    color: 'bg-blue-50 border-blue-200',
    points: 142,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: ['if', 'when', 'unless'],
    grammarRules: {
      verbForm: 'conditional',
      conditionalType: 'first',
      conditionalStructure: {
        'if_clause': 'present_simple',
        'result_clause': 'will_plus_base'
      },
      usedFor: ['future_possibilities', 'likely_results']
    }
  },
  {
    id: 28,
    name: 'Future Continuous',
    shortDescription: 'Will be + verb-ing for ongoing future actions',
    category: 'future-tenses',
    pattern: 'Subject + will be + V1-ing + Object',
    formula: 'subject + will be + verb-ing + object',
    example: 'I will be working at 3 PM.',
    explanation: 'Use "will be" + verb-ing for actions that will be in progress at a specific future time.',
    requiredCategories: ['subjects', 'will', 'be-verbs', 'verbs', 'objects'],
    color: 'bg-blue-50 border-blue-200',
    points: 145,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: ['at 6 PM tomorrow', 'this time next week', 'while'],
    grammarRules: {
      verbForm: 'future_continuous',
      requiresModal: 'will',
      requiresAuxiliary: 'be',
      verbEnding: '-ing',
      usedFor: ['ongoing_future_actions', 'specific_future_time']
    }
  },
  {
    id: 29,
    name: 'Future Perfect',
    shortDescription: 'Will have + V3 for completed future actions',
    category: 'future-tenses',
    pattern: 'Subject + will have + V3 + by time',
    formula: 'subject + will have + past participle + by + time',
    example: 'She will have graduated by June.',
    explanation: 'Use "will have" + V3 for actions that will be completed before a specific future time.',
    requiredCategories: ['subjects', 'will', 'have-verbs', 'verbs'],
    color: 'bg-blue-50 border-blue-200',
    points: 150,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: ['by 6 PM', 'by tomorrow', 'by next week'],
    grammarRules: {
      verbForm: 'future_perfect',
      requiresModal: 'will',
      requiresAuxiliary: 'have',
      requiresV3: true,
      usedFor: ['completed_before_future_time'],
      requiresTimeMarker: 'by'
    }
  },

  // 🟠 MODALS & SPECIAL VERBS (Levels 29-33)
  {
    id: 30,
    name: 'Can/Should/Must',
    shortDescription: 'Modal verbs for ability, advice, and obligation',
    category: 'modals-special',
    pattern: 'Subject + modal + V1',
    formula: 'subject + can/should/must + verb',
    example: 'You should study.',
    explanation: 'Use modals + base verb for ability (can), advice (should), and obligation (must).',
    requiredCategories: ['subjects', 'modals', 'verbs'],
    color: 'bg-orange-50 border-orange-200',
    points: 155,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'modal',
      requiresModal: true,
      requiresBaseVerb: true,
      modalTypes: ['ability', 'advice', 'obligation']
    }
  },
  {
    id: 31,
    name: 'Used To Family',
    shortDescription: 'Past habits and adaptation',
    category: 'modals-special',
    pattern: 'Multiple patterns',
    formula: 'used to / be used to / get used to',
    example: 'I used to live in Paris.',
    explanation: 'Different meanings: past habits (used to), current adaptation (be used to), becoming adapted (get used to).',
    requiredCategories: ['subjects', 'used-to-forms', 'verbs'],
    color: 'bg-orange-50 border-orange-200',
    points: 160,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'special',
      usedToTypes: {
        'used_to': 'past_habits',
        'be_used_to': 'current_adaptation',
        'get_used_to': 'becoming_adapted'
      }
    }
  },
  {
    id: 32,
    name: 'Have To vs Must',
    shortDescription: 'External vs internal obligation',
    category: 'modals-special',
    pattern: 'Subject + have to/must + V1',
    formula: 'subject + have to/must + verb',
    example: 'I must study.',
    explanation: 'Have to = external obligation (rules). Must = internal obligation (personal).',
    requiredCategories: ['subjects', 'obligation-words', 'verbs'],
    color: 'bg-orange-50 border-orange-200',
    points: 165,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'obligation',
      obligationTypes: {
        'have_to': 'external_obligation',
        'must': 'internal_obligation'
      }
    }
  },
  {
    id: 33,
    name: 'Gerunds & Infinitives',
    shortDescription: 'Verb complements - when to use -ing vs to',
    category: 'modals-special',
    pattern: 'Verb + V1-ing / Verb + to + V1',
    formula: 'verb + gerund / verb + infinitive',
    example: 'I enjoy swimming. / I want to swim.',
    explanation: 'Some verbs take gerunds (-ing), others take infinitives (to + base). Must be memorized.',
    requiredCategories: ['subjects', 'verbs', 'gerunds', 'infinitives'],
    color: 'bg-orange-50 border-orange-200',
    points: 168,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'complement',
      complementTypes: {
        'gerund_verbs': ['enjoy', 'finish', 'avoid', 'suggest'],
        'infinitive_verbs': ['want', 'need', 'decide', 'hope'],
        'both_verbs': ['like', 'love', 'hate', 'prefer']
      }
    }
  },
  {
    id: 34,
    name: 'Preferences',
    shortDescription: 'Prefer and would rather',
    category: 'modals-special',
    pattern: 'Subject + prefer/would rather + V1/V1-ing',
    formula: 'subject + prefer/would rather + verb form',
    example: 'I prefer walking.',
    explanation: 'Express preferences: prefer + gerund/noun, would rather + base verb.',
    requiredCategories: ['subjects', 'preference-words', 'verbs'],
    color: 'bg-orange-50 border-orange-200',
    points: 170,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'preference',
      preferencePatterns: {
        'prefer': 'gerund_or_noun',
        'would_rather': 'base_verb'
      }
    }
  },
  {
    id: 35,
    name: 'Permission & Requests',
    shortDescription: 'Can I, Could I, May I - politeness levels',
    category: 'modals-special',
    pattern: 'Can/Could/May + Subject + V1?',
    formula: 'modal + subject + verb?',
    example: 'Can I use your phone?',
    explanation: 'Politeness hierarchy: Can (informal) → Could (polite) → May (formal).',
    requiredCategories: ['permission-modals', 'subjects', 'verbs'],
    color: 'bg-orange-50 border-orange-200',
    points: 175,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'permission',
      politenessLevels: {
        'can': 'informal',
        'could': 'polite',
        'may': 'formal'
      }
    }
  },

  // 🟤 COMMANDS & SUGGESTIONS (Levels 34-36)
  {
    id: 36,
    name: 'Imperatives',
    shortDescription: 'Commands and instructions',
    category: 'commands-suggestions',
    pattern: 'V1 + Object / Don\'t + V1 + Object',
    formula: 'verb + object / don\'t + verb + object',
    example: 'Open the door.',
    explanation: 'Use base verb without subject for commands. Add "don\'t" for negative commands.',
    requiredCategories: ['verbs', 'objects', 'negatives'],
    color: 'bg-amber-50 border-amber-200',
    points: 180,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'imperative',
      noSubject: true,
      canBeNegative: true
    }
  },
  {
    id: 37,
    name: 'Let\'s Suggestions',
    shortDescription: 'Group suggestions and invitations',
    category: 'commands-suggestions',
    pattern: 'Let\'s + V1 + Object',
    formula: 'let\'s + verb + object',
    example: 'Let\'s go to the movies.',
    explanation: 'Use "Let\'s" + base verb for group suggestions and invitations.',
    requiredCategories: ['lets', 'verbs', 'objects'],
    color: 'bg-amber-50 border-amber-200',
    points: 185,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'suggestion',
      suggestionType: 'group',
      requiresLets: true
    }
  },
  {
    id: 38,
    name: 'How About/What About',
    shortDescription: 'Casual suggestions with gerunds and nouns',
    category: 'commands-suggestions',
    pattern: 'How about/What about + V1-ing/noun',
    formula: 'how/what about + gerund/noun',
    example: 'How about pizza?',
    explanation: 'Use "How about" or "What about" + gerund or noun for casual suggestions.',
    requiredCategories: ['suggestion-phrases', 'verbs', 'objects'],
    color: 'bg-amber-50 border-amber-200',
    points: 190,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'suggestion',
      suggestionType: 'casual',
      requiresGerundOrNoun: true
    }
  },

  // ⚫ COMPARISONS (Levels 37-39)
  {
    id: 39,
    name: 'Comparatives',
    shortDescription: 'Comparing two things',
    category: 'comparisons',
    pattern: 'Subject + V1 + comparative + than + Object',
    formula: 'subject + verb + -er than / more than + object',
    example: 'She is taller than me.',
    explanation: 'Use -er + than for short adjectives, more + than for long adjectives.',
    requiredCategories: ['subjects', 'verbs', 'comparatives', 'objects'],
    color: 'bg-gray-50 border-gray-200',
    points: 195,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'comparison',
      comparisonType: 'comparative',
      comparativeRules: {
        'short_adjectives': 'add_er',
        'long_adjectives': 'use_more'
      }
    }
  },
  {
    id: 40,
    name: 'Superlatives',
    shortDescription: 'Comparing within a group',
    category: 'comparisons',
    pattern: 'Subject + V1 + the + superlative',
    formula: 'subject + verb + the + -est / the most + adjective',
    example: 'She is the tallest student.',
    explanation: 'Use the + -est for short adjectives, the most + adjective for long adjectives.',
    requiredCategories: ['subjects', 'verbs', 'superlatives', 'objects'],
    color: 'bg-gray-50 border-gray-200',
    points: 200,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'comparison',
      comparisonType: 'superlative',
      superlativeRules: {
        'short_adjectives': 'the_plus_est',
        'long_adjectives': 'the_most_plus_adjective'
      }
    }
  },
  {
    id: 41,
    name: 'Indefinite Pronouns',
    shortDescription: 'Someone, nothing, anything, everyone',
    category: 'comparisons',
    pattern: 'someone/nothing/anything/everyone + verb',
    formula: 'indefinite pronoun + verb',
    example: 'Someone is calling.',
    explanation: 'Indefinite pronouns refer to people or things without being specific. High frequency in natural English.',
    requiredCategories: ['indefinite-pronouns', 'verbs'],
    color: 'bg-gray-50 border-gray-200',
    points: 203,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'indefinite',
      indefiniteTypes: {
        'someone_anyone': 'people',
        'something_anything': 'things',
        'somewhere_anywhere': 'places',
        'everyone_everything': 'all'
      },
      agreementRules: 'singular_verb'
    }
  },
  {
    id: 42,
    name: 'Mixed Comparison Practice',
    shortDescription: 'Real-world comparison practice',
    category: 'comparisons',
    pattern: 'Mixed practice',
    formula: 'all comparison forms',
    example: 'Real-world comparisons',
    explanation: 'Practice all comparison forms in natural contexts.',
    requiredCategories: ['subjects', 'verbs', 'comparatives', 'superlatives', 'objects'],
    color: 'bg-gray-50 border-gray-200',
    points: 205,
    unlockRequirement: 0,
    difficulty: 'intermediate',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'comparison',
      comparisonType: 'mixed',
      mixedPractice: true
    }
  },

  // 🌟 ADVANCED STRUCTURES (Levels 42-47)
  {
    id: 42,
    name: 'Relative Clauses',
    shortDescription: 'Combining ideas with who, which, that',
    category: 'advanced',
    pattern: 'Noun + who/which/that + clause',
    formula: 'noun + relative pronoun + clause',
    example: 'The man who lives here is my teacher.',
    explanation: 'Use relative clauses to combine ideas and add information about nouns. Who = people, which = things, that = both.',
    requiredCategories: ['subjects', 'relative-pronouns', 'verbs'],
    color: 'bg-purple-100 border-purple-300',
    points: 208,
    unlockRequirement: 0,
    difficulty: 'advanced',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'relative_clause',
      relativePronouns: {
        'who': 'people',
        'which': 'things',
        'that': 'people_or_things'
      },
      clauseType: 'defining'
    }
  },
  {
    id: 43,
    name: 'Tag Questions',
    shortDescription: 'Confirmation questions',
    category: 'advanced',
    pattern: 'Statement + tag',
    formula: 'positive statement + negative tag / negative statement + positive tag',
    example: 'You like pizza, don\'t you?',
    explanation: 'Add opposite tag to confirm information. Positive statement gets negative tag.',
    requiredCategories: ['subjects', 'verbs', 'tag-questions'],
    color: 'bg-purple-100 border-purple-300',
    points: 210,
    unlockRequirement: 0,
    difficulty: 'advanced',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'tag_question',
      tagRules: {
        'positive_statement': 'negative_tag',
        'negative_statement': 'positive_tag'
      }
    }
  },
  {
    id: 44,
    name: 'Second Conditional',
    shortDescription: 'Hypothetical situations',
    category: 'advanced',
    pattern: 'If + Subject + V2, Subject + would + V1',
    formula: 'if + past, would + base verb',
    example: 'If I had money, I would travel.',
    explanation: 'Use past tense in if-clause, would + base verb in result clause for hypothetical situations.',
    requiredCategories: ['subjects', 'verbs', 'conditionals'],
    color: 'bg-purple-100 border-purple-300',
    points: 215,
    unlockRequirement: 0,
    difficulty: 'advanced',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'conditional',
      conditionalType: 'second',
      conditionalStructure: {
        'if_clause': 'past_tense',
        'result_clause': 'would_plus_base'
      }
    }
  },
  {
    id: 45,
    name: 'Third Conditional',
    shortDescription: 'Unreal past situations',
    category: 'advanced',
    pattern: 'If + Past Perfect, would have + V3',
    formula: 'if + had + past participle, would have + past participle',
    example: 'If I had studied, I would have passed.',
    explanation: 'Use third conditional for unreal past situations - things that didn\'t happen but we imagine the results.',
    requiredCategories: ['subjects', 'verbs', 'conditionals'],
    color: 'bg-purple-100 border-purple-300',
    points: 217,
    unlockRequirement: 0,
    difficulty: 'advanced',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'conditional',
      conditionalType: 'third',
      conditionalStructure: {
        'if_clause': 'past_perfect',
        'result_clause': 'would_have_plus_v3'
      },
      usedFor: ['unreal_past', 'regrets', 'imaginary_results']
    }
  },
  {
    id: 46,
    name: 'Reported Speech',
    shortDescription: 'Common phrasal verbs',
    category: 'advanced',
    pattern: 'Subject + phrasal verb + Object',
    formula: 'subject + verb + particle + object',
    example: 'Turn on the light.',
    explanation: 'Phrasal verbs = verb + particle. Some are separable, some are inseparable.',
    requiredCategories: ['subjects', 'phrasal-verbs', 'objects'],
    color: 'bg-purple-100 border-purple-300',
    points: 220,
    unlockRequirement: 0,
    difficulty: 'advanced',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'phrasal',
      phrasalTypes: {
        'separable': 'can_split_particle',
        'inseparable': 'cannot_split_particle'
      }
    }
  },
  {
    id: 47,
    name: 'Embedded Questions',
    shortDescription: 'Reporting what people said with tense changes',
    category: 'advanced',
    pattern: 'Subject + said + clause (backshift)',
    formula: 'subject + reporting verb + reported clause',
    example: 'He said he was tired.',
    explanation: 'When reporting speech, move tenses back: present→past, past→past perfect, will→would.',
    requiredCategories: ['subjects', 'reporting-verbs', 'verbs'],
    color: 'bg-purple-100 border-purple-300',
    points: 220,
    unlockRequirement: 0,
    difficulty: 'advanced',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'reported_speech',
      tenseBackshift: {
        'present': 'past',
        'past': 'past_perfect',
        'will': 'would',
        'can': 'could'
      },
      reportingVerbs: ['said', 'told', 'asked', 'explained']
    }
  },
  {
    id: 48,
    name: 'Embedded Questions',
    shortDescription: 'Polite indirect questions',
    category: 'advanced',
    pattern: 'Do you know + wh-word + Subject + V1?',
    formula: 'polite phrase + question word + statement order',
    example: 'Do you know what time it is?',
    explanation: 'Use statement word order (not question order) after polite phrases like "Do you know" or "Can you tell me".',
    requiredCategories: ['polite-phrases', 'question-words', 'subjects', 'verbs'],
    color: 'bg-purple-100 border-purple-300',
    points: 225,
    unlockRequirement: 0,
    difficulty: 'advanced',
    timeExpressions: [],
    grammarRules: {
      verbForm: 'embedded_question',
      wordOrder: 'statement_order',
      politenessLevel: 'formal',
      politeIntroductions: ['do_you_know', 'can_you_tell_me', 'i_wonder']
    }
  }
]

// Enhanced Grammar Validation Engine (Updated for 45 levels)
export class GrammarEngine {
  constructor() {
    this.irregularVerbs = {
      'be': { V1: 'be', V2: 'was/were', V3: 'been', V1_3rd: 'is' },
      'have': { V1: 'have', V2: 'had', V3: 'had', V1_3rd: 'has' },
      'do': { V1: 'do', V2: 'did', V3: 'done', V1_3rd: 'does' },
      'go': { V1: 'go', V2: 'went', V3: 'gone', V1_3rd: 'goes' },
      'eat': { V1: 'eat', V2: 'ate', V3: 'eaten', V1_3rd: 'eats' },
      'see': { V1: 'see', V2: 'saw', V3: 'seen', V1_3rd: 'sees' },
      'come': { V1: 'come', V2: 'came', V3: 'come', V1_3rd: 'comes' },
      'take': { V1: 'take', V2: 'took', V3: 'taken', V1_3rd: 'takes' },
      'get': { V1: 'get', V2: 'got', V3: 'gotten', V1_3rd: 'gets' },
      'make': { V1: 'make', V2: 'made', V3: 'made', V1_3rd: 'makes' }
    }
  }

  validateSentence(sentence, levelId) {
    const level = getLevelById(levelId)
    if (!level) return { isCorrect: false, feedback: 'Level not found' }

    const grammarRules = level.grammarRules
    const words = sentence.map(word => word.toLowerCase())

    // Apply grammar rules based on level
    return this.applyGrammarRules(words, grammarRules, level)
  }

  applyGrammarRules(words, rules, level) {
    const errors = []
    let feedback = ''

    // Check verb form requirements
    if (rules.verbForm) {
      const verbCheck = this.checkVerbForm(words, rules.verbForm, rules)
      if (!verbCheck.isCorrect) {
        errors.push(verbCheck.error)
      }
    }

    // Check subject-verb agreement
    if (rules.subjectVerbAgreement) {
      const agreementCheck = this.checkSubjectVerbAgreement(words)
      if (!agreementCheck.isCorrect) {
        errors.push(agreementCheck.error)
      }
    }

    // Check time expression compatibility
    if (rules.timeContext) {
      const timeCheck = this.checkTimeExpressionCompatibility(words, rules.timeContext)
      if (!timeCheck.isCorrect) {
        errors.push(timeCheck.error)
      }
    }

    // Generate feedback
    if (errors.length === 0) {
      feedback = this.generatePositiveFeedback(level, words)
      return { isCorrect: true, feedback, points: level.points }
    } else {
      feedback = this.generateCorrectiveFeedback(errors, level)
      return { isCorrect: false, feedback, suggestions: this.generateSuggestions(words, rules) }
    }
  }

  checkVerbForm(words, expectedForm, rules) {
    // Implementation for checking verb forms based on tense
    // This would be a comprehensive method checking V1, V2, V3, etc.
    return { isCorrect: true } // Simplified for now
  }

  checkSubjectVerbAgreement(words) {
    // Implementation for subject-verb agreement
    return { isCorrect: true } // Simplified for now
  }

  checkTimeExpressionCompatibility(words, timeContext) {
    // Implementation for time expression validation
    return { isCorrect: true } // Simplified for now
  }

  generatePositiveFeedback(level, words) {
    const patterns = [
      `Perfect! You correctly used ${level.pattern}.`,
      `Excellent! That's a great example of ${level.name}.`,
      `Well done! You've mastered ${level.formula}.`
    ]
    return patterns[Math.floor(Math.random() * patterns.length)] + ` +${level.points} points!`
  }

  generateCorrectiveFeedback(errors, level) {
    return `Not quite right. ${errors[0]} Remember: ${level.explanation}`
  }

  generateSuggestions(words, rules) {
    // Generate helpful suggestions based on the errors
    return []
  }
}

// Helper functions
export const getLevelById = (levelId) => {
  return comprehensiveLevels47.find(level => level.id === levelId)
}

export const getLevelsByCategory = (categoryId) => {
  return comprehensiveLevels47.filter(level => level.category === categoryId)
}

export const getChallengingLevels = () => {
  return comprehensiveLevels47.filter(level => level.isChallengingLevel)
}

export const getCriticalLevels = () => {
  return comprehensiveLevels47.filter(level => level.isCriticalLevel)
}

export const getAllCategories = () => {
  const categories = [...new Set(comprehensiveLevels47.map(level => level.category))]
  return categories.map(categoryId => {
    const levels = getLevelsByCategory(categoryId)
    return {
      id: categoryId,
      levels: levels,
      count: levels.length
    }
  })
}

// Legacy export for backwards compatibility
export const comprehensiveLevels45 = comprehensiveLevels47

export default comprehensiveLevels47