// Grammar Categories Data Structure - Phase 1 Implementation
import { GrammarCategory, CategoryProgress, CategoryStats } from './types';

export const grammarCategories: GrammarCategory[] = [
  {
    id: 'present-basics',
    name: 'Present Tense Basics',
    icon: '🟢',
    description: 'Foundation present tense structures',
    color: 'bg-green-50 border-green-200 text-green-800',
    difficulty: 'beginner',
    estimatedTime: '2-3 weeks',
    totalLevels: 8,
    unlockRequirement: 0, // Always available
    levels: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  {
    id: 'time-expressions',
    name: 'Time & Expressions',
    icon: '🟡',
    description: 'Time prepositions, frequency, and duration',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    difficulty: 'beginner',
    estimatedTime: '1-2 weeks',
    totalLevels: 4,
    unlockRequirement: 100, // Need some present tense mastery
    levels: [9, 10, 11, 12]
  },
  {
    id: 'past-tense',
    name: 'Past Tense',
    icon: '🔴',
    description: 'Past simple and continuous structures',
    color: 'bg-red-50 border-red-200 text-red-800',
    difficulty: 'elementary',
    estimatedTime: '2-3 weeks',
    totalLevels: 5,
    unlockRequirement: 200, // Need present tense + time expressions
    levels: [13, 14, 15, 16, 17]
  },
  {
    id: 'present-perfect',
    name: 'Present Perfect Progression',
    icon: '🟣',
    description: 'The challenging present perfect in all its forms',
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    difficulty: 'intermediate',
    estimatedTime: '3-4 weeks',
    totalLevels: 7,
    unlockRequirement: 400, // Need solid past tense foundation
    levels: [18, 19, 20, 21, 22, 23, 24],
    isChallengingCategory: true // Special marking for difficult content
  },
  {
    id: 'future-tenses',
    name: 'Future Tenses',
    icon: '🔵',
    description: 'Going to, will, continuous, and perfect future',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    difficulty: 'intermediate',
    estimatedTime: '2-3 weeks',
    totalLevels: 4,
    unlockRequirement: 600, // Need present perfect understanding
    levels: [25, 26, 27, 28]
  },
  {
    id: 'modals-special',
    name: 'Modals & Special Verbs',
    icon: '🟠',
    description: 'Can, should, must, used to, have to, preferences',
    color: 'bg-orange-50 border-orange-200 text-orange-800',
    difficulty: 'intermediate',
    estimatedTime: '2-3 weeks',
    totalLevels: 5,
    unlockRequirement: 500, // Can start alongside future tenses
    levels: [29, 30, 31, 32, 33]
  },
  {
    id: 'commands-suggestions',
    name: 'Commands & Suggestions',
    icon: '🟤',
    description: 'Imperatives, Let\'s, How about, What about',
    color: 'bg-amber-50 border-amber-200 text-amber-800',
    difficulty: 'elementary',
    estimatedTime: '1-2 weeks',
    totalLevels: 3,
    unlockRequirement: 300, // Can start after basic past tense
    levels: [34, 35, 36]
  },
  {
    id: 'comparisons',
    name: 'Comparisons',
    icon: '⚫',
    description: 'Comparative, superlative, and as...as forms',
    color: 'bg-gray-50 border-gray-200 text-gray-800',
    difficulty: 'intermediate',
    estimatedTime: '1-2 weeks',
    totalLevels: 3,
    unlockRequirement: 700, // Advanced content
    levels: [37, 38, 39]
  },
  {
    id: 'advanced-structures',
    name: 'Advanced Structures',
    icon: '🟢',
    description: 'Tag questions, phrasal verbs, conditionals, and more',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    difficulty: 'advanced',
    estimatedTime: '3-4 weeks',
    totalLevels: 6,
    unlockRequirement: 800, // Most advanced content
    levels: [40, 41, 42, 43, 44, 45]
  }
];

// Category helper functions
export const getCategoryById = (categoryId: string): GrammarCategory | undefined => {
  return grammarCategories.find(cat => cat.id === categoryId);
};

export const getCategoryByLevel = (levelId: number): GrammarCategory | undefined => {
  return grammarCategories.find(cat => cat.levels.includes(levelId));
};

export const getUnlockedCategories = (userPoints: number): GrammarCategory[] => {
  return grammarCategories.filter(cat => userPoints >= cat.unlockRequirement);
};

export const getCategoryProgress = (categoryId: string, completedLevels?: number[]): CategoryProgress => {
  const category = getCategoryById(categoryId);
  if (!category) return { completed: 0, total: 0, percentage: 0 };

  // In free-play mode, we don't track user progress
  // Return 0 completed for all categories
  const completed = 0;
  const total = category.totalLevels;
  const percentage = 0;

  return { completed, total, percentage };
};

export const getNextRecommendedCategory = (userPoints: number, completedLevels: number[]): GrammarCategory | null => {
  const unlockedCategories = getUnlockedCategories(userPoints);
  
  // Find category with lowest completion percentage
  let bestCategory: GrammarCategory | null = null;
  let lowestCompletion = 100;
  
  unlockedCategories.forEach(category => {
    const progress = getCategoryProgress(category.id, completedLevels);
    if (progress.percentage < lowestCompletion) {
      lowestCompletion = progress.percentage;
      bestCategory = category;
    }
  });
  
  return bestCategory;
};

// Category statistics
export const getCategoryStats = (): CategoryStats => {
  const totalLevels = grammarCategories.reduce((sum, cat) => sum + cat.totalLevels, 0);
  const totalCategories = grammarCategories.length;
  const difficultyBreakdown = {
    beginner: grammarCategories.filter(cat => cat.difficulty === 'beginner').length,
    elementary: grammarCategories.filter(cat => cat.difficulty === 'elementary').length,
    intermediate: grammarCategories.filter(cat => cat.difficulty === 'intermediate').length,
    advanced: grammarCategories.filter(cat => cat.difficulty === 'advanced').length
  };
  
  return {
    totalLevels,
    totalCategories,
    difficultyBreakdown
  };
};
