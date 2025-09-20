// Extensive Question Bank for ESOL Sentence Builder
// Organized by difficulty levels and grammar categories

export interface Question {
  id: string;
  type: 'sentence-building' | 'multiple-choice' | 'fill-in-blank' | 'drag-and-drop' | 'error-correction';
  category: string;
  level: number;
  difficulty: 'beginner' | 'elementary' | 'intermediate' | 'advanced';

  // Question content
  instruction: string;
  prompt?: string;
  context?: string;

  // For sentence building questions
  availableWords?: string[];
  requiredWords?: string[];
  expectedPattern?: string;

  // For multiple choice questions
  options?: string[];
  correctOption?: number;

  // For fill-in-blank questions
  sentence?: string; // with [blank] markers
  correctAnswers?: string[];

  // Validation and scoring
  acceptableAnswers: string[];
  partialCreditAnswers?: { answer: string; score: number }[];

  // Hints and help
  hints: string[];
  explanation: string;

  // Learning objectives
  targetSkills: string[];
  commonErrors: string[];

  // Adaptive learning metadata
  estimatedDifficulty: number; // 0.0 to 1.0
  averageTime: number; // seconds
  successRate: number; // 0.0 to 1.0

  tags: string[];
}

export const questionBank: Question[] = [

  // ================================
  // BEGINNER LEVEL (1-8)
  // ================================

  // Level 1: Basic Affirmative Sentences
  {
    id: 'q001',
    type: 'sentence-building',
    category: 'present-basics',
    level: 1,
    difficulty: 'beginner',
    instruction: 'Build a sentence using these words',
    availableWords: ['I', 'eat', 'pizza'],
    requiredWords: ['I', 'eat', 'pizza'],
    expectedPattern: 'subject + verb + object',
    acceptableAnswers: ['I eat pizza', 'I eat pizza.'],
    hints: [
      'Start with "I"',
      'What do you do with pizza?',
      'Remember: I + verb + object'
    ],
    explanation: 'Basic sentence structure: Subject (I) + Verb (eat) + Object (pizza)',
    targetSkills: ['basic-sentence-structure', 'subject-identification', 'verb-usage'],
    commonErrors: ['wrong-word-order', 'missing-subject'],
    estimatedDifficulty: 0.1,
    averageTime: 15,
    successRate: 0.9,
    tags: ['basic', 'present-simple', 'food']
  },

  {
    id: 'q002',
    type: 'sentence-building',
    category: 'present-basics',
    level: 1,
    difficulty: 'beginner',
    instruction: 'Make a sentence about what she does',
    availableWords: ['She', 'likes', 'music'],
    requiredWords: ['She', 'likes', 'music'],
    expectedPattern: 'subject + verb + object',
    acceptableAnswers: ['She likes music', 'She likes music.'],
    hints: [
      'Start with "She"',
      'What does she feel about music?',
      'Third person uses "likes" not "like"'
    ],
    explanation: 'Use "likes" (with -s) for third person singular subjects like "she"',
    targetSkills: ['third-person-singular', 'subject-verb-agreement'],
    commonErrors: ['using-like-instead-of-likes', 'wrong-word-order'],
    estimatedDifficulty: 0.2,
    averageTime: 18,
    successRate: 0.85,
    tags: ['basic', 'third-person', 'preferences']
  },

  {
    id: 'q003',
    type: 'multiple-choice',
    category: 'present-basics',
    level: 1,
    difficulty: 'beginner',
    instruction: 'Choose the correct verb form',
    prompt: 'He ___ books every day.',
    options: ['read', 'reads', 'reading', 'readed'],
    correctOption: 1,
    acceptableAnswers: ['reads'],
    hints: [
      'Think about who is doing the action',
      'He, she, and it need a special verb form',
      'Add -s to the verb for he, she, it'
    ],
    explanation: 'Use "reads" (base verb + s) with third person singular subjects like "he"',
    targetSkills: ['third-person-singular', 'verb-conjugation'],
    commonErrors: ['using-base-form', 'using-ing-form'],
    estimatedDifficulty: 0.15,
    averageTime: 12,
    successRate: 0.88,
    tags: ['multiple-choice', 'third-person', 'daily-activities']
  },

  // Level 2: Articles and Nouns
  {
    id: 'q004',
    type: 'sentence-building',
    category: 'present-basics',
    level: 2,
    difficulty: 'beginner',
    instruction: 'Build a sentence using an article',
    availableWords: ['She', 'eats', 'a', 'pizza'],
    requiredWords: ['She', 'eats', 'a', 'pizza'],
    expectedPattern: 'subject + verb + article + object',
    acceptableAnswers: ['She eats a pizza', 'She eats a pizza.'],
    hints: [
      'Use "a" before singular countable nouns',
      'Pizza is countable, so it needs an article',
      'Pattern: She + eats + a + pizza'
    ],
    explanation: 'Use "a" before singular countable nouns that start with consonant sounds',
    targetSkills: ['article-usage', 'countable-nouns'],
    commonErrors: ['missing-article', 'wrong-article'],
    estimatedDifficulty: 0.25,
    averageTime: 20,
    successRate: 0.82,
    tags: ['articles', 'countable-nouns', 'food']
  },

  {
    id: 'q005',
    type: 'fill-in-blank',
    category: 'present-basics',
    level: 2,
    difficulty: 'beginner',
    instruction: 'Fill in the blank with the correct article',
    sentence: 'I want ___ apple.',
    correctAnswers: ['an'],
    acceptableAnswers: ['an'],
    partialCreditAnswers: [{ answer: 'a', score: 0.3 }],
    hints: [
      'Apple starts with a vowel sound',
      'Use "an" before vowel sounds',
      'Listen to the sound, not just the letter'
    ],
    explanation: 'Use "an" before words that start with vowel sounds like "apple"',
    targetSkills: ['article-usage', 'vowel-sounds'],
    commonErrors: ['using-a-instead-of-an'],
    estimatedDifficulty: 0.3,
    averageTime: 15,
    successRate: 0.75,
    tags: ['articles', 'vowel-sounds', 'food']
  },

  // Level 3: Negative Sentences
  {
    id: 'q006',
    type: 'sentence-building',
    category: 'present-basics',
    level: 3,
    difficulty: 'beginner',
    instruction: 'Make a negative sentence',
    availableWords: ['I', 'do', 'not', 'like', 'coffee'],
    requiredWords: ['I', 'do', 'not', 'like', 'coffee'],
    expectedPattern: 'subject + do + not + verb + object',
    acceptableAnswers: ['I do not like coffee', 'I do not like coffee.'],
    hints: [
      'Use "do not" to make negative sentences',
      'After "do not", use the base form of the verb',
      'Pattern: I + do not + like + coffee'
    ],
    explanation: 'For negative sentences with I/you/we/they, use: subject + do not + base verb + object',
    targetSkills: ['negative-formation', 'auxiliary-verbs'],
    commonErrors: ['wrong-verb-form-after-do', 'missing-auxiliary'],
    estimatedDifficulty: 0.35,
    averageTime: 25,
    successRate: 0.78,
    tags: ['negative', 'present-simple', 'preferences']
  },

  {
    id: 'q007',
    type: 'sentence-building',
    category: 'present-basics',
    level: 3,
    difficulty: 'beginner',
    instruction: 'Make a negative sentence with "she"',
    availableWords: ['She', 'does', 'not', 'watch', 'TV'],
    requiredWords: ['She', 'does', 'not', 'watch', 'TV'],
    expectedPattern: 'subject + does + not + verb + object',
    acceptableAnswers: ['She does not watch TV', 'She does not watch TV.'],
    hints: [
      'Use "does not" with he, she, it',
      'After "does not", use the base form "watch"',
      'Don\'t use "watches" after "does not"'
    ],
    explanation: 'For negative sentences with he/she/it, use: subject + does not + base verb + object',
    targetSkills: ['negative-formation', 'third-person-auxiliary'],
    commonErrors: ['using-do-instead-of-does', 'using-wrong-verb-form'],
    estimatedDifficulty: 0.4,
    averageTime: 28,
    successRate: 0.72,
    tags: ['negative', 'third-person', 'entertainment']
  },

  // Level 4: Yes/No Questions
  {
    id: 'q008',
    type: 'sentence-building',
    category: 'present-basics',
    level: 4,
    difficulty: 'beginner',
    instruction: 'Make a yes/no question',
    availableWords: ['Do', 'you', 'like', 'pizza', '?'],
    requiredWords: ['Do', 'you', 'like', 'pizza'],
    expectedPattern: 'auxiliary + subject + verb + object + ?',
    acceptableAnswers: ['Do you like pizza?'],
    hints: [
      'Start with "Do" for questions',
      'After "Do", use the base form "like"',
      'Don\'t forget the question mark'
    ],
    explanation: 'For yes/no questions with I/you/we/they: Do + subject + base verb + object?',
    targetSkills: ['question-formation', 'auxiliary-verbs'],
    commonErrors: ['wrong-word-order', 'missing-question-mark', 'wrong-verb-form'],
    estimatedDifficulty: 0.45,
    averageTime: 30,
    successRate: 0.68,
    tags: ['questions', 'yes-no-questions', 'food']
  },

  {
    id: 'q009',
    type: 'error-correction',
    category: 'present-basics',
    level: 4,
    difficulty: 'beginner',
    instruction: 'Fix the error in this question',
    prompt: 'Does you like music?',
    acceptableAnswers: ['Do you like music?'],
    hints: [
      'Look at the subject "you"',
      'Use "Do" with "you", not "Does"',
      '"Does" is only for he, she, it'
    ],
    explanation: 'Use "Do" with "you" and "Does" with he/she/it',
    targetSkills: ['auxiliary-agreement', 'error-identification'],
    commonErrors: ['auxiliary-subject-mismatch'],
    estimatedDifficulty: 0.5,
    averageTime: 25,
    successRate: 0.65,
    tags: ['error-correction', 'auxiliary-verbs', 'questions']
  },

  // Level 5: WH-Questions
  {
    id: 'q010',
    type: 'sentence-building',
    category: 'present-basics',
    level: 5,
    difficulty: 'beginner',
    instruction: 'Ask a question about what she eats',
    availableWords: ['What', 'does', 'she', 'eat', '?'],
    requiredWords: ['What', 'does', 'she', 'eat'],
    expectedPattern: 'wh-word + auxiliary + subject + verb + ?',
    acceptableAnswers: ['What does she eat?'],
    hints: [
      'Start with the question word "What"',
      'Use "does" with "she"',
      'Use base form "eat" after "does"'
    ],
    explanation: 'WH-questions: Question word + auxiliary + subject + base verb + ?',
    targetSkills: ['wh-questions', 'question-word-usage'],
    commonErrors: ['wrong-auxiliary', 'wrong-verb-form', 'wrong-word-order'],
    estimatedDifficulty: 0.55,
    averageTime: 35,
    successRate: 0.62,
    tags: ['wh-questions', 'third-person', 'food']
  },

  // ================================
  // ELEMENTARY LEVEL (9-17)
  // ================================

  // Level 6: Present Continuous
  {
    id: 'q011',
    type: 'sentence-building',
    category: 'present-basics',
    level: 6,
    difficulty: 'elementary',
    instruction: 'Describe what is happening now',
    availableWords: ['She', 'is', 'eating', 'pizza', 'now'],
    requiredWords: ['She', 'is', 'eating', 'pizza'],
    expectedPattern: 'subject + be + verb-ing + object',
    acceptableAnswers: ['She is eating pizza', 'She is eating pizza now', 'She is eating pizza.'],
    hints: [
      'Use "is" with "she"',
      'Add -ing to the verb for continuous tense',
      'This describes an action happening right now'
    ],
    explanation: 'Present continuous: subject + am/is/are + verb-ing (for actions happening now)',
    targetSkills: ['present-continuous', 'be-verbs', 'ing-forms'],
    commonErrors: ['wrong-be-verb', 'missing-ing', 'using-simple-instead-of-continuous'],
    estimatedDifficulty: 0.6,
    averageTime: 40,
    successRate: 0.58,
    tags: ['present-continuous', 'ongoing-actions', 'food']
  },

  {
    id: 'q012',
    type: 'multiple-choice',
    category: 'present-basics',
    level: 6,
    difficulty: 'elementary',
    instruction: 'Choose the correct form',
    prompt: 'They ___ a movie right now.',
    options: ['watch', 'watches', 'are watching', 'is watching'],
    correctOption: 2,
    acceptableAnswers: ['are watching'],
    hints: [
      '"Right now" suggests continuous action',
      'Use "are" with "they"',
      'Add -ing to show ongoing action'
    ],
    explanation: 'Use present continuous (are watching) for actions happening right now',
    targetSkills: ['present-continuous', 'time-expressions'],
    commonErrors: ['using-simple-present', 'wrong-be-verb'],
    estimatedDifficulty: 0.65,
    averageTime: 20,
    successRate: 0.55,
    tags: ['present-continuous', 'entertainment', 'multiple-choice']
  },

  // Level 7: Present Continuous Questions
  {
    id: 'q013',
    type: 'sentence-building',
    category: 'present-basics',
    level: 7,
    difficulty: 'elementary',
    instruction: 'Ask what someone is doing now',
    availableWords: ['What', 'is', 'he', 'doing', '?'],
    requiredWords: ['What', 'is', 'he', 'doing'],
    expectedPattern: 'wh-word + be + subject + verb-ing + ?',
    acceptableAnswers: ['What is he doing?'],
    hints: [
      'Start with "What"',
      'Use "is" with "he"',
      '"Doing" is the -ing form of "do"'
    ],
    explanation: 'Present continuous questions: WH-word + am/is/are + subject + verb-ing?',
    targetSkills: ['present-continuous-questions', 'question-formation'],
    commonErrors: ['wrong-word-order', 'missing-ing', 'wrong-be-verb'],
    estimatedDifficulty: 0.7,
    averageTime: 45,
    successRate: 0.52,
    tags: ['present-continuous', 'questions', 'activities']
  },

  // Level 8: Frequency Adverbs
  {
    id: 'q014',
    type: 'sentence-building',
    category: 'present-basics',
    level: 8,
    difficulty: 'elementary',
    instruction: 'Add a frequency adverb to show how often',
    availableWords: ['I', 'always', 'eat', 'breakfast'],
    requiredWords: ['I', 'always', 'eat', 'breakfast'],
    expectedPattern: 'subject + frequency-adverb + verb + object',
    acceptableAnswers: ['I always eat breakfast', 'I always eat breakfast.'],
    hints: [
      'Frequency adverbs go before the main verb',
      '"Always" means 100% of the time',
      'Pattern: I + always + eat + breakfast'
    ],
    explanation: 'Frequency adverbs (always, usually, sometimes, never) go before the main verb',
    targetSkills: ['frequency-adverbs', 'adverb-placement'],
    commonErrors: ['wrong-adverb-position', 'missing-adverb'],
    estimatedDifficulty: 0.65,
    averageTime: 35,
    successRate: 0.6,
    tags: ['frequency-adverbs', 'daily-routines', 'food']
  },

  // ================================
  // TIME EXPRESSIONS (9-12)
  // ================================

  {
    id: 'q015',
    type: 'fill-in-blank',
    category: 'time-expressions',
    level: 9,
    difficulty: 'elementary',
    instruction: 'Choose the correct preposition',
    sentence: 'I wake up ___ 7 o\'clock.',
    correctAnswers: ['at'],
    acceptableAnswers: ['at'],
    hints: [
      'Use "at" with specific times',
      '"7 o\'clock" is a specific time',
      'Remember: at + time, on + day, in + month/year'
    ],
    explanation: 'Use "at" with specific times (at 7 o\'clock, at noon, at midnight)',
    targetSkills: ['time-prepositions', 'preposition-usage'],
    commonErrors: ['using-in-or-on-with-time'],
    estimatedDifficulty: 0.4,
    averageTime: 18,
    successRate: 0.7,
    tags: ['time-prepositions', 'daily-routines', 'time']
  },

  {
    id: 'q016',
    type: 'multiple-choice',
    category: 'time-expressions',
    level: 9,
    difficulty: 'elementary',
    instruction: 'Choose the correct preposition',
    prompt: 'My birthday is ___ July.',
    options: ['at', 'on', 'in', 'by'],
    correctOption: 2,
    acceptableAnswers: ['in'],
    hints: [
      'July is a month',
      'Use "in" with months',
      'Use "on" with specific dates, "in" with months and years'
    ],
    explanation: 'Use "in" with months, years, and long periods (in July, in 2023, in the morning)',
    targetSkills: ['time-prepositions', 'months'],
    commonErrors: ['using-on-with-months', 'using-at-with-months'],
    estimatedDifficulty: 0.45,
    averageTime: 15,
    successRate: 0.68,
    tags: ['time-prepositions', 'months', 'personal-information']
  },

  // ================================
  // INTERMEDIATE LEVEL (18-28)
  // ================================

  // Past Tense Questions
  {
    id: 'q017',
    type: 'sentence-building',
    category: 'past-tense',
    level: 13,
    difficulty: 'elementary',
    instruction: 'Make a sentence about yesterday',
    availableWords: ['I', 'ate', 'pizza', 'yesterday'],
    requiredWords: ['I', 'ate', 'pizza'],
    expectedPattern: 'subject + past-verb + object',
    acceptableAnswers: ['I ate pizza yesterday', 'I ate pizza', 'Yesterday I ate pizza'],
    hints: [
      'Use the past form of "eat"',
      '"Ate" is the past tense of "eat"',
      'Add time expression if you want'
    ],
    explanation: 'Use past tense verbs for completed actions in the past',
    targetSkills: ['past-tense', 'irregular-verbs', 'time-expressions'],
    commonErrors: ['using-present-tense', 'wrong-past-form'],
    estimatedDifficulty: 0.5,
    averageTime: 25,
    successRate: 0.65,
    tags: ['past-tense', 'irregular-verbs', 'food']
  },

  {
    id: 'q018',
    type: 'error-correction',
    category: 'past-tense',
    level: 13,
    difficulty: 'elementary',
    instruction: 'Correct the mistake in this past tense sentence',
    prompt: 'She goed to the store yesterday.',
    acceptableAnswers: ['She went to the store yesterday.', 'She went to the store yesterday'],
    hints: [
      'Look at the verb "goed"',
      '"Go" is an irregular verb',
      'The past tense of "go" is "went"'
    ],
    explanation: '"Go" is irregular: go → went (not goed)',
    targetSkills: ['irregular-verbs', 'error-correction'],
    commonErrors: ['using-regular-past-with-irregular-verbs'],
    estimatedDifficulty: 0.55,
    averageTime: 20,
    successRate: 0.62,
    tags: ['past-tense', 'irregular-verbs', 'error-correction']
  },

  // ================================
  // ADVANCED LEVEL (29-45)
  // ================================

  // Present Perfect
  {
    id: 'q019',
    type: 'sentence-building',
    category: 'present-perfect',
    level: 18,
    difficulty: 'intermediate',
    instruction: 'Use present perfect to show experience',
    availableWords: ['I', 'have', 'visited', 'Japan'],
    requiredWords: ['I', 'have', 'visited', 'Japan'],
    expectedPattern: 'subject + have/has + past-participle + object',
    acceptableAnswers: ['I have visited Japan', 'I have visited Japan.'],
    hints: [
      'Use "have" with "I"',
      '"Visited" is the past participle',
      'Present perfect shows life experience'
    ],
    explanation: 'Present perfect (have/has + past participle) shows life experiences without specific time',
    targetSkills: ['present-perfect', 'past-participles', 'life-experiences'],
    commonErrors: ['using-simple-past', 'wrong-auxiliary', 'wrong-participle-form'],
    estimatedDifficulty: 0.75,
    averageTime: 50,
    successRate: 0.45,
    tags: ['present-perfect', 'travel', 'experience']
  },

  {
    id: 'q020',
    type: 'multiple-choice',
    category: 'present-perfect',
    level: 18,
    difficulty: 'intermediate',
    instruction: 'Choose between present perfect and simple past',
    prompt: 'I ___ to Paris last year.',
    options: ['have been', 'went', 'have gone', 'go'],
    correctOption: 1,
    acceptableAnswers: ['went'],
    hints: [
      '"Last year" is a specific time',
      'Use simple past with specific past times',
      'Present perfect doesn\'t use specific time expressions'
    ],
    explanation: 'Use simple past (not present perfect) with specific past time expressions like "last year"',
    targetSkills: ['tense-choice', 'time-expressions', 'present-perfect-vs-past'],
    commonErrors: ['using-present-perfect-with-specific-time'],
    estimatedDifficulty: 0.8,
    averageTime: 30,
    successRate: 0.4,
    tags: ['present-perfect', 'simple-past', 'time-expressions', 'travel']
  }
];

// Helper functions for question management
export function getQuestionsByLevel(level: number): Question[] {
  return questionBank.filter(q => q.level === level);
}

export function getQuestionsByCategory(category: string): Question[] {
  return questionBank.filter(q => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: string): Question[] {
  return questionBank.filter(q => q.difficulty === difficulty);
}

export function getRandomQuestions(count: number, filters?: {
  level?: number;
  category?: string;
  difficulty?: string;
  maxDifficulty?: number;
}): Question[] {
  let filteredQuestions = questionBank;

  if (filters) {
    if (filters.level) {
      filteredQuestions = filteredQuestions.filter(q => q.level === filters.level);
    }
    if (filters.category) {
      filteredQuestions = filteredQuestions.filter(q => q.category === filters.category);
    }
    if (filters.difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters.maxDifficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.estimatedDifficulty <= filters.maxDifficulty);
    }
  }

  // Shuffle and return requested count
  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getAdaptiveQuestions(userLevel: number, userAccuracy: number, count: number = 5): Question[] {
  // Adaptive algorithm to select appropriate questions
  const targetDifficulty = Math.min(0.9, userLevel / 45 + (userAccuracy - 0.7) * 0.3);

  const suitableQuestions = questionBank.filter(q => {
    const difficultyRange = Math.abs(q.estimatedDifficulty - targetDifficulty);
    return difficultyRange <= 0.2 && q.level <= userLevel + 2;
  });

  // Prioritize questions the user hasn't mastered
  const sorted = suitableQuestions.sort((a, b) => {
    // Prefer questions with lower success rates (more challenging for this user level)
    return (a.successRate || 0.5) - (b.successRate || 0.5);
  });

  return sorted.slice(0, count);
}

// Question generation utilities
export function generateSentenceBuildingQuestion(
  pattern: string,
  words: string[],
  instruction: string
): Partial<Question> {
  return {
    type: 'sentence-building',
    instruction,
    availableWords: words,
    expectedPattern: pattern,
    // Add more generation logic as needed
  };
}

export function validateQuestionAnswer(question: Question, userAnswer: string): {
  isCorrect: boolean;
  score: number;
  feedback: string;
} {
  const normalizedAnswer = userAnswer.toLowerCase().trim().replace(/[.!?]$/, '');

  // Check exact matches
  for (const correct of question.acceptableAnswers) {
    if (normalizedAnswer === correct.toLowerCase().trim().replace(/[.!?]$/, '')) {
      return {
        isCorrect: true,
        score: 1.0,
        feedback: 'Perfect! Well done! 🎉'
      };
    }
  }

  // Check partial credit answers
  if (question.partialCreditAnswers) {
    for (const partial of question.partialCreditAnswers) {
      if (normalizedAnswer === partial.answer.toLowerCase().trim()) {
        return {
          isCorrect: false,
          score: partial.score,
          feedback: `Good try! ${question.hints[0] || 'Try again with the hint.'}`
        };
      }
    }
  }

  return {
    isCorrect: false,
    score: 0,
    feedback: question.hints[0] || 'Try again! Check the pattern and hints.'
  };
}