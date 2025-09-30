// Language Configuration - English Only
export const LANGUAGE_CONFIG = {
  // Set to English only
  defaultLanguage: 'en',
  supportedLanguages: ['en'],
  fallbackLanguage: 'en',
  
  // Disable language switching
  allowLanguageSwitch: false,
  
  // English-specific settings
  textDirection: 'ltr',
  dateFormat: 'MM/DD/YYYY',
  numberFormat: 'en-US',
  
  // UI Text (all in English)
  ui: {
    // Navigation
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    home: 'Home',
    levels: 'Levels',
    profile: 'Profile',
    settings: 'Settings',
    
    // Game Actions
    check: 'Check',
    clear: 'Clear',
    reset: 'Reset',
    hint: 'Hint',
    help: 'Help',
    save: 'Save',
    continue: 'Continue',
    
    // Feedback Messages
    correct: 'Correct!',
    incorrect: 'Try again!',
    excellent: 'Excellent!',
    good: 'Good!',
    almost: 'Almost there!',
    perfect: 'Perfect!',
    
    // Progress
    progress: 'Progress',
    level: 'Level',
    points: 'Points',
    streak: 'Streak',
    score: 'Score',
    
    // Categories
    subjects: 'Subjects',
    verbs: 'Verbs',
    objects: 'Objects',
    other: 'Other',
    
    // Instructions
    buildSentence: 'Build a sentence',
    selectWords: 'Select words to build your sentence',
    tapToAdd: 'Tap to add',
    tapToRemove: 'Tap to remove',
    
    // Errors
    error: 'Error',
    tryAgain: 'Try again',
    networkError: 'Network error. Please check your connection.',
    
    // Success
    levelComplete: 'Level Complete!',
    congratulations: 'Congratulations!',
    nextLevel: 'Next Level',
    
    // Accessibility
    accessibility: 'Accessibility',
    highContrast: 'High Contrast',
    largeText: 'Large Text',
    reducedMotion: 'Reduced Motion',
    soundEffects: 'Sound Effects',
    
    // Settings
    sound: 'Sound',
    music: 'Music',
    notifications: 'Notifications',
    autoSave: 'Auto Save',
    
    // Help
    howToPlay: 'How to Play',
    instructions: 'Instructions',
    tips: 'Tips',
    grammar: 'Grammar',
    
    // Time
    timeRemaining: 'Time Remaining',
    timeUp: 'Time\'s Up!',
    pause: 'Pause',
    resume: 'Resume'
  },
  
  // Grammar-specific terms (English only)
  grammar: {
    presentSimple: 'Present Simple',
    presentContinuous: 'Present Continuous',
    pastSimple: 'Past Simple',
    pastContinuous: 'Past Continuous',
    presentPerfect: 'Present Perfect',
    futureSimple: 'Future Simple',
    modalVerbs: 'Modal Verbs',
    conditionals: 'Conditionals',
    passiveVoice: 'Passive Voice',
    reportedSpeech: 'Reported Speech',
    
    // Parts of speech
    subject: 'Subject',
    verb: 'Verb',
    object: 'Object',
    adjective: 'Adjective',
    adverb: 'Adverb',
    preposition: 'Preposition',
    conjunction: 'Conjunction',
    article: 'Article',
    pronoun: 'Pronoun',
    
    // Question words
    what: 'What',
    where: 'Where',
    when: 'When',
    who: 'Who',
    why: 'Why',
    how: 'How',
    which: 'Which',
    whose: 'Whose'
  }
}

// Helper function to get UI text
export function getUIText(key: string): string {
  const keys = key.split('.')
  let value: any = LANGUAGE_CONFIG.ui
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}

// Helper function to get grammar term
export function getGrammarTerm(key: string): string {
  return LANGUAGE_CONFIG.grammar[key as keyof typeof LANGUAGE_CONFIG.grammar] || key
}

// Validate language (always returns English)
export function validateLanguage(lang: string): string {
  return LANGUAGE_CONFIG.defaultLanguage
}

// Get current language (always English)
export function getCurrentLanguage(): string {
  return LANGUAGE_CONFIG.defaultLanguage
}

// Check if language is supported (only English)
export function isLanguageSupported(lang: string): boolean {
  return lang === LANGUAGE_CONFIG.defaultLanguage
}
