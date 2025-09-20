// TypeScript type definitions for the Sentence Builder Game

export interface GrammarLevel {
  id: number;
  name: string;
  shortDescription: string;
  category: string;
  pattern: string;
  formula: string;
  example: string;
  explanation: string;
  requiredCategories: string[];
  color: string;
  points: number;
  unlockRequirement: number;
  difficulty: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  timeExpressions: string[];
  grammarRules: GrammarRules;
  isChallengingLevel?: boolean;
  isCriticalLevel?: boolean;
}

export interface GrammarRules {
  verbForm?: 'present' | 'past' | 'perfect' | 'continuous' | 'base' | 'future' | 'future_continuous' | 'future_perfect';
  subjectVerbAgreement?: boolean;
  requiresObject?: boolean;
  requiresArticle?: boolean;
  articleRules?: string;
  isNegative?: boolean;
  requiresAuxiliary?: string;
  auxiliaryAgreement?: boolean;
  isQuestion?: boolean;
  questionType?: 'yes/no' | 'wh' | 'experience';
  requiresQuestionWord?: boolean;
  auxiliaryFirst?: boolean;
  verbEnding?: string;
  timeContext?: string;
  requiresTimeExpression?: boolean;
  timePrepositionRules?: Record<string, string[]>;
  requiresFrequencyExpression?: boolean;
  frequencyPattern?: string;
  timeExpressionTypes?: Record<string, string>;
  tenseImplications?: Record<string, string[]>;
  timeMarkerTenseMapping?: Record<string, string>;
  isFinishedTime?: Record<string, boolean>;
  requiresV2?: boolean;
  irregularVerbsAllowed?: boolean;
  noV2AfterAuxiliary?: boolean;
  requiresV3?: boolean;
  timeContext?: 'finished' | 'unfinished_or_relevant' | 'ongoing_past' | 'life_experience' | 'recent_past_with_present_relevance' | 'unfinished_duration';
  experienceWords?: string[];
  recentWords?: string[];
  requiresDurationExpression?: boolean;
  durationRules?: Record<string, string>;
  tenseComparison?: boolean;
  finishedTimeMarkers?: string[];
  unfinishedTimeMarkers?: string[];
  tenseSelection?: Record<string, string>;
  completionWords?: string[];
  yetRules?: string;
  stillRules?: string;
  mixedPractice?: boolean;
  allPresentPerfectUses?: string[];
  futureType?: 'going_to' | 'will';
  requiresModal?: string;
  requiresBaseVerb?: boolean;
  usedFor?: string[];
  requiresTimeMarker?: string;
}

export interface GrammarCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  difficulty: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  estimatedTime: string;
  totalLevels: number;
  unlockRequirement: number;
  levels: number[];
  isChallengingCategory?: boolean;
}

export interface UserStats {
  points: number;
  completedLevels: number[];
  currentStreak: number;
  bestStreak: number;
  totalSentences: number;
  perfectSentences: number;
  levelsAttempted: number[];
  unlockedCategories: string[];
  categoryProgress: Record<string, { completed: number; total: number }>;
}

export interface GameStats {
  totalTime: number;
  averageTimePerSentence: number;
  accuracy: number;
  currentStreak: number;
  bestStreak: number;
  totalAttempts: number;
  correctAttempts: number;
}

export interface WordTile {
  word: string;
  category: string;
  originalWord?: string;
  baseForm?: string;
  thirdPersonForm?: string;
  type?: string;
  difficulty?: string;
  toggleable?: boolean;
  singular?: string;
  plural?: string;
  usage?: string;
  meaning?: string;
  asks?: string;
  person?: string;
  number?: string;
  expansion?: string;
}

export interface WordCategories {
  [key: string]: WordTile[];
}

export interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
  points?: number;
  suggestions?: string[];
  explanation?: string;
}

export interface TimeExpression {
  expression: string;
  type: 'finished' | 'unfinished' | 'duration' | 'point_in_time';
  tense: 'past' | 'present' | 'future' | 'present_perfect';
  isFinished: boolean;
}

export interface VerbData {
  V1: string;
  V2: string;
  V3: string;
  V1_3rd: string;
  V1_ing: string;
  type: string;
  difficulty: string;
  frequency: number;
  irregular: boolean;
}

export interface Settings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  showHints: boolean;
  autoAdvance: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface CategoryProgress {
  completed: number;
  total: number;
  percentage: number;
}

export interface CategoryStats {
  totalLevels: number;
  totalCategories: number;
  difficultyBreakdown: Record<string, number>;
}
