// Comprehensive Grammar Rules Engine for ESOL Learning
// Advanced validation system with detailed feedback and database integration

export interface WordToken {
  word: string;
  pos: string; // Part of speech
  category: string;
  forms?: string[];
  features?: Record<string, any>;
  index?: number;
}

export interface DatabaseRule {
  id: string;
  level_id: number;
  rule_type: string;
  rule_name: string;
  conditions: any;
  validation_logic: any;
  error_messages: any;
  examples: string[];
  priority: number;
  is_active: boolean;
}

export interface GrammarRule {
  id: string;
  name: string;
  type: string;
  priority: number;
  conditions: any[];
  validation: (tokens: WordToken[], context?: any) => ValidationResult;
  errorMessage: string;
  suggestions?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-1
  errors: GrammarError[];
  suggestions: string[];
  feedback: string;
  appliedRules: string[];
}

export interface GrammarError {
  type: string;
  position?: number;
  message: string;
  severity: 'error' | 'warning' | 'suggestion';
  suggestions?: string[];
}

export class AdvancedGrammarEngine {
  private rules: Map<string, GrammarRule[]> = new Map();
  private vocabulary: Map<string, WordToken> = new Map();
  private rulesLoaded: boolean = false;
  private currentLevelId: number | null = null;

  constructor() {
    this.initializeVocabulary();
  }

  // Load rules from database for a specific level
  async loadRulesForLevel(levelId: number): Promise<void> {
    if (this.currentLevelId === levelId && this.rulesLoaded) {
      return; // Rules already loaded
    }

    try {
      const response = await fetch(`/api/grammar-rules/${levelId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch rules for level ${levelId}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        this.rules.clear();
        this.initializeRulesFromDatabase(data.data);
        this.currentLevelId = levelId;
        this.rulesLoaded = true;
      }
    } catch (error) {
      console.error('Error loading rules from database:', error);
      // Fallback to hardcoded rules if database fails
      this.initializeRules();
      this.rulesLoaded = true;
    }
  }

  private initializeRulesFromDatabase(rules: DatabaseRule[]): void {
    // Group rules by type
    const rulesByType: { [key: string]: DatabaseRule[] } = {};

    rules.forEach(rule => {
      if (!rulesByType[rule.rule_type]) {
        rulesByType[rule.rule_type] = [];
      }
      rulesByType[rule.rule_type].push(rule);
    });

    // Add each rule type to the rules map
    Object.entries(rulesByType).forEach(([ruleType, rulesList]) => {
      const grammarRules: GrammarRule[] = rulesList.map(rule => ({
        id: rule.id,
        name: rule.rule_name,
        type: rule.rule_type,
        priority: rule.priority,
        conditions: rule.conditions,
        validation: this.createValidationFunction(rule),
        errorMessage: rule.error_messages,
        suggestions: rule.examples
      }));
      this.rules.set(ruleType, grammarRules);
    });
  }

  private createValidationFunction(rule: DatabaseRule): (tokens: WordToken[], context?: any) => ValidationResult {
    // Create validation function based on rule type and conditions
    return (tokens: WordToken[], context?: any): ValidationResult => {
      const errors: GrammarError[] = [];
      let score = 1;

      // Apply validation logic based on rule type
      switch (rule.rule_type) {
        case 'word-order':
          return this.validateWordOrder(tokens, rule);
        case 'subject-verb-agreement':
          return this.validateSubjectVerbAgreement(tokens, rule);
        case 'article-usage':
          return this.validateArticleUsage(tokens, rule);
        case 'negation':
          return this.validateNegation(tokens, rule);
        case 'question-formation':
          return this.validateQuestionFormation(tokens, rule);
        case 'tense-consistency':
          return this.validateTenseConsistency(tokens, rule);
        case 'verb-form':
          return this.validateVerbForm(tokens, rule);
        case 'modal-verbs':
          return this.validateModalVerbs(tokens, rule);
        default:
          return {
            isValid: true,
            score: 1,
            errors: [],
            suggestions: [],
            feedback: 'Rule validation not implemented',
            appliedRules: []
          };
      }
    };
  }

  private initializeRules() {
    // Subject-Verb Agreement Rules (fallback)
    this.addRule('subject-verb-agreement', {
      id: 'sva-present-simple',
      name: 'Present Simple Subject-Verb Agreement',
      type: 'subject-verb-agreement',
      priority: 1,
      conditions: [
        { pattern: 'subject + verb', tense: 'present' }
      ],
      validation: (tokens: WordToken[]) => {
        const subject = tokens.find(t => t.pos === 'subject' || t.category === 'pronoun');
        const verb = tokens.find(t => t.pos === 'verb' || t.category === 'verb');

        if (!subject || !verb) {
          return {
            isValid: true, // Not applicable
            score: 1,
            errors: [],
            suggestions: [],
            feedback: '',
            appliedRules: []
          };
        }

        const subjectNumber = this.getSubjectNumber(subject.word);
        const verbForm = this.getVerbForm(verb.word);

        let isValid = true;
        let errors: GrammarError[] = [];

        // Check for basic sentence completeness first
        const hasObject = tokens.some(t => t.pos === 'object' || t.category.includes('noun'));

        if (!hasObject && !this.isIntransitiveVerb(verb.word)) {
          errors.push({
            type: 'incomplete-sentence',
            position: tokens.length,
            message: 'Missing verb, object in your sentence. Remember: Use V1 (base form) with I, you, we, they. Use V1-3rd (adds -s/-es) with he, she, it.',
            severity: 'error',
            suggestions: ['Add an object after the verb']
          });
          isValid = false;
        }

        // Third person singular needs -s/-es
        if (isValid && subjectNumber === 'singular' && this.isThirdPerson(subject.word)) {
          if (!verbForm.endsWith('s') && !this.isIrregularThirdPerson(verb.word)) {
            isValid = false;
            errors.push({
              type: 'subject-verb-agreement',
              position: tokens.indexOf(verb),
              message: `Use "${this.getThirdPersonForm(verb.word)}" with "${subject.word}"`,
              severity: 'error',
              suggestions: [this.getThirdPersonForm(verb.word)]
            });
          }
        }

        // First/second person and plural subjects use base form
        else if (isValid && (subjectNumber === 'plural' || this.isFirstSecondPerson(subject.word))) {
          if (verbForm.endsWith('s') && !this.isIrregularVerb(verb.word)) {
            isValid = false;
            errors.push({
              type: 'subject-verb-agreement',
              position: tokens.indexOf(verb),
              message: `Use "${this.getBaseForm(verb.word)}" with "${subject.word}"`,
              severity: 'error',
              suggestions: [this.getBaseForm(verb.word)]
            });
          }
        }

        return {
          isValid,
          score: isValid ? 1 : 0.3,
          errors,
          suggestions: errors.map(e => e.suggestions || []).flat(),
          feedback: isValid ? 'Great subject-verb agreement!' : errors[0]?.message || '',
          appliedRules: ['sva-present-simple']
        };
      },
      errorMessage: 'Check subject-verb agreement',
      suggestions: ['Make sure the verb agrees with the subject']
    });

    // Article Usage Rules
    this.addRule('article-usage', {
      id: 'article-countable-nouns',
      name: 'Article Usage with Countable Nouns',
      type: 'article-usage',
      priority: 2,
      conditions: [
        { pattern: 'article? + noun', countability: 'countable' }
      ],
      validation: (tokens: WordToken[]) => {
        const errors: GrammarError[] = [];
        let score = 1;

        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
          const nextToken = tokens[i + 1];

          // Check for singular countable nouns without articles
          if (this.isCountableNoun(token.word) && this.isSingular(token.word)) {
            const hasArticle = i > 0 && this.isArticle(tokens[i - 1].word);

            if (!hasArticle && !this.isProperNoun(token.word)) {
              errors.push({
                type: 'missing-article',
                position: i,
                message: `Add "a" or "the" before "${token.word}"`,
                severity: 'error',
                suggestions: [`a ${token.word}`, `the ${token.word}`]
              });
              score = 0.5;
            }
          }

          // Check a/an usage
          if (this.isIndefiniteArticle(token.word) && nextToken) {
            const shouldUseAn = this.startsWithVowelSound(nextToken.word);
            const usesAn = token.word === 'an';

            if (shouldUseAn !== usesAn) {
              errors.push({
                type: 'wrong-article',
                position: i,
                message: `Use "${shouldUseAn ? 'an' : 'a'}" before "${nextToken.word}"`,
                severity: 'error',
                suggestions: [shouldUseAn ? 'an' : 'a']
              });
              score = 0.7;
            }
          }
        }

        return {
          isValid: errors.length === 0,
          score,
          errors,
          suggestions: errors.map(e => e.suggestions || []).flat(),
          feedback: errors.length === 0 ? 'Perfect article usage!' : errors[0]?.message || '',
          appliedRules: ['article-countable-nouns']
        };
      },
      errorMessage: 'Check article usage',
      suggestions: ['Use "a" or "an" with singular countable nouns', 'Use "an" before vowel sounds']
    });

    // Word Order Rules
    this.addRule('word-order', {
      id: 'basic-word-order',
      name: 'Basic English Word Order (SVO)',
      type: 'word-order',
      priority: 3,
      conditions: [
        { pattern: 'declarative-sentence' }
      ],
      validation: (tokens: WordToken[]) => {
        const errors: GrammarError[] = [];
        let score = 1;

        // Basic SVO order check (also check for noun categories as objects)
        const subjectIndex = tokens.findIndex(t => t.pos === 'subject' || t.category === 'pronoun');
        const verbIndex = tokens.findIndex(t => t.pos === 'verb' || t.category === 'verb');
        const objectIndex = tokens.findIndex(t => t.pos === 'object' || t.category.includes('noun'));

        if (subjectIndex !== -1 && verbIndex !== -1) {
          if (subjectIndex > verbIndex) {
            errors.push({
              type: 'word-order',
              position: verbIndex,
              message: 'Subject should come before verb in English',
              severity: 'error',
              suggestions: ['Move the subject before the verb']
            });
            score = 0.4;
          }
        }

        // Check if object comes before subject (very wrong order)
        if (subjectIndex !== -1 && objectIndex !== -1) {
          if (objectIndex < subjectIndex) {
            errors.push({
              type: 'word-order',
              position: objectIndex,
              message: 'Object should come after subject and verb in English sentences',
              severity: 'error',
              suggestions: ['Move the object to the end of the sentence (Subject + Verb + Object)']
            });
            score = 0.2;
          }
        }

        if (verbIndex !== -1 && objectIndex !== -1) {
          if (verbIndex > objectIndex) {
            errors.push({
              type: 'word-order',
              position: objectIndex,
              message: 'Object should come after verb in English',
              severity: 'error',
              suggestions: ['Move the object after the verb']
            });
            score = 0.4;
          }
        }

        return {
          isValid: errors.length === 0,
          score,
          errors,
          suggestions: errors.map(e => e.suggestions || []).flat(),
          feedback: errors.length === 0 ? 'Perfect word order!' : 'Check the order of words in your sentence',
          appliedRules: ['basic-word-order']
        };
      },
      errorMessage: 'Check word order',
      suggestions: ['Remember: Subject + Verb + Object']
    });

    // Tense Consistency Rules
    this.addRule('tense-consistency', {
      id: 'present-tense-consistency',
      name: 'Present Tense Consistency',
      type: 'tense-consistency',
      priority: 2,
      conditions: [
        { tense: 'present' }
      ],
      validation: (tokens: WordToken[], context?: any) => {
        const errors: GrammarError[] = [];
        let score = 1;

        const verbs = tokens.filter(t => t.pos === 'verb' || t.category === 'verb');
        const timeMarkers = tokens.filter(t => t.category === 'time-expression');

        // Check for mixed tenses
        for (const verb of verbs) {
          if (this.isPastTense(verb.word)) {
            errors.push({
              type: 'tense-mismatch',
              position: tokens.indexOf(verb),
              message: 'Use present tense verbs in present tense sentences',
              severity: 'error',
              suggestions: [this.getPresentForm(verb.word)]
            });
            score = 0.3;
          }
        }

        // Check time expression compatibility
        for (const timeMarker of timeMarkers) {
          if (this.isPastTimeExpression(timeMarker.word)) {
            errors.push({
              type: 'time-tense-mismatch',
              position: tokens.indexOf(timeMarker),
              message: `"${timeMarker.word}" is used with past tense, not present`,
              severity: 'warning',
              suggestions: ['Use present time expressions like "now", "today", "usually"']
            });
            score = Math.min(score, 0.7);
          }
        }

        return {
          isValid: errors.length === 0,
          score,
          errors,
          suggestions: errors.map(e => e.suggestions || []).flat(),
          feedback: errors.length === 0 ? 'Great tense consistency!' : errors[0]?.message || '',
          appliedRules: ['present-tense-consistency']
        };
      },
      errorMessage: 'Check tense consistency',
      suggestions: ['Make sure all verbs are in the same tense', 'Match time expressions with verb tense']
    });

    // Question Formation Rules
    this.addRule('question-formation', {
      id: 'wh-question-formation',
      name: 'WH-Question Formation',
      type: 'question-formation',
      priority: 1,
      conditions: [
        { pattern: 'wh-question' }
      ],
      validation: (tokens: WordToken[]) => {
        const errors: GrammarError[] = [];
        let score = 1;

        const whWord = tokens.find(t => t.category === 'question-word');
        const auxiliary = tokens.find(t => t.category === 'auxiliary');
        const subject = tokens.find(t => t.pos === 'subject' || t.category === 'pronoun');

        if (whWord) {
          // WH-word should be first
          if (tokens.indexOf(whWord) !== 0) {
            errors.push({
              type: 'question-word-position',
              position: tokens.indexOf(whWord),
              message: 'Question word should be at the beginning',
              severity: 'error',
              suggestions: [`Move "${whWord.word}" to the beginning`]
            });
            score = 0.5;
          }

          // Should have auxiliary verb
          if (!auxiliary) {
            errors.push({
              type: 'missing-auxiliary',
              position: 1,
              message: 'Add "do" or "does" after the question word',
              severity: 'error',
              suggestions: ['Add "do" or "does"']
            });
            score = 0.4;
          }

          // Auxiliary should come before subject
          if (auxiliary && subject) {
            const auxIndex = tokens.indexOf(auxiliary);
            const subjIndex = tokens.indexOf(subject);

            if (auxIndex > subjIndex) {
              errors.push({
                type: 'auxiliary-position',
                position: auxIndex,
                message: 'Auxiliary verb should come before subject in questions',
                severity: 'error',
                suggestions: ['Move auxiliary before subject']
              });
              score = 0.6;
            }
          }
        }

        return {
          isValid: errors.length === 0,
          score,
          errors,
          suggestions: errors.map(e => e.suggestions || []).flat(),
          feedback: errors.length === 0 ? 'Perfect question formation!' : errors[0]?.message || '',
          appliedRules: ['wh-question-formation']
        };
      },
      errorMessage: 'Check question formation',
      suggestions: ['Questions: WH-word + auxiliary + subject + verb', 'Use "do/does" in present tense questions']
    });
  }

  private initializeVocabulary() {
    // Initialize common vocabulary with detailed grammatical information
    const commonWords = [
      // Pronouns
      { word: 'I', pos: 'subject', category: 'pronoun', features: { person: 'first', number: 'singular' }},
      { word: 'you', pos: 'subject', category: 'pronoun', features: { person: 'second', number: 'both' }},
      { word: 'he', pos: 'subject', category: 'pronoun', features: { person: 'third', number: 'singular' }},
      { word: 'she', pos: 'subject', category: 'pronoun', features: { person: 'third', number: 'singular' }},
      { word: 'it', pos: 'subject', category: 'pronoun', features: { person: 'third', number: 'singular' }},
      { word: 'we', pos: 'subject', category: 'pronoun', features: { person: 'first', number: 'plural' }},
      { word: 'they', pos: 'subject', category: 'pronoun', features: { person: 'third', number: 'plural' }},

      // Common verbs with forms
      { word: 'eat', pos: 'verb', category: 'verb', forms: ['eat', 'eats', 'ate', 'eaten'], features: { type: 'regular' }},
      { word: 'eats', pos: 'verb', category: 'verb', forms: ['eat', 'eats', 'ate', 'eaten'], features: { type: 'regular', form: 'third-person' }},
      { word: 'like', pos: 'verb', category: 'verb', forms: ['like', 'likes', 'liked', 'liked'], features: { type: 'regular' }},
      { word: 'likes', pos: 'verb', category: 'verb', forms: ['like', 'likes', 'liked', 'liked'], features: { type: 'regular', form: 'third-person' }},
      { word: 'go', pos: 'verb', category: 'verb', forms: ['go', 'goes', 'went', 'gone'], features: { type: 'irregular' }},
      { word: 'goes', pos: 'verb', category: 'verb', forms: ['go', 'goes', 'went', 'gone'], features: { type: 'irregular', form: 'third-person' }},

      // Articles
      { word: 'a', pos: 'article', category: 'article', features: { type: 'indefinite' }},
      { word: 'an', pos: 'article', category: 'article', features: { type: 'indefinite' }},
      { word: 'the', pos: 'article', category: 'article', features: { type: 'definite' }},

      // Common nouns
      { word: 'pizza', pos: 'object', category: 'noun', features: { countable: true, number: 'singular' }},
      { word: 'pizzas', pos: 'object', category: 'noun', features: { countable: true, number: 'plural' }},
      { word: 'book', pos: 'object', category: 'noun', features: { countable: true, number: 'singular' }},
      { word: 'books', pos: 'object', category: 'noun', features: { countable: true, number: 'plural' }},
      { word: 'music', pos: 'object', category: 'noun', features: { countable: false }},
      { word: 'water', pos: 'object', category: 'noun', features: { countable: false }},

      // Auxiliary verbs
      { word: 'do', pos: 'auxiliary', category: 'auxiliary', features: { usage: 'first-second-plural' }},
      { word: 'does', pos: 'auxiliary', category: 'auxiliary', features: { usage: 'third-singular' }},
      { word: 'am', pos: 'auxiliary', category: 'be-verb', features: { usage: 'first-singular' }},
      { word: 'is', pos: 'auxiliary', category: 'be-verb', features: { usage: 'third-singular' }},
      { word: 'are', pos: 'auxiliary', category: 'be-verb', features: { usage: 'second-plural' }},

      // Question words
      { word: 'what', pos: 'question-word', category: 'question-word', features: { asks: 'thing' }},
      { word: 'who', pos: 'question-word', category: 'question-word', features: { asks: 'person' }},
      { word: 'where', pos: 'question-word', category: 'question-word', features: { asks: 'place' }},
      { word: 'when', pos: 'question-word', category: 'question-word', features: { asks: 'time' }},
    ];

    commonWords.forEach(word => {
      this.vocabulary.set(word.word.toLowerCase(), word);
    });
  }

  private addRule(category: string, rule: GrammarRule) {
    if (!this.rules.has(category)) {
      this.rules.set(category, []);
    }
    this.rules.get(category)!.push(rule);
  }

  public async validateSentence(tokens: WordToken[], context?: any): Promise<ValidationResult> {
    // Ensure rules are loaded for the current level
    if (context?.levelId && !this.rulesLoaded) {
      await this.loadRulesForLevel(context.levelId);
    }

    // Basic validation - check for minimum sentence structure
    const subject = tokens.find(t => t.pos === 'subject' || t.category === 'pronoun');
    const verb = tokens.find(t => t.pos === 'verb' || t.category === 'verb');
    const hasObject = tokens.some(t => t.pos === 'object' || t.category.includes('noun'));

    // Apply rules in priority order
    const appliedRules: string[] = [];
    const allErrors: GrammarError[] = [];

    // Get all rule types and apply them in priority order
    for (const [ruleType, rules] of this.rules.entries()) {
      // Sort rules by priority within each type
      const sortedRules = rules.sort((a, b) => b.priority - a.priority);

      for (const rule of sortedRules) {
        const result = rule.validation(tokens, context);

        if (!result.isValid) {
          allErrors.push(...result.errors);
        }

        appliedRules.push(rule.id);

        // If this is a high-priority rule that failed, return early
        if (!result.isValid && rule.priority > 5) {
          return {
            isValid: false,
            score: result.score,
            errors: result.errors,
            suggestions: result.suggestions,
            feedback: result.feedback,
            appliedRules
          };
        }
      }
    }

    // If we have subject + verb + object, check basic grammar
    if (subject && verb && hasObject) {
      return {
        isValid: allErrors.length === 0,
        score: allErrors.length === 0 ? 1 : 0.5,
        errors: allErrors,
        suggestions: allErrors.map(e => e.suggestions || []).flat(),
        feedback: allErrors.length === 0 ? this.generatePositiveFeedback(tokens, 1) : allErrors[0].message,
        appliedRules
      };
    }

    // If missing components, provide guidance
    let missingComponents = [];
    if (!subject) missingComponents.push('subject');
    if (!verb) missingComponents.push('verb');
    if (!hasObject) missingComponents.push('object');

    // Even with missing components, check word order if we have multiple components
    let wordOrderErrors: GrammarError[] = [];
    if (tokens.length > 1) {
      const wordOrderRule = this.rules.get('word-order')?.[0];
      if (wordOrderRule) {
        const wordOrderResult = wordOrderRule.validation(tokens, context);
        if (!wordOrderResult.isValid) {
          wordOrderErrors = wordOrderResult.errors;
        }
      }
    }

    if (missingComponents.length > 0) {
      return {
        isValid: false,
        score: 0.3,
        errors: [{
          type: 'incomplete-sentence',
          message: `Missing ${missingComponents.join(', ')} in your sentence. ${wordOrderErrors.length > 0 ? wordOrderErrors[0].message + '. ' : ''}Remember: Use V1 (base form) with I, you, we, they. Use V1-3rd (adds -s/-es) with he, she, it.`,
          severity: 'error' as const
        }],
        suggestions: [
          `Add ${missingComponents.join(', ')} to complete your sentence`,
          ...(wordOrderErrors.map(e => e.suggestions || []).flat())
        ],
        feedback: `Missing ${missingComponents.join(', ')} in your sentence. ${wordOrderErrors.length > 0 ? wordOrderErrors[0].message + '. ' : ''}Remember: Use V1 (base form) with I, you, we, they. Use V1-3rd (adds -s/-es) with he, she, it.`,
        appliedRules: ['basic-validation', 'word-order']
      };
    }

    // Default case - basic validation passed
    return {
      isValid: true,
      score: 1,
      errors: [],
      suggestions: [],
      feedback: this.generatePositiveFeedback(tokens, 1),
      appliedRules: ['basic-validation']
    };
  }

  private generatePositiveFeedback(tokens: WordToken[], score: number): string {
    const sentence = tokens.map(t => t.word).join(' ');
    const positiveMessages = [
      "Perfect! Great job building that sentence! 🎉",
      "Excellent work! Your grammar is spot on! ⭐",
      "Fantastic! You've mastered this pattern! 🌟",
      "Well done! That's a perfectly formed sentence! 👏",
      "Outstanding! Your English skills are improving! 🚀"
    ];

    return positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
  }

  private generateErrorFeedback(errors: GrammarError[], messages: string[]): string {
    if (messages.length > 0) {
      return messages[0]; // Return the first error message
    }

    const errorType = errors[0]?.type;
    const encouragement = [
      "Keep practicing! You're doing great! 💪",
      "Almost there! Try again! 🎯",
      "Good effort! Let's fix this together! 🤝",
      "Don't worry, learning takes time! 📚"
    ];

    return `${errors[0]?.message || 'Check your sentence'} ${encouragement[Math.floor(Math.random() * encouragement.length)]}`;
  }

  // Helper methods for grammatical analysis
  private getSubjectNumber(subject: string): 'singular' | 'plural' {
    const pluralSubjects = ['we', 'they', 'you'];
    const word = this.vocabulary.get(subject.toLowerCase());

    if (word?.features?.number === 'plural' || pluralSubjects.includes(subject.toLowerCase())) {
      return 'plural';
    }
    return 'singular';
  }

  private isThirdPerson(subject: string): boolean {
    const thirdPersonSubjects = ['he', 'she', 'it'];
    return thirdPersonSubjects.includes(subject.toLowerCase()) ||
           !['i', 'you', 'we', 'they'].includes(subject.toLowerCase());
  }

  private isFirstSecondPerson(subject: string): boolean {
    return ['i', 'you', 'we'].includes(subject.toLowerCase());
  }

  private getVerbForm(verb: string): string {
    return verb.toLowerCase();
  }

  private getThirdPersonForm(verb: string): string {
    const word = this.vocabulary.get(verb.toLowerCase());
    if (word?.forms) {
      return word.forms[1]; // Third person form
    }

    // Default rule for regular verbs
    const base = verb.toLowerCase();
    if (base.endsWith('s') || base.endsWith('sh') || base.endsWith('ch') || base.endsWith('x') || base.endsWith('z')) {
      return base + 'es';
    } else if (base.endsWith('y') && !'aeiou'.includes(base[base.length - 2])) {
      return base.slice(0, -1) + 'ies';
    } else {
      return base + 's';
    }
  }

  private getBaseForm(verb: string): string {
    const word = this.vocabulary.get(verb.toLowerCase());
    if (word?.forms) {
      return word.forms[0]; // Base form
    }

    // Try to remove -s ending
    const lower = verb.toLowerCase();
    if (lower.endsWith('es')) {
      return lower.slice(0, -2);
    } else if (lower.endsWith('s')) {
      return lower.slice(0, -1);
    }
    return lower;
  }

  private isIrregularThirdPerson(verb: string): boolean {
    const irregulars = ['is', 'has', 'does', 'goes'];
    return irregulars.includes(verb.toLowerCase());
  }

  private isIrregularVerb(verb: string): boolean {
    const word = this.vocabulary.get(verb.toLowerCase());
    return word?.features?.type === 'irregular';
  }

  private isCountableNoun(word: string): boolean {
    const vocabWord = this.vocabulary.get(word.toLowerCase());
    return vocabWord?.features?.countable !== false;
  }

  private isSingular(word: string): boolean {
    const vocabWord = this.vocabulary.get(word.toLowerCase());
    return vocabWord?.features?.number !== 'plural' && !word.endsWith('s');
  }

  private isArticle(word: string): boolean {
    return ['a', 'an', 'the'].includes(word.toLowerCase());
  }

  private isIndefiniteArticle(word: string): boolean {
    return ['a', 'an'].includes(word.toLowerCase());
  }

  private isProperNoun(word: string): boolean {
    return /^[A-Z]/.test(word);
  }

  private startsWithVowelSound(word: string): boolean {
    const vowelSounds = ['a', 'e', 'i', 'o', 'u'];
    const specialCases = {
      'hour': true, 'honest': true, 'honor': true, // Silent h
      'university': false, 'user': false, 'uniform': false // 'yu' sound
    };

    if (word.toLowerCase() in specialCases) {
      return specialCases[word.toLowerCase() as keyof typeof specialCases];
    }

    return vowelSounds.includes(word.toLowerCase()[0]);
  }

  private isPastTense(verb: string): boolean {
    const pastVerbs = ['ate', 'went', 'saw', 'did', 'was', 'were', 'had'];
    return pastVerbs.includes(verb.toLowerCase()) || verb.endsWith('ed');
  }

  private getPresentForm(verb: string): string {
    const pastToPresent: Record<string, string> = {
      'ate': 'eat', 'went': 'go', 'saw': 'see', 'did': 'do',
      'was': 'am/is', 'were': 'are', 'had': 'have'
    };

    if (verb.toLowerCase() in pastToPresent) {
      return pastToPresent[verb.toLowerCase()];
    }

    if (verb.endsWith('ed')) {
      return verb.slice(0, -2); // Remove -ed
    }

    return verb;
  }

  private isPastTimeExpression(expression: string): boolean {
    const pastExpressions = ['yesterday', 'last week', 'last month', 'ago', 'in 2020'];
    return pastExpressions.some(past => expression.toLowerCase().includes(past));
  }

  private isIntransitiveVerb(verb: string): boolean {
    const intransitiveVerbs = ['sleep', 'run', 'walk', 'sit', 'stand', 'come', 'go', 'arrive'];
    return intransitiveVerbs.includes(verb.toLowerCase());
  }
}

// Singleton instance
export const grammarEngine = new AdvancedGrammarEngine();