// CSV Parser for Grammar System
// Loads and parses the comprehensive grammar rules and validation data

export interface GrammarRule {
  ruleName: string;
  description: string;
  appliesToLevels: string;
  exampleCorrect: string;
  exampleIncorrect: string;
  errorMessage: string;
  teachingTip: string;
  validationFunction: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface ValidationRule {
  level: number;
  levelName: string;
  requiredElements: string[];
  validationRules: string[];
  successCriteria: string;
  errorChecks: string[];
  feedbackMessages: string;
  pointsAwarded: number;
  unlockRequirements: number;
  commonMistakes: string;
}

export interface LevelProgression {
  category: string;
  level: number;
  title: string;
  pattern: string;
  example: string;
  focus: string;
  grammar: string;
}

// Parse CSV data from strings
export function parseGrammarRules(csvContent: string): GrammarRule[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      ruleName: values[0]?.trim() || '',
      description: values[1]?.trim() || '',
      appliesToLevels: values[2]?.trim() || '',
      exampleCorrect: values[3]?.trim() || '',
      exampleIncorrect: values[4]?.trim() || '',
      errorMessage: values[5]?.trim() || '',
      teachingTip: values[6]?.trim() || '',
      validationFunction: values[7]?.trim() || '',
      priority: (values[8]?.trim() as 'high' | 'medium' | 'low') || 'medium',
      category: values[9]?.trim() || ''
    };
  });
}

export function parseValidationMatrix(csvContent: string): ValidationRule[] {
  const lines = csvContent.trim().split('\n');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      level: parseInt(values[0]?.trim() || '0'),
      levelName: values[1]?.trim() || '',
      requiredElements: values[2]?.split('+').map(e => e.trim()) || [],
      validationRules: values[3]?.split('|').map(r => r.trim()) || [],
      successCriteria: values[4]?.trim() || '',
      errorChecks: values[5]?.split('|').map(e => e.trim()) || [],
      feedbackMessages: values[6]?.trim() || '',
      pointsAwarded: parseInt(values[7]?.trim() || '10'),
      unlockRequirements: parseInt(values[8]?.trim() || '0'),
      commonMistakes: values[9]?.trim() || ''
    };
  });
}

export function parseLevelProgression(csvContent: string): LevelProgression[] {
  const lines = csvContent.trim().split('\n');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      category: values[0]?.trim() || '',
      level: parseInt(values[1]?.trim() || '0'),
      title: values[2]?.trim() || '',
      pattern: values[3]?.trim() || '',
      example: values[4]?.trim() || '',
      focus: values[5]?.trim() || '',
      grammar: values[6]?.trim() || ''
    };
  });
}

// Helper functions
export function getRulesForLevel(rules: GrammarRule[], levelId: number): GrammarRule[] {
  return rules.filter(rule => {
    const range = rule.appliesToLevels;
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(n => parseInt(n.trim()));
      return levelId >= start && levelId <= end;
    } else if (range.includes(',')) {
      const levels = range.split(',').map(n => parseInt(n.trim()));
      return levels.includes(levelId);
    } else {
      return parseInt(range) === levelId;
    }
  });
}

export function getValidationForLevel(validations: ValidationRule[], levelId: number): ValidationRule | null {
  return validations.find(v => v.level === levelId) || null;
}

export function getHighPriorityRules(rules: GrammarRule[]): GrammarRule[] {
  return rules.filter(rule => rule.priority === 'high');
}