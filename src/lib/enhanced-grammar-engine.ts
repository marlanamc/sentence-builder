// Enhanced Grammar Engine - Powered by CSV Rules
// Uses comprehensive grammar rules and validation matrix for intelligent sentence checking

import { GrammarRule, ValidationRule, getRulesForLevel, getValidationForLevel } from './csv-parser';

export interface Token {
  word: string;
  pos: string;
  category: string;
  person?: string;
  number?: string;
  originalWord?: string;
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  feedback: string;
  errors: string[];
  suggestions: string[];
  appliedRules: string[];
  pointsEarned: number;
}

export class EnhancedGrammarEngine {
  private grammarRules: GrammarRule[] = [];
  private validationMatrix: ValidationRule[] = [];

  constructor(grammarRules: GrammarRule[], validationMatrix: ValidationRule[]) {
    this.grammarRules = grammarRules;
    this.validationMatrix = validationMatrix;
  }

  validateSentence(tokens: Token[], context: { levelId: number }): ValidationResult {
    const levelRules = getRulesForLevel(this.grammarRules, context.levelId);
    const levelValidation = getValidationForLevel(this.validationMatrix, context.levelId);

    if (!levelValidation) {
      return this.fallbackValidation(tokens);
    }

    const result: ValidationResult = {
      isValid: false,
      score: 0,
      feedback: '',
      errors: [],
      suggestions: [],
      appliedRules: [],
      pointsEarned: 0
    };

    // Check required elements
    const hasRequiredElements = this.checkRequiredElements(tokens, levelValidation.requiredElements);
    if (!hasRequiredElements.isValid) {
      result.errors.push(...hasRequiredElements.errors);
    }

    // Apply validation rules
    const validationResults = this.applyValidationRules(tokens, levelRules, levelValidation.validationRules);
    result.errors.push(...validationResults.errors);
    result.appliedRules.push(...validationResults.appliedRules);

    // Determine if sentence is valid
    result.isValid = result.errors.length === 0;

    if (result.isValid) {
      result.score = 1.0;
      result.pointsEarned = levelValidation.pointsAwarded;
      result.feedback = this.generateSuccessFeedback(levelValidation.feedbackMessages, tokens);
    } else {
      result.score = Math.max(0, 1 - (result.errors.length * 0.3));
      result.feedback = this.generateErrorFeedback(result.errors, levelRules);
      result.suggestions = this.generateSuggestions(tokens, levelValidation, levelRules);
    }

    return result;
  }

  private checkRequiredElements(tokens: Token[], requiredElements: string[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const presentCategories = tokens.map(t => t.category.toLowerCase());

    for (const element of requiredElements) {
      const elementName = element.toLowerCase().replace(/[+\s]/g, '');

      switch (elementName) {
        case 'subject':
          if (!presentCategories.some(cat => cat.includes('pronoun') || cat.includes('noun'))) {
            errors.push('Missing subject in sentence');
          }
          break;
        case 'verb':
          if (!presentCategories.some(cat => cat.includes('verb'))) {
            errors.push('Missing verb in sentence');
          }
          break;
        case 'object':
          if (!presentCategories.some(cat => cat.includes('noun') && !cat.includes('pronoun'))) {
            errors.push('Missing object in sentence');
          }
          break;
        case 'article':
          if (!presentCategories.some(cat => cat.includes('article'))) {
            errors.push('Missing article (a, an, the)');
          }
          break;
        case 'auxiliary':
          if (!presentCategories.some(cat => cat.includes('auxiliary') || cat.includes('helper'))) {
            errors.push('Missing auxiliary verb (do, does, am, is, are)');
          }
          break;
        case 'not':
          if (!presentCategories.some(cat => cat.includes('negation') || cat.includes('negative'))) {
            errors.push('Missing negation (not, don\'t, doesn\'t)');
          }
          break;
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  private applyValidationRules(tokens: Token[], rules: GrammarRule[], ruleNames: string[]): { errors: string[]; appliedRules: string[] } {
    const errors: string[] = [];
    const appliedRules: string[] = [];

    for (const ruleName of ruleNames) {
      const rule = rules.find(r => r.ruleName === ruleName);
      if (!rule) continue;

      const ruleResult = this.executeValidationRule(tokens, rule);
      if (!ruleResult.isValid) {
        errors.push(rule.errorMessage);
      }
      appliedRules.push(ruleName);
    }

    return { errors, appliedRules };
  }

  private executeValidationRule(tokens: Token[], rule: GrammarRule): { isValid: boolean; details?: string } {
    const sentence = tokens.map(t => t.word).join(' ').toLowerCase();

    switch (rule.ruleName) {
      case 'subject_verb_agreement':
        return this.checkSubjectVerbAgreement(tokens);

      case 'article_before_countable':
        return this.checkArticleUsage(tokens);

      case 'a_before_consonant':
      case 'an_before_vowel':
        return this.checkAAnUsage(tokens);

      case 'auxiliary_agreement':
        return this.checkAuxiliaryAgreement(tokens);

      case 'base_after_auxiliary':
        return this.checkBaseAfterAuxiliary(tokens);

      case 'auxiliary_first_questions':
        return this.checkAuxiliaryFirst(tokens);

      case 'be_agreement':
        return this.checkBeAgreement(tokens);

      case 'ing_with_continuous':
        return this.checkIngEnding(tokens);

      case 'word_order_svo':
        return this.checkWordOrder(tokens);

      default:
        return { isValid: true };
    }
  }

  // Validation rule implementations
  private checkSubjectVerbAgreement(tokens: Token[]): { isValid: boolean; details?: string } {
    const subjectToken = tokens.find(t => t.category.includes('pronoun'));
    const verbToken = tokens.find(t => t.category.includes('verb'));

    if (!subjectToken || !verbToken) return { isValid: true };

    const isThirdPersonSingular = ['he', 'she', 'it'].includes(subjectToken.word.toLowerCase());
    const verbHasS = verbToken.word.endsWith('s') || verbToken.word.endsWith('es');

    if (isThirdPersonSingular && !verbHasS) {
      return { isValid: false, details: 'Third person singular needs -s on verb' };
    }

    if (!isThirdPersonSingular && verbHasS && !['has', 'is', 'was'].includes(verbToken.word.toLowerCase())) {
      return { isValid: false, details: 'Only third person singular uses -s on verb' };
    }

    return { isValid: true };
  }

  private checkArticleUsage(tokens: Token[]): { isValid: boolean; details?: string } {
    for (let i = 0; i < tokens.length - 1; i++) {
      const currentToken = tokens[i];
      const nextToken = tokens[i + 1];

      if (nextToken.category.includes('countable-noun') && !currentToken.category.includes('article')) {
        return { isValid: false, details: 'Countable nouns need articles' };
      }
    }
    return { isValid: true };
  }

  private checkAAnUsage(tokens: Token[]): { isValid: boolean; details?: string } {
    for (let i = 0; i < tokens.length - 1; i++) {
      const article = tokens[i];
      const nextWord = tokens[i + 1];

      if (article.word === 'a' && this.startsWithVowelSound(nextWord.word)) {
        return { isValid: false, details: 'Use "an" before vowel sounds' };
      }
      if (article.word === 'an' && !this.startsWithVowelSound(nextWord.word)) {
        return { isValid: false, details: 'Use "a" before consonant sounds' };
      }
    }
    return { isValid: true };
  }

  private checkAuxiliaryAgreement(tokens: Token[]): { isValid: boolean; details?: string } {
    const subjectToken = tokens.find(t => t.category.includes('pronoun'));
    const auxiliaryToken = tokens.find(t => t.category.includes('auxiliary') || ['do', 'does', 'don\'t', 'doesn\'t'].includes(t.word.toLowerCase()));

    if (!subjectToken || !auxiliaryToken) return { isValid: true };

    const isThirdPersonSingular = ['he', 'she', 'it'].includes(subjectToken.word.toLowerCase());
    const auxiliaryWord = auxiliaryToken.word.toLowerCase();

    if (isThirdPersonSingular && ['do', 'don\'t'].includes(auxiliaryWord)) {
      return { isValid: false, details: 'Use "does/doesn\'t" with he/she/it' };
    }

    if (!isThirdPersonSingular && ['does', 'doesn\'t'].includes(auxiliaryWord)) {
      return { isValid: false, details: 'Use "do/don\'t" with I/you/we/they' };
    }

    return { isValid: true };
  }

  private checkBaseAfterAuxiliary(tokens: Token[]): { isValid: boolean; details?: string } {
    for (let i = 0; i < tokens.length - 1; i++) {
      const currentToken = tokens[i];
      const nextToken = tokens[i + 1];

      if (['do', 'does', 'don\'t', 'doesn\'t', 'did', 'didn\'t'].includes(currentToken.word.toLowerCase()) &&
          nextToken.category.includes('verb')) {

        if (nextToken.word.endsWith('s') && !['is', 'has', 'was'].includes(nextToken.word.toLowerCase())) {
          return { isValid: false, details: 'Use base form (no -s) after do/does/did' };
        }
      }
    }
    return { isValid: true };
  }

  private checkAuxiliaryFirst(tokens: Token[]): { isValid: boolean; details?: string } {
    if (tokens.length === 0) return { isValid: true };

    const firstWord = tokens[0].word.toLowerCase();
    const isQuestion = ['do', 'does', 'did', 'are', 'is', 'am', 'can', 'will', 'what', 'who', 'where', 'when', 'why', 'how'].includes(firstWord);

    // For now, assume if it starts with question word or auxiliary, it's attempting to be a question
    if (isQuestion) {
      return { isValid: true }; // More complex logic could be added here
    }

    return { isValid: true };
  }

  private checkBeAgreement(tokens: Token[]): { isValid: boolean; details?: string } {
    const subjectToken = tokens.find(t => t.category.includes('pronoun'));
    const beToken = tokens.find(t => ['am', 'is', 'are'].includes(t.word.toLowerCase()));

    if (!subjectToken || !beToken) return { isValid: true };

    const subject = subjectToken.word.toLowerCase();
    const beVerb = beToken.word.toLowerCase();

    if (subject === 'i' && beVerb !== 'am') {
      return { isValid: false, details: 'Use "am" with I' };
    }
    if (['he', 'she', 'it'].includes(subject) && beVerb !== 'is') {
      return { isValid: false, details: 'Use "is" with he/she/it' };
    }
    if (['you', 'we', 'they'].includes(subject) && beVerb !== 'are') {
      return { isValid: false, details: 'Use "are" with you/we/they' };
    }

    return { isValid: true };
  }

  private checkIngEnding(tokens: Token[]): { isValid: boolean; details?: string } {
    const beToken = tokens.find(t => ['am', 'is', 'are'].includes(t.word.toLowerCase()));
    const verbToken = tokens.find(t => t.category.includes('verb') && !['am', 'is', 'are'].includes(t.word.toLowerCase()));

    if (beToken && verbToken && !verbToken.word.endsWith('ing')) {
      return { isValid: false, details: 'Use verb + ing after am/is/are' };
    }

    return { isValid: true };
  }

  private checkWordOrder(tokens: Token[]): { isValid: boolean; details?: string } {
    // Enhanced SVO order check with better category matching
    const subjectIndex = tokens.findIndex(t =>
      t.category.includes('pronoun') ||
      (t.category.includes('noun') && ['I', 'you', 'he', 'she', 'it', 'we', 'they'].includes(t.word))
    );

    const verbIndex = tokens.findIndex(t =>
      t.category.includes('verb') &&
      !['am', 'is', 'are', 'do', 'does', 'don\'t', 'doesn\'t'].includes(t.word.toLowerCase())
    );

    const objectIndex = tokens.findIndex(t =>
      (t.category.includes('noun') || t.category.includes('uncountable-noun') || t.category.includes('countable-noun')) &&
      !t.category.includes('pronoun') &&
      !['I', 'you', 'he', 'she', 'it', 'we', 'they'].includes(t.word)
    );

    // Must have subject, verb, and object for proper SVO check
    if (subjectIndex === -1 || verbIndex === -1 || objectIndex === -1) {
      return { isValid: true }; // Don't check order if elements are missing
    }

    // Check Subject comes before Verb
    if (subjectIndex > verbIndex) {
      return { isValid: false, details: 'Subject should come before verb (Subject-Verb-Object order)' };
    }

    // Check Verb comes before Object
    if (verbIndex > objectIndex) {
      return { isValid: false, details: 'Verb should come before object (Subject-Verb-Object order)' };
    }

    // Check overall SVO order
    if (!(subjectIndex < verbIndex && verbIndex < objectIndex)) {
      return { isValid: false, details: 'Use Subject-Verb-Object word order (example: I eat pizza)' };
    }

    return { isValid: true };
  }

  // Helper methods
  private startsWithVowelSound(word: string): boolean {
    const vowelSounds = ['a', 'e', 'i', 'o', 'u'];
    return vowelSounds.includes(word.toLowerCase().charAt(0));
  }

  private generateSuccessFeedback(template: string, tokens: Token[]): string {
    const sentence = tokens.map(t => t.word).join(' ');
    const baseMessage = template.replace('{sentence}', sentence) || `Perfect! Great sentence structure! +10 points!`;

    // Add gentle semantic hints for common mismatches
    const semanticHint = this.getSemanticHint(tokens);

    return semanticHint ? `${baseMessage} ${semanticHint}` : baseMessage;
  }

  private getSemanticHint(tokens: Token[]): string {
    const verbToken = tokens.find(t => t.category.includes('verb'));
    const objectToken = tokens.find(t =>
      t.category.includes('noun') && !t.category.includes('pronoun')
    );

    if (!verbToken || !objectToken) return '';

    const verb = verbToken.word.toLowerCase().replace(/s$/, ''); // Remove -s for checking
    const object = objectToken.word.toLowerCase();

    // Common semantic mismatches with gentle corrections
    const semanticHints = [
      { verb: 'eat', wrongObjects: ['water', 'coffee', 'juice', 'milk'], hint: '🌟 **Fun fact:** We usually drink water!' },
      { verb: 'drink', wrongObjects: ['pizza', 'sandwich', 'food', 'apple'], hint: '🌟 **Fun fact:** We usually eat food!' },
      { verb: 'play', wrongObjects: ['water', 'food', 'coffee'], hint: '🌟 **Fun fact:** We usually play games or sports!' },
      { verb: 'study', wrongObjects: ['pizza', 'water', 'coffee'], hint: '🌟 **Fun fact:** We usually study subjects like English!' }
    ];

    for (const rule of semanticHints) {
      if (verb.includes(rule.verb) && rule.wrongObjects.includes(object)) {
        return rule.hint;
      }
    }

    return '';
  }

  private generateErrorFeedback(errors: string[], rules: GrammarRule[]): string {
    if (errors.length === 0) return 'Great work!';

    const primaryError = errors[0];
    const rule = rules.find(r => r.errorMessage === primaryError);

    if (rule && rule.teachingTip) {
      return `${primaryError} ${rule.teachingTip}`;
    }

    return primaryError;
  }

  private generateSuggestions(tokens: Token[], validation: ValidationRule, rules: GrammarRule[]): string[] {
    const suggestions: string[] = [];

    if (validation.commonMistakes) {
      suggestions.push(`💡 Common mistake: ${validation.commonMistakes}`);
    }

    return suggestions;
  }

  private fallbackValidation(tokens: Token[]): ValidationResult {
    return {
      isValid: tokens.length > 0,
      score: tokens.length > 0 ? 0.5 : 0,
      feedback: tokens.length > 0 ? 'Sentence structure looks good!' : 'Please build a sentence first.',
      errors: [],
      suggestions: [],
      appliedRules: [],
      pointsEarned: 5
    };
  }
}

// Export a factory function to create the enhanced engine
export async function createEnhancedGrammarEngine(
  grammarRules: GrammarRule[],
  validationMatrix: ValidationRule[]
): Promise<EnhancedGrammarEngine> {
  return new EnhancedGrammarEngine(grammarRules, validationMatrix);
}