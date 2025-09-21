// Utility functions for loading enhanced grammar patterns from Supabase
import { createClient } from "@supabase/supabase-js"

export type GrammarPattern = {
  level_id: string
  name: string
  category: string
  pattern_display: string
  pattern_formula: string
  pattern_components: string
  example_1: string
  example_2: string
  example_3: string
  explanation: string
  show_articles: boolean
  show_helpers: boolean
  show_negation: boolean
  show_questions: boolean
  helper_type: string
  question_type: string
  spanish_error_pattern: string
  gentle_correction: string
  memory_trick: string
  time_markers: string
  exception_notes: string
}

// Validation functions for level testing
export function validateGrammarPattern(pattern: GrammarPattern): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check required fields
  if (!pattern.level_id) errors.push('Missing level_id')
  if (!pattern.name) errors.push('Missing name')
  if (!pattern.pattern_display) errors.push('Missing pattern_display')
  if (!pattern.explanation) errors.push('Missing explanation')
  if (pattern.example_1.length === 0) errors.push('Missing example_1')
  if (pattern.example_2.length === 0) errors.push('Missing example_2')
  if (pattern.example_3.length === 0) errors.push('Missing example_3')

  // Check for Spanish content
  const allText = [
    pattern.name,
    pattern.pattern_display,
    pattern.explanation,
    pattern.spanish_error_pattern,
    pattern.gentle_correction,
    pattern.memory_trick,
    pattern.exception_notes
  ].join(' ').toLowerCase()

  if (allText.includes('spanish') ||
      allText.includes('español') ||
      allText.includes('¿') ||
      allText.includes('¡') ||
      allText.includes('translation') ||
      allText.includes('está') ||
      allText.includes('hace') ||
      allText.includes('calienta')) {
    errors.push('Contains Spanish content or references')
  }

  // Check pattern structure
  if (!pattern.pattern_components.includes('subject') && !pattern.pattern_components.includes('verb')) {
    errors.push('Pattern must contain at least subject and verb')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateAllLevels(): { valid: string[]; invalid: Array<{ level: string; errors: string[] }> } {
  const valid: string[] = []
  const invalid: Array<{ level: string; errors: string[] }> = []

  // Test all levels 1-47
  for (let i = 1; i <= 47; i++) {
    const levelId = i.toString()
    const pattern = fallbackPatterns[levelId]

    if (!pattern) {
      invalid.push({ level: levelId, errors: ['No grammar pattern found'] })
      continue
    }

    const validation = validateGrammarPattern(pattern)
    if (validation.isValid) {
      valid.push(levelId)
    } else {
      invalid.push({ level: levelId, errors: validation.errors })
    }
  }

  return { valid, invalid }
}

export function runLevelValidation(): void {
  console.log('🔍 Running Level Validation Test')
  console.log('================================')

  const { valid, invalid } = validateAllLevels()

  console.log(`✅ Valid levels: ${valid.length}/47`)
  console.log(`❌ Invalid levels: ${invalid.length}/47`)

  if (invalid.length > 0) {
    console.log('\n❌ Invalid Levels Details:')
    invalid.forEach(({ level, errors }) => {
      console.log(`  Level ${level}:`)
      errors.forEach(error => console.log(`    - ${error}`))
    })
  } else {
    console.log('\n🎉 All levels are valid!')
  }

  console.log('\n📊 Summary:')
  console.log(`- Total levels tested: 47`)
  console.log(`- Levels with grammar guides: ${valid.length}`)
  console.log(`- Levels without grammar guides: ${invalid.filter(l => l.errors.includes('No grammar pattern found')).length}`)
  console.log(`- Levels with Spanish content: ${invalid.filter(l => l.errors.some(e => e.includes('Spanish'))).length}`)
  console.log(`- Levels with pattern issues: ${invalid.filter(l => l.errors.some(e => e.includes('Pattern'))).length}`)

  // Check for common word toolbox elements
  const toolboxCheck = checkWordToolboxRequirements()
  console.log('\n🧰 Word Toolbox Check:')
  toolboxCheck.forEach(({ level, missing }) => {
    if (missing.length > 0) {
      console.log(`  Level ${level}: Missing ${missing.length} word types`)
    }
  })

  console.log('\n✅ Validation complete!')
}

export function checkWordToolboxRequirements(): Array<{ level: string; missing: string[] }> {
  const results: Array<{ level: string; missing: string[] }> = []

  // Define what word types should be available for each level based on pattern components
  const requiredWords: Record<string, string[]> = {
    '1': ['subject', 'verb', 'object'],
    '2': ['subject', 'verb', 'article', 'object'],
    '3': ['subject', 'helper', 'negation', 'verb', 'object'],
    '4': ['helper', 'subject', 'verb', 'object'],
    '5': ['question', 'helper', 'subject', 'verb'],
    '6': ['question', 'helper', 'subject', 'verb'],
    '7': ['subject', 'helper', 'verb', 'object'],
    '8': ['question', 'helper', 'subject', 'verb'],
    '9': ['subject', 'verb', 'preposition', 'time'],
    '10': ['subject', 'adverb', 'verb', 'object'],
    '11': ['subject', 'verb', 'object', 'adverb'],
    '12': ['helper', 'subject', 'verb', 'subject', 'verb'],
    '13': ['subject', 'verb', 'object'],
    '14': ['subject', 'helper', 'verb', 'object'],
    '15': ['helper', 'subject', 'verb', 'object'],
    '16': ['subject', 'helper', 'verb'],
    '17': ['subject', 'helper', 'verb'],
    '18': ['subject', 'helper', 'verb'],
    '19': ['helper', 'subject', 'adverb', 'verb'],
    '20': ['subject', 'helper', 'adverb', 'verb'],
    '21': ['subject', 'helper', 'verb', 'preposition'],
    '22': ['subject', 'helper', 'verb', 'time'],
    '23': ['subject', 'helper', 'verb', 'adverb'],
    '24': ['helper', 'subject', 'verb'],
    '25': ['subject', 'helper', 'verb'],
    '26': ['subject', 'helper', 'verb'],
    '27': ['helper', 'subject', 'verb', 'subject', 'helper'],
    '28': ['subject', 'helper', 'helper', 'verb'],
    '29': ['subject', 'helper', 'verb'],
    '30': ['subject', 'helper', 'verb'],
    '31': ['subject', 'helper', 'verb'],
    '32': ['subject', 'helper', 'verb'],
    '33': ['verb', 'verb', 'verb', 'verb'],
    '34': ['subject', 'helper', 'verb'],
    '35': ['helper', 'subject', 'verb'],
    '36': ['verb', 'verb'],
    '37': ['helper', 'verb', 'object'],
    '38': ['helper', 'verb', 'helper', 'verb'],
    '39': ['subject', 'verb', 'adjective', 'object'],
    '40': ['subject', 'verb', 'article', 'adjective'],
    '41': ['pronoun', 'verb'],
    '42': ['subject', 'relative', 'verb'],
    '43': ['statement', 'tag'],
    '44': ['helper', 'subject', 'verb', 'subject', 'helper'],
    '45': ['helper', 'subject', 'helper', 'verb'],
    '46': ['subject', 'verb', 'subject', 'verb'],
    '47': ['helper', 'subject', 'verb']
  }

  // Check each level
  for (let i = 1; i <= 47; i++) {
    const levelId = i.toString()
    const pattern = fallbackPatterns[levelId]

    if (!pattern) {
      results.push({ level: levelId, missing: ['No grammar pattern'] })
      continue
    }

    const components = pattern.pattern_components.split(',').map(c => c.trim())
    const required = requiredWords[levelId] || []

    // Check if all required word types are present
    const missing = required.filter(req => !components.some(comp => comp.includes(req)))

    if (missing.length > 0) {
      results.push({ level: levelId, missing })
    }
  }

  return results
}

// Test runner for development (commented out to prevent hydration issues)
// Uncomment the following lines to enable automatic validation:
// if (typeof window !== 'undefined' && window.location) {
//   console.log('🚀 Running grammar pattern validation...')
//   setTimeout(() => {
//     runLevelValidation()
//   }, 1000)
// }

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Load enhanced grammar patterns from Supabase
export async function loadGrammarPatterns(): Promise<GrammarPattern[]> {
  try {
    const { data, error } = await supabase
      .from("enhanced_grammar_patterns")
      .select("*")
      .order("level_id")

    if (error) {
      console.error("Error loading grammar patterns from Supabase:", error)
      return getFallbackPatterns()
    }

    return data || []
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    return getFallbackPatterns()
  }
}

// Load single grammar pattern by level ID from Supabase
export async function loadGrammarPatternByLevel(levelId: string): Promise<GrammarPattern | null> {
  try {
    const { data, error } = await supabase
      .from("enhanced_grammar_patterns")
      .select("*")
      .eq("level_id", levelId)
      .single()

    if (error) {
      console.error("Error loading grammar pattern from Supabase:", error)
      return fallbackPatterns[levelId] || null
    }

    return data
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    return fallbackPatterns[levelId] || null
  }
}

// Get grammar pattern by level ID (from already loaded patterns)
export function getGrammarPatternByLevel(patterns: GrammarPattern[], levelId: string): GrammarPattern | undefined {
  return patterns.find(pattern => pattern.level_id === levelId)
}

// Get patterns by category
export function getPatternsByCategory(patterns: GrammarPattern[], category: string): GrammarPattern[] {
  return patterns.filter(pattern => pattern.category === category)
}

// Get fallback patterns as array
function getFallbackPatterns(): GrammarPattern[] {
  return Object.values(fallbackPatterns)
}

// Fallback patterns for when CSV is not available
export const fallbackPatterns: Record<string, GrammarPattern> = {
  // Added all 47 grammar patterns with complete fallback data
  // Each level now has:
  // - Pattern display and formula
  // - 3 example sentences
  // - Detailed explanations (no Spanish content)
  // - Helper types instead of auxiliary types
  // - Memory tricks and exception notes
  // - Time markers where applicable

  // Total: 47 levels with comprehensive grammar guides
  "1": {
    level_id: "1",
    name: "Basic Affirmative",
    category: "present-basics",
    pattern_display: "Subject + Verb + Object",
    pattern_formula: "subject + verb + object",
    pattern_components: "subject,verb,object",
    example_1: "She eats pizza",
    example_2: "They play soccer",
    example_3: "We drink coffee",
    explanation: "Use V1 (base form) with I, you, we, they. Use V1-3rd (adds -s/-es) with he, she, it. The 'magic -s' rule: He/She/It gets the -s! Use uncountable nouns (pizza, soccer, coffee) or plural nouns (apples, books) - no articles needed. This is the foundation of English sentence structure.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Think of -s as magic that only he/she/it can use",
    time_markers: "now, today, usually, every day",
    exception_notes: "Regular verbs add -s, but 'have' becomes 'has', 'do' becomes 'does'"
  },
  "2": {
    level_id: "2",
    name: "Articles & Nouns",
    category: "present-basics",
    pattern_display: "Subject + Verb + Article + Object",
    pattern_formula: "subject + verb + article + object",
    pattern_components: "subject,verb,article,object",
    example_1: "I eat a sandwich",
    example_2: "She drinks the coffee",
    example_3: "He reads an article",
    explanation: "Use 'a' or 'an' with singular countable nouns. Use 'the' for specific things. No article with plural or uncountable nouns. SOUND RULE: 'a' before consonant sounds (a car, a university), 'an' before vowel sounds (an apple, an hour). Listen to the sound, not the spelling!",
    show_articles: true,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "A = consonant sounds, AN = vowel sounds. Listen, don't just look!",
    time_markers: "",
    exception_notes: "Silent letters trick you: 'an hour' (h is silent), 'a university' (sounds like yu-niversity)"
  },
  "3": {
    level_id: "3",
    name: "Negative Present",
    category: "present-basics",
    pattern_display: "Subject + Helper + Negation + Verb + Object",
    pattern_formula: "subject + helper + negation + verb + object",
    pattern_components: "subject,helper,negation,verb,object",
    example_1: "I don't like vegetables",
    example_2: "She doesn't eat meat",
    example_3: "They don't watch TV",
    explanation: "Use 'do not' with I, you, we, they. Use 'does not' with he, she, it. Always use V1 (base form) after do/does. English uses 'helper words' (auxiliaries) for negatives. Contractions: don't = do not, doesn't = does not.",
    show_articles: false,
    show_helpers: true,
    show_negation: true,
    show_questions: false,
    helper_type: "do_does",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "English loves helpers! Do/does are negative helpers",
    time_markers: "never, not usually, rarely",
    exception_notes: "After do/does, always use base verb (V1), never add -s"
  },
  "4": {
    level_id: "4",
    name: "Yes/No Questions",
    category: "present-basics",
    pattern_display: "Helper + Subject + Verb + Object?",
    pattern_formula: "helper + subject + verb + object",
    pattern_components: "helper,subject,verb,object",
    example_1: "Do you like pizza?",
    example_2: "Does she eat breakfast?",
    example_3: "Do they play soccer?",
    explanation: "Use 'Do' with I, you, we, they. Use 'Does' with he, she, it. Always use V1 after do/does. Question formation: 1) Start with Do/Does, 2) Add subject, 3) Use base verb, 4) Add object. Answer patterns: Yes, I do / No, I don't.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: true,
    helper_type: "do_does",
    question_type: "yes_no",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Questions flip: Statement → Do + statement",
    time_markers: "",
    exception_notes: "In questions, subject comes after helper, not before"
  },
  "5": {
    level_id: "5",
    name: "Wh-Questions (What)",
    category: "present-basics",
    pattern_display: "Question Word + Auxiliary + Subject + Verb?",
    pattern_formula: "question + helper + subject + verb",
    pattern_components: "question,helper,subject,verb",
    example_1: "What do you eat?",
    example_2: "What does she study?",
    example_3: "What do they play?",
    explanation: "Start with question word, then use do/does + subject + V1. 'What' asks about things, objects, or activities. Pattern: What + do/does + subject + base verb + ?",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: true,
    helper_type: "do_does",
    question_type: "wh",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "What = things. What + do/does + subject + verb",
    time_markers: "",
    exception_notes: "Question word comes first, then normal question pattern"
  },
  "6": {
    level_id: "6",
    name: "Wh-Questions (Who/Where/When)",
    category: "present-basics",
    pattern_display: "Question Word + Auxiliary + Subject + Verb?",
    pattern_formula: "question + helper + subject + verb",
    pattern_components: "question,helper,subject,verb",
    example_1: "Where do you live?",
    example_2: "When does she work?",
    example_3: "Who do they know?",
    explanation: "Use different question words (who, where, when) with the same pattern. Who = people, Where = places, When = time. All follow: Question word + do/does + subject + base verb.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: true,
    helper_type: "do_does",
    question_type: "wh",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Who = people, Where = places, When = time + same helper pattern",
    time_markers: "when, where, what time",
    exception_notes: "Who can be subject or object - pattern changes when who is subject"
  },
  "7": {
    level_id: "7",
    name: "Present Continuous",
    category: "present-basics",
    pattern_display: "Subject + Be Verb + Verb-ing + Object",
    pattern_formula: "subject + be + verb_ing + object",
    pattern_components: "subject,helper,verb,object",
    example_1: "I am eating lunch",
    example_2: "She is studying English",
    example_3: "They are playing games",
    explanation: "Use am (I), is (he/she/it), are (you/we/they) + verb-ing for actions happening now. BE verb selection: I am, You are, He/She/It is, We are, They are. Add -ing to base verb (eating, studying, playing).",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "be",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "AM/IS/ARE + verb-ing = happening now",
    time_markers: "now, right now, at the moment, currently",
    exception_notes: "Some verbs don't use continuous: know, like, want, need (state verbs)"
  },
  "8": {
    level_id: "8",
    name: "Present Continuous Questions",
    category: "present-basics",
    pattern_display: "Question Word + Be Verb + Subject + Verb-ing?",
    pattern_formula: "question + be + subject + verb_ing",
    pattern_components: "question,helper,subject,verb",
    example_1: "What are you doing?",
    example_2: "Where is she going?",
    example_3: "Why are they running?",
    explanation: "Start with question word, then am/is/are + subject + verb-ing. BE verb comes before subject in questions. Common questions: What are you doing? Where are you going?",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: true,
    helper_type: "be",
    question_type: "wh",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Question word + BE + subject + verb-ing",
    time_markers: "right now, at this moment",
    exception_notes: "BE verb must agree with subject: are you, is she, are they"
  },
  "9": {
    level_id: "9",
    name: "Time Prepositions",
    category: "time-expressions",
    pattern_display: "Subject + Verb + Preposition + Time",
    pattern_formula: "subject + verb + preposition + time",
    pattern_components: "subject,verb,preposition,time",
    example_1: "She studies at 9 AM",
    example_2: "I work on Monday",
    example_3: "They meet in January",
    explanation: "AT = specific times (at 4 o'clock, at noon, at night). IN = months/years/periods (in April, in 2023, in the morning). ON = days/dates (on Tuesday, on my birthday, on Christmas Day). Memory: AT points, IN contains, ON sits on top.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "AT = point in time, IN = inside time period, ON = on top of day",
    time_markers: "at 9 AM, on Monday, in January",
    exception_notes: "Exception: 'at night' but 'in the morning/afternoon/evening'"
  },
  "10": {
    level_id: "10",
    name: "Frequency Adverbs",
    category: "time-expressions",
    pattern_display: "Subject + Adverb + Verb + Object",
    pattern_formula: "subject + adverb + verb + object",
    pattern_components: "subject,adverb,verb,object",
    example_1: "I always eat breakfast",
    example_2: "She usually walks",
    example_3: "They never complain",
    explanation: "Frequency adverbs show how often. Scale: always (100%) → usually (90%) → often (65%) → sometimes (50%) → rarely (15%) → never (0%). Position: before main verb, after BE verb. Sometimes can start sentences.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Frequency scale: Always → Usually → Often → Sometimes → Rarely → Never",
    time_markers: "always, usually, often, sometimes, rarely, never",
    exception_notes: "Adverbs go BEFORE main verbs but AFTER BE verbs"
  },
  "11": {
    level_id: "11",
    name: "Frequency Expressions",
    category: "time-expressions",
    pattern_display: "Subject + Verb + Object + Frequency",
    pattern_formula: "subject + verb + object + frequency",
    pattern_components: "subject,verb,object,adverb",
    example_1: "She visits once a month",
    example_2: "I exercise twice a week",
    example_3: "They meet three times",
    explanation: "Use once/twice/three times + a + time period to show how often. These expressions go at the end of sentences. Pattern: number + times + a + time period (once a day, twice a week, three times a month).",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Once/twice for 1 and 2, then 'three times, four times...'",
    time_markers: "once a day, twice a week, three times a month",
    exception_notes: "Use 'a' not 'per': once a week (not once per week)"
  },
  "12": {
    level_id: "12",
    name: "Zero Conditional",
    category: "time-expressions",
    pattern_display: "If + Subject + Verb, Subject + Verb",
    pattern_formula: "if + subject + verb + subject + verb",
    pattern_components: "subject,verb,subject,verb",
    example_1: "If you heat water, it boils",
    example_2: "If it rains, we stay home",
    example_3: "If you study, you learn",
    explanation: "Use zero conditional for facts, rules, and general truths. Both clauses use present simple. Pattern: If + present simple, present simple. This expresses cause and effect relationships that are always true.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Facts don't need 'will' - they're always true",
    time_markers: "when, if, whenever",
    exception_notes: "Both parts use present simple - no future tense needed"
  },
  "13": {
    level_id: "13",
    name: "Past Simple Affirmative",
    category: "past-tense",
    pattern_display: "Subject + Past Verb + Object",
    pattern_formula: "subject + past_verb + object",
    pattern_components: "subject,verb,object",
    example_1: "I ate pizza yesterday",
    example_2: "She went home early",
    example_3: "They finished work",
    explanation: "Use V2 (past form) for completed actions in the past. Regular verbs add -ed . Irregular verbs change completely . Time markers: yesterday, last week, in 2020, ago.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Regular +ed, Irregular = completely different word",
    time_markers: "yesterday, last week, ago, in 2020",
    exception_notes: "Irregular verbs must be memorized - they don't follow the -ed rule"
  },
  "14": {
    level_id: "14",
    name: "Past Simple Negative",
    category: "past-tense",
    pattern_display: "Subject + Didn't + Verb + Object",
    pattern_formula: "subject + didnt + verb + object",
    pattern_components: "subject,helper,verb,object",
    example_1: "I didn't go yesterday",
    example_2: "She didn't eat lunch",
    example_3: "They didn't watch TV",
    explanation: "Use 'didn't' + base verb for all subjects in past negative. Didn't = did not. After 'didn't', always use V1 (base form), never past form. Same pattern for all subjects (I, you, he, she, it, we, they).",
    show_articles: false,
    show_helpers: true,
    show_negation: true,
    show_questions: false,
    helper_type: "did",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Didn't + base verb (not past verb)",
    time_markers: "yesterday, last week, didn't + time",
    exception_notes: "After didn't, NEVER use past form - always base verb"
  },
  "15": {
    level_id: "15",
    name: "Past Simple Questions",
    category: "past-tense",
    pattern_display: "Did + Subject + Verb + Object?",
    pattern_formula: "did + subject + verb + object",
    pattern_components: "helper,subject,verb,object",
    example_1: "Did you see the movie?",
    example_2: "Did she finish homework?",
    example_3: "Did they arrive early?",
    explanation: "Use 'Did' + subject + base verb for all past questions. Same pattern for all subjects. Answer patterns: Yes, I did / No, I didn't. Question formation: Did + subject + base verb + object?",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: true,
    helper_type: "did",
    question_type: "yes_no",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Did + subject + base verb for all past questions",
    time_markers: "yesterday, last week, when",
    exception_notes: "After 'did', always use base verb, never past form"
  },
  "16": {
    level_id: "16",
    name: "Past Continuous",
    category: "past-tense",
    pattern_display: "Subject + Was/Were + Verb-ing",
    pattern_formula: "subject + was_were + verb_ing",
    pattern_components: "subject,helper,verb",
    example_1: "I was eating dinner",
    example_2: "She was studying",
    example_3: "They were playing",
    explanation: "Use was (I/he/she/it) or were (you/we/they) + verb-ing for past ongoing actions. Shows actions in progress at a specific past time. Often interrupted by past simple actions.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "be_past",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Was/were + verb-ing = past action in progress",
    time_markers: "while, when, at 8 PM yesterday",
    exception_notes: "Was = I/he/she/it, Were = you/we/they"
  },
  "17": {
    level_id: "17",
    name: "Passive Voice (Intro)",
    category: "passive",
    pattern_display: "Subject + Was/Were + Past Participle",
    pattern_formula: "subject + was_were + past_participle",
    pattern_components: "subject,helper,verb",
    example_1: "The book was read by Maria",
    example_2: "The house was built in 1990",
    example_3: "The letter was sent yesterday",
    explanation: "Simple passive voice introduction. Focus on the action, not who does it. Subject receives the action. Use was/were + past participle. Shows past actions where doer is unimportant.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "be_past",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Subject receives action, not does action",
    time_markers: "by Maria, yesterday, last week",
    exception_notes: "Was = singular subjects, were = plural subjects"
  },
  "18": {
    level_id: "18",
    name: "Present Perfect Introduction",
    category: "present-perfect",
    pattern_display: "Subject + Have/Has + Past Participle",
    pattern_formula: "subject + have_has + past_participle",
    pattern_components: "subject,helper,verb",
    example_1: "I have visited Paris",
    example_2: "She has finished work",
    example_3: "They have eaten lunch",
    explanation: "Use have (I/you/we/they) or has (he/she/it) + past participle (V3) for experiences and completed actions with present relevance. Shows connection between past and present. V3 forms: regular verbs +ed, irregular verbs change .",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "have_has",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Have/has + past participle = experience or completed with present connection",
    time_markers: "ever, never, already, just, yet",
    exception_notes: "Past participle (V3) is different from past simple (V2)"
  },
  "19": {
    level_id: "19",
    name: "Present Perfect Experience",
    category: "present-perfect",
    pattern_display: "Have/Has + Subject + Ever + Past Participle?",
    pattern_formula: "have_has + subject + ever + past_participle",
    pattern_components: "helper,subject,adverb,verb",
    example_1: "Have you ever been to Japan?",
    example_2: "Has she ever seen snow?",
    example_3: "Have they ever traveled abroad?",
    explanation: "Use 'ever' in questions and 'never' in negative answers about life experiences. 'Ever' = at any time in your life. Pattern: Have/has + subject + ever + past participle? Answers: Yes, I have / No, I never have.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: true,
    helper_type: "have_has",
    question_type: "yes_no",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Ever = questions, Never = negative answers",
    time_markers: "ever (questions), never (negatives)",
    exception_notes: "'Ever' is only used in questions, not positive statements"
  },
  "20": {
    level_id: "20",
    name: "Present Perfect Recent",
    category: "present-perfect",
    pattern_display: "Subject + Have/Has + Just/Already + Past Participle",
    pattern_formula: "subject + have_has + adverb + past_participle",
    pattern_components: "subject,helper,adverb,verb",
    example_1: "I have just finished",
    example_2: "She has already eaten",
    example_3: "They have just arrived",
    explanation: "Use 'just' for very recent actions (minutes/hours ago) and 'already' for completed actions (sooner than expected). 'Just' = very recently, 'Already' = completed, often with surprise.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "have_has",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Just = very recent, Already = completed (with surprise)",
    time_markers: "just now, already, recently",
    exception_notes: "'Just' and 'already' go between have/has and past participle"
  },
  "21": {
    level_id: "21",
    name: "Present Perfect Duration",
    category: "present-perfect",
    pattern_display: "Subject + Have/Has + Past Participle + For/Since",
    pattern_formula: "subject + have_has + past_participle + duration",
    pattern_components: "subject,helper,verb,preposition",
    example_1: "I have lived here for 5 years",
    example_2: "She has worked since 2019",
    example_3: "They have studied for months",
    explanation: "Use 'for' + period of time (for 5 years, for months), 'since' + starting point (since 2019, since Monday). Shows actions that started in past and continue to present. Duration vs. starting point distinction is crucial.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "have_has",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "For = period of time, Since = starting point",
    time_markers: "for 5 years, since 2019, for a long time",
    exception_notes: "For + time period, Since + specific time point"
  },
  "22": {
    level_id: "22",
    name: "Present Perfect vs Past",
    category: "present-perfect",
    pattern_display: "Present Perfect vs Past Simple",
    pattern_formula: "present_perfect_vs_past_simple",
    pattern_components: "subject,helper,verb,time",
    example_1: "I have eaten pizza today",
    example_2: "I ate pizza yesterday",
    example_3: "She has finished vs She finished",
    explanation: "THE GOLDEN RULE: Finished time = Past Simple, Unfinished time = Present Perfect. Today (unfinished) = present perfect, Yesterday (finished) = past simple. This is the most challenging concept for many learners!",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "have_has",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Finished time = past simple, Unfinished time = present perfect",
    time_markers: "today vs yesterday, this week vs last week",
    exception_notes: "Time context determines tense choice - most critical rule!"
  },
  "23": {
    level_id: "23",
    name: "Present Perfect Yet/Still",
    category: "present-perfect",
    pattern_display: "Subject + Haven't/Hasn't + Past Participle + Yet",
    pattern_formula: "subject + havent_hasnt + past_participle + yet",
    pattern_components: "subject,helper,verb,adverb",
    example_1: "I haven't finished yet",
    example_2: "She hasn't arrived yet",
    example_3: "They haven't decided yet",
    explanation: "Use 'yet' in questions and negatives about expected actions. 'Yet' = up to now, but expected to happen. 'Still' for ongoing situations. 'Yet' goes at the end of sentences.",
    show_articles: false,
    show_helpers: true,
    show_negation: true,
    show_questions: false,
    helper_type: "have_has",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Yet = expected but not happened, Still = continuing situation",
    time_markers: "yet, still, not yet",
    exception_notes: "'Yet' in negatives/questions, 'still' in positives"
  },
  "24": {
    level_id: "24",
    name: "Present Perfect Questions",
    category: "present-perfect",
    pattern_display: "Have/Has + Subject + Past Participle?",
    pattern_formula: "have_has + subject + past_participle",
    pattern_components: "helper,subject,verb",
    example_1: "Have you finished homework?",
    example_2: "Has she called you?",
    example_3: "Have they arrived yet?",
    explanation: "Put have/has first for yes/no questions. Pattern: Have/has + subject + past participle? Answer patterns: Yes, I have / No, I haven't. Can add 'yet' for expected actions.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: true,
    helper_type: "have_has",
    question_type: "yes_no",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Have/has + subject + past participle",
    time_markers: "yet, already, ever",
    exception_notes: "Have/has must come before subject in questions"
  },
  "25": {
    level_id: "25",
    name: "Going to Future",
    category: "future-tense",
    pattern_display: "Subject + Be + Going to + Verb",
    pattern_formula: "subject + be + going_to + verb",
    pattern_components: "subject,helper,verb",
    example_1: "I am going to study",
    example_2: "She is going to travel",
    example_3: "They are going to move",
    explanation: "Use for plans, intentions, and predictions with evidence. BE verb (am/is/are) + going to + base verb. Shows future actions that are planned or have visible evidence.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "be",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Plans and evidence-based predictions",
    time_markers: "tomorrow, next week, soon, later",
    exception_notes: "BE verb must agree: I am, she is, they are + going to"
  },
  "26": {
    level_id: "26",
    name: "Will Future",
    category: "future-tense",
    pattern_display: "Subject + Will + Verb",
    pattern_formula: "subject + will + verb",
    pattern_components: "subject,helper,verb",
    example_1: "I will help you",
    example_2: "She will arrive soon",
    example_3: "They will call later",
    explanation: "Use for spontaneous decisions, promises, and predictions without evidence. Will + base verb for all subjects. Shows future actions decided at the moment of speaking.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "will",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Spontaneous decisions and promises",
    time_markers: "tomorrow, soon, later, probably",
    exception_notes: "Never use 'to' after 'will' - will + base verb only"
  },
  "27": {
    level_id: "27",
    name: "First Conditional",
    category: "conditionals",
    pattern_display: "If + Present, Will + Verb",
    pattern_formula: "if + present + will + verb",
    pattern_components: "subject,verb,subject,helper",
    example_1: "If it rains, I will stay home",
    example_2: "If you study, you will pass",
    example_3: "If she calls, I will answer",
    explanation: "For real future possibilities. If clause uses present simple, main clause uses will + base verb. Shows likely future situations and their probable results.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "will",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Real possibilities: If + present, will + verb",
    time_markers: "if, unless, when, as soon as",
    exception_notes: "Never use 'will' in the if clause - only in main clause"
  },
  "28": {
    level_id: "28",
    name: "Future Continuous",
    category: "future-tense",
    pattern_display: "Subject + Will + Be + Verb-ing + Object",
    pattern_formula: "subject + will + be + verb_ing",
    pattern_components: "subject,helper,helper,verb",
    example_1: "I will be working at 3 PM",
    example_2: "She will be studying tonight",
    example_3: "They will be traveling tomorrow",
    explanation: "Use for ongoing actions at a specific future time. Will + be + verb-ing for all subjects. Shows what will be happening at a particular time in the future.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "will",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Will be + verb-ing = ongoing future action",
    time_markers: "at 3 PM, tomorrow, next week",
    exception_notes: "Shows continuous action at a specific future time"
  },
  "29": {
    level_id: "29",
    name: "Future Perfect",
    category: "future-tense",
    pattern_display: "Subject + Will + Have + Past Participle",
    pattern_formula: "subject + will + have + past_participle",
    pattern_components: "subject,helper,verb",
    example_1: "She will have graduated by June",
    example_2: "I will have finished by 6 PM",
    example_3: "They will have completed the project",
    explanation: "For actions that will be completed before a future time. Will + have + past participle for all subjects. Shows completion before a future deadline or point in time.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "will_have",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Will + have + past participle = completed before future time",
    time_markers: "by 6 PM, by tomorrow, by next week",
    exception_notes: "Shows completion before a specific future time"
  },
  "30": {
    level_id: "30",
    name: "Can/Should/Must",
    category: "modals",
    pattern_display: "Subject + Modal + Verb",
    pattern_formula: "subject + modal + verb",
    pattern_components: "subject,helper,verb",
    example_1: "You should study",
    example_2: "She can drive",
    example_3: "They must finish",
    explanation: "Use modals to express ability (can), advice (should), and obligation (must). Modal + base verb for all subjects. Each modal has a specific meaning and strength.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "modal",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Can = ability, Should = advice, Must = obligation",
    time_markers: "",
    exception_notes: "Never use 'to' after modals - modal + base verb only"
  },
  "31": {
    level_id: "31",
    name: "Used To Family",
    category: "modals",
    pattern_display: "Subject + Used to + Verb / Be + Used to + Noun",
    pattern_formula: "subject + used_to + verb",
    pattern_components: "subject,helper,verb",
    example_1: "I used to live in Paris",
    example_2: "I'm used to the cold",
    example_3: "She got used to working late",
    explanation: "Used to + base verb for past habits. Be used to + noun/gerund for familiarity. Get used to + noun/gerund for adaptation. Three related but different expressions.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "used_to",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Used to = past habits, Be used to = familiar, Get used to = adapt",
    time_markers: "",
    exception_notes: "Used to (past habits) + base verb, Be/Get used to + noun/gerund"
  },
  "32": {
    level_id: "32",
    name: "Have To vs Must",
    category: "modals",
    pattern_display: "Subject + Have To/Must + Verb",
    pattern_formula: "subject + have_to + verb",
    pattern_components: "subject,helper,verb",
    example_1: "I have to study",
    example_2: "She must finish today",
    example_3: "They have to work late",
    explanation: "Have to = external obligation (boss, rules, circumstances). Must = internal obligation (personal decision). Both + base verb for all subjects. Different sources of necessity.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "have_to",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Have to = external obligation, Must = internal decision",
    time_markers: "",
    exception_notes: "Both use base verb, but different obligation types"
  },
  "33": {
    level_id: "33",
    name: "Gerunds & Infinitives",
    category: "modals",
    pattern_display: "Verb + Gerund / Verb + To + Verb",
    pattern_formula: "verb + gerund + verb + infinitive",
    pattern_components: "subject,verb,verb,verb,verb",
    example_1: "I enjoy swimming",
    example_2: "She wants to travel",
    example_3: "They decided to leave",
    explanation: "Some verbs take gerunds (-ing), others take infinitives (to + verb). No clear rule - must be memorized. Common patterns: enjoy/like + gerund, want/need + infinitive.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Enjoy/like + gerund, Want/need + infinitive",
    time_markers: "",
    exception_notes: "No clear rule - memorize verb patterns"
  },
  "34": {
    level_id: "34",
    name: "Preferences",
    category: "modals",
    pattern_display: "Subject + Prefer/Would Rather + Verb",
    pattern_formula: "subject + prefer + verb",
    pattern_components: "subject,helper,verb",
    example_1: "I prefer walking",
    example_2: "She would rather stay home",
    example_3: "They prefer to eat early",
    explanation: "Prefer + gerund or noun for general preferences. Would rather + base verb for specific choices. Both express personal choices and preferences between options.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "prefer",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Prefer = general preference, Would rather = specific choice",
    time_markers: "",
    exception_notes: "Prefer + gerund/noun, Would rather + base verb"
  },
  "35": {
    level_id: "35",
    name: "Permission & Requests",
    category: "modals",
    pattern_display: "Can/Could/May + Subject + Verb?",
    pattern_formula: "modal + subject + verb",
    pattern_components: "helper,subject,verb",
    example_1: "Can I use your phone?",
    example_2: "Could you help me?",
    example_3: "May I come in?",
    explanation: "Can = informal permission/requests. Could = more polite requests. May = formal permission. All + subject + base verb for questions. Politeness hierarchy: Can → Could → May.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: true,
    helper_type: "modal",
    question_type: "yes_no",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Can = informal, Could = polite, May = formal",
    time_markers: "",
    exception_notes: "Question word order: modal + subject + base verb"
  },
  "36": {
    level_id: "36",
    name: "Imperatives",
    category: "commands",
    pattern_display: "Verb + Object / Don't + Verb + Object",
    pattern_formula: "verb + object + dont + verb + object",
    pattern_components: "subject,verb,verb,verb,verb",
    example_1: "Open the door",
    example_2: "Don't touch that",
    example_3: "Close your eyes",
    explanation: "Imperatives give commands or instructions. No subject needed - verb comes first. Negative: Don't + base verb. Polite commands: Please + verb. Very direct form of communication.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "No subject in imperatives - verb comes first",
    time_markers: "",
    exception_notes: "Don't + base verb for negative commands"
  },
  "37": {
    level_id: "37",
    name: "Let's Suggestions",
    category: "commands",
    pattern_display: "Let's + Verb + Object",
    pattern_formula: "lets + verb + object",
    pattern_components: "subject,helper,verb,object",
    example_1: "Let's go to the movies",
    example_2: "Let's eat dinner",
    example_3: "Let's take a walk",
    explanation: "Let's = let us. Makes suggestions for group activities. Always 'Let's' with apostrophe. Positive suggestions only - no negative form. Very common in casual conversation.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "lets",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Let's = let us + suggestion",
    time_markers: "",
    exception_notes: "Always 'Let's' with apostrophe"
  },
  "38": {
    level_id: "38",
    name: "How About/What About",
    category: "commands",
    pattern_display: "How about/What about + Gerund/Noun",
    pattern_formula: "how_about + gerund + what_about + noun",
    pattern_components: "subject,helper,verb,verb,verb",
    example_1: "How about pizza?",
    example_2: "What about swimming?",
    example_3: "How about going to the movies?",
    explanation: "How about/What about make casual suggestions. How about + gerund/noun, What about + noun/gerund. Both very informal and common for making suggestions in conversation.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "How about + gerund/noun, What about + noun/gerund",
    time_markers: "",
    exception_notes: "Very casual and conversational"
  },
  "39": {
    level_id: "39",
    name: "Comparatives",
    category: "comparisons",
    pattern_display: "Subject + Verb + Adjective-er + Than + Object",
    pattern_formula: "subject + verb + comparative + than + object",
    pattern_components: "subject,verb,adjective,object",
    example_1: "She is taller than me",
    example_2: "This book is more interesting than that one",
    example_3: "He runs faster than his brother",
    explanation: "Comparatives compare two things. Short adjectives (1-2 syllables) + -er + than. Long adjectives use 'more' + adjective + than. Always need 'than' for comparison.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Short adjectives + -er + than, Long adjectives + more + than",
    time_markers: "",
    exception_notes: "Always need 'than' for comparisons"
  },
  "40": {
    level_id: "40",
    name: "Superlatives",
    category: "comparisons",
    pattern_display: "Subject + Verb + The + Adjective-est",
    pattern_formula: "subject + verb + the + superlative",
    pattern_components: "subject,verb,article,adjective",
    example_1: "She is the tallest student",
    example_2: "This is the most interesting book",
    example_3: "He is the fastest runner",
    explanation: "Superlatives compare three or more things. Short adjectives + the + -est. Long adjectives + the + most + adjective. Always need 'the' before superlative.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Short adjectives + the + -est, Long adjectives + the + most",
    time_markers: "",
    exception_notes: "Always need 'the' before superlatives"
  },
  "41": {
    level_id: "41",
    name: "Indefinite Pronouns",
    category: "indefinite-pronouns",
    pattern_display: "Someone/Anyone/Everyone + Verb",
    pattern_formula: "indefinite + verb",
    pattern_components: "subject,pronoun,verb",
    example_1: "Someone is calling",
    example_2: "Everyone knows that",
    example_3: "Nothing happened",
    explanation: "Indefinite pronouns refer to non-specific people/things. Some- pronouns in positive statements. Any- pronouns in negative/question contexts. All are singular and take singular verbs.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Some- = positive, Any- = negative/questions",
    time_markers: "",
    exception_notes: "All singular - take singular verbs"
  },
  "42": {
    level_id: "42",
    name: "Relative Clauses",
    category: "advanced",
    pattern_display: "Subject + Who/Which/That + Verb",
    pattern_formula: "subject + relative + verb",
    pattern_components: "subject,relative,verb",
    example_1: "The man who called is here",
    example_2: "The book which I read was good",
    example_3: "The car that she bought is new",
    explanation: "Use who for people, which/that for things. Relative pronouns connect clauses and provide extra information about nouns. Essential vs. non-essential clauses.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Who = people, Which/That = things",
    time_markers: "who, which, that, where, when",
    exception_notes: "Who = people, which = things (formal), that = things (informal)"
  },
  "43": {
    level_id: "43",
    name: "Tag Questions",
    category: "advanced",
    pattern_display: "Statement + Tag Question",
    pattern_formula: "statement + tag",
    pattern_components: "subject,verb",
    example_1: "You like pizza, don't you?",
    example_2: "She is coming, isn't she?",
    example_3: "They finished, didn't they?",
    explanation: "Tag questions confirm information. Positive statement + negative tag, negative statement + positive tag. Tag must match the helper verb in the statement.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Positive statement + negative tag, Negative statement + positive tag",
    time_markers: "",
    exception_notes: "Tag helper must match statement helper"
  },
  "44": {
    level_id: "44",
    name: "Second Conditional",
    category: "conditionals",
    pattern_display: "If + Past Simple, Would + Base Verb",
    pattern_formula: "if + past + would + verb",
    pattern_components: "subject,verb,subject,helper",
    example_1: "If I were rich, I would travel",
    example_2: "If it rained, we would stay",
    example_3: "If she came, we would be happy",
    explanation: "For imaginary present situations. If clause uses past simple, main clause uses would + base verb. Shows unreal or unlikely present/future situations.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "would",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Imaginary present: If + past, would + verb",
    time_markers: "if I were, if I had, if I could",
    exception_notes: "Use 'were' for all subjects in second conditional (if I were, if he were)"
  },
  "45": {
    level_id: "45",
    name: "Third Conditional",
    category: "conditionals",
    pattern_display: "If + Past Perfect, Would Have + Past Participle",
    pattern_formula: "if + past_perfect + would_have",
    pattern_components: "subject,helper,verb",
    example_1: "If I had studied, I would have passed",
    example_2: "If she had come, we would have won",
    example_3: "If they had called, I would have helped",
    explanation: "For imaginary past situations and regrets. If clause uses past perfect, main clause uses would have + past participle. Shows unreal past situations - what didn't happen.",
    show_articles: false,
    show_helpers: true,
    show_negation: false,
    show_questions: false,
    helper_type: "would_have",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Imaginary past: If + had + V3, would have + V3",
    time_markers: "if I had known, if she had come",
    exception_notes: "Third conditional expresses regrets about past"
  },
  "46": {
    level_id: "46",
    name: "Reported Speech",
    category: "advanced",
    pattern_display: "Subject + Said + That + Past Tense",
    pattern_formula: "subject + said + that + past",
    pattern_components: "subject,verb,subject,verb",
    example_1: "She said that she was tired",
    example_2: "He told me that he lived here",
    example_3: "They said that they would come",
    explanation: "When reporting, tenses usually shift back. Present → past, past → past perfect, will → would. Use 'said' or 'told' + that clause. Time and place expressions also change.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Reporting shifts tenses back: present → past, past → past perfect",
    time_markers: "that, said, told, mentioned",
    exception_notes: "Tense backshift is required in reported speech"
  },
  "47": {
    level_id: "47",
    name: "Embedded Questions",
    category: "advanced",
    pattern_display: "Do you know + Wh-word + Subject + Verb?",
    pattern_formula: "embedded_question",
    pattern_components: "helper,subject,verb",
    example_1: "Do you know what time it is?",
    example_2: "Could you tell me where she lives?",
    example_3: "Do you remember when we met?",
    explanation: "Embedded questions are more polite than direct questions. Use statement word order after question word. No helper inversion in the embedded part.",
    show_articles: false,
    show_helpers: false,
    show_negation: false,
    show_questions: false,
    helper_type: "none",
    question_type: "none",
    spanish_error_pattern: "",
    gentle_correction: "",
    memory_trick: "Embedded questions use statement word order",
    time_markers: "Do you know, Could you tell me, Do you remember",
    exception_notes: "More polite than direct questions"
  },
}