// Grammar Data Loader
// Loads and parses CSV files for the enhanced grammar engine

import {
  GrammarRule,
  ValidationRule,
  LevelProgression,
  parseGrammarRules,
  parseValidationMatrix,
  parseLevelProgression
} from './csv-parser';

// CSV data - in a real app, these would be loaded from files
const GRAMMAR_RULES_CSV = `Rule_Name,Description,Applies_To_Levels,Example_Correct,Example_Incorrect,Error_Message,Teaching_Tip,Validation_Function,Priority,Category
subject_verb_agreement,Verbs must agree with subjects,1-47,She eats pizza,She eat pizza,Add -s to verbs with he/she/it,Use base form with I/you/we/they. Add -s with he/she/it.,check_subject_verb_agreement,high,basic_grammar
article_before_countable,Countable nouns need articles,2-47,I eat a sandwich,I eat sandwich,Missing article before noun,Countable nouns need a/an/the before them.,check_article_usage,high,articles
a_before_consonant,Use 'a' before consonant sounds,2-47,a book,an book,Wrong article choice,Use 'a' before consonant sounds like 'b' in book.,check_a_an_usage,high,articles
an_before_vowel,Use 'an' before vowel sounds,2-47,an apple,a apple,Wrong article choice,Use 'an' before vowel sounds like 'a' in apple.,check_a_an_usage,high,articles
auxiliary_agreement,Auxiliary verbs must agree with subjects,3-47,She doesn't eat,She don't eat,Wrong auxiliary verb,Use doesn't with he/she/it. Use don't with I/you/we/they.,check_auxiliary_agreement,high,auxiliaries
base_after_auxiliary,Use base form after do/does/did,3-47,I don't eat,I don't eats,Wrong verb form after auxiliary,Always use base form (eat not eats) after do/does/did.,check_base_after_auxiliary,high,auxiliaries
auxiliary_first_questions,Put auxiliary before subject in questions,4-47,Do you like pizza?,You do like pizza?,Wrong word order,Questions start with auxiliary: Do/Does + subject + verb.,check_auxiliary_first,high,questions
be_agreement,Be verbs must agree with subjects,7-47,I am eating,I is eating,Wrong be verb,Use am with I; is with he/she/it; are with you/we/they.,check_be_agreement,high,be_verbs
ing_with_continuous,Use -ing with continuous tenses,7-47,I am eating,I am eat,Missing -ing ending,Continuous tenses need verb + ing.,check_ing_ending,high,continuous
word_order_svo,Basic word order is Subject-Verb-Object,1-47,I eat pizza,Pizza eat I,Wrong word order,English follows Subject-Verb-Object order.,check_word_order,high,basic_grammar`;

const VALIDATION_MATRIX_CSV = `Level,Level_Name,Required_Elements,Validation_Rules,Success_Criteria,Error_Checks,Feedback_Messages,Points_Awarded,Unlock_Requirements,Common_Mistakes
1,Basic Affirmative,subject+verb+object,subject_verb_agreement|word_order_svo,All elements present and correct agreement,missing_s_third_person|word_order_error,Perfect! Great sentence structure! +10 points!,10,0,She eat pizza → She eats pizza
2,Articles & Nouns,subject+verb+article+object,article_before_countable|a_before_consonant|an_before_vowel|subject_verb_agreement,Correct article choice and placement,missing_article_countable|wrong_article_vowel,Excellent! You used the right article. +10 points!,10,20,I eat sandwich → I eat a sandwich
3,Negative Present,subject+auxiliary+not+verb+object,auxiliary_agreement|base_after_auxiliary,Correct negative formation,auxiliary_disagreement|base_after_auxiliary,Great negative sentence! +15 points!,15,40,She don't like → She doesn't like
4,Yes/No Questions,auxiliary+subject+verb+object,auxiliary_first_questions|auxiliary_agreement|base_after_auxiliary,Correct question word order,wrong_auxiliary_questions|missing_auxiliary,Perfect question formation! +15 points!,15,70,You like pizza? → Do you like pizza?
5,Wh-Questions (What),what+auxiliary+subject+verb,auxiliary_first_questions|auxiliary_agreement,Correct wh-question formation,question_word_order|missing_auxiliary_question,Excellent question! +20 points!,20,100,What you eat? → What do you eat?
6,Wh-Questions (Who/Where/When),wh_word+auxiliary+subject+verb,auxiliary_first_questions|auxiliary_agreement,Correct wh-word usage,wrong_wh_word|question_word_order,Great wh-question! +20 points!,20,140,Where you live? → Where do you live?
7,Present Continuous,subject+be+verb_ing+object,be_agreement|ing_with_continuous,Correct continuous formation,be_verb_error|missing_ing_continuous,Perfect continuous tense! +25 points!,25,180,I am eat → I am eating
8,Present Continuous Questions,be+subject+verb_ing+object,be_agreement|ing_with_continuous|auxiliary_first_questions,Correct continuous question formation,be_verb_error|missing_ing_continuous|question_order_error,Excellent continuous question! +25 points!,25,230,You are doing what? → What are you doing?`;

const LEVEL_PROGRESSION_CSV = `Category,Level,Title,Pattern,Example,Focus,Grammar
Present Tense Basics,1,Basic Affirmative,Subject + V1/V1-3rd + Object,She eats pizza.,V1 vs V1-3rd,Third person singular -s
Present Tense Basics,2,Articles & Nouns,Subject + V1/V1-3rd + a/an/the + Object,I eat a sandwich. / She drinks the coffee.,Countable vs uncountable,a/an/the rules
Present Tense Basics,3,Negative Present,Subject + do/does + not + V1 + Object,I don't like vegetables. / She doesn't eat meat.,Negative formation,do/does + not + V1
Present Tense Basics,4,Yes/No Questions,Do/Does + Subject + V1 + Object?,Do you like pizza?,Question formation,Aux inversion
Present Tense Basics,5,Wh-Questions (What),What + do/does + Subject + V1?,What do you eat?,Wh-question basics,Wh-word + aux
Present Tense Basics,6,Wh-Questions (Who/Where/When),Wh-word + do/does + Subject + V1?,Where do you live?,Range of wh-words,Question word usage
Present Tense Basics,7,Present Continuous,Subject + am/is/are + V1-ing + Object,I am eating lunch. / She is studying English.,Ongoing actions,am/is/are + V-ing
Present Tense Basics,8,Present Continuous Questions,Wh-word + am/is/are + Subject + V1-ing?,What are you doing?,Continuous Qs,Be verb + subject + V-ing`;

export class GrammarDataLoader {
  private static instance: GrammarDataLoader;
  private grammarRules: GrammarRule[] = [];
  private validationMatrix: ValidationRule[] = [];
  private levelProgression: LevelProgression[] = [];
  private isLoaded = false;

  private constructor() {}

  static getInstance(): GrammarDataLoader {
    if (!GrammarDataLoader.instance) {
      GrammarDataLoader.instance = new GrammarDataLoader();
    }
    return GrammarDataLoader.instance;
  }

  async loadData(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Parse the embedded CSV data
      this.grammarRules = parseGrammarRules(GRAMMAR_RULES_CSV);
      this.validationMatrix = parseValidationMatrix(VALIDATION_MATRIX_CSV);
      this.levelProgression = parseLevelProgression(LEVEL_PROGRESSION_CSV);

      console.log('✅ Grammar data loaded successfully!');
      console.log(`📋 Loaded ${this.grammarRules.length} grammar rules`);
      console.log(`🎯 Loaded ${this.validationMatrix.length} validation rules`);
      console.log(`📈 Loaded ${this.levelProgression.length} level progressions`);

      this.isLoaded = true;
    } catch (error) {
      console.error('❌ Error loading grammar data:', error);
      throw error;
    }
  }

  getGrammarRules(): GrammarRule[] {
    if (!this.isLoaded) {
      throw new Error('Grammar data not loaded. Call loadData() first.');
    }
    return this.grammarRules;
  }

  getValidationMatrix(): ValidationRule[] {
    if (!this.isLoaded) {
      throw new Error('Grammar data not loaded. Call loadData() first.');
    }
    return this.validationMatrix;
  }

  getLevelProgression(): LevelProgression[] {
    if (!this.isLoaded) {
      throw new Error('Grammar data not loaded. Call loadData() first.');
    }
    return this.levelProgression;
  }

  // Convenience methods
  getRulesForLevel(levelId: number): GrammarRule[] {
    return this.grammarRules.filter(rule => {
      const range = rule.appliesToLevels;
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(n => parseInt(n.trim()));
        return levelId >= start && levelId <= end;
      }
      return parseInt(range) === levelId;
    });
  }

  getValidationForLevel(levelId: number): ValidationRule | null {
    return this.validationMatrix.find(v => v.level === levelId) || null;
  }

  getLevelInfo(levelId: number): LevelProgression | null {
    return this.levelProgression.find(l => l.level === levelId) || null;
  }
}

// Export convenience functions
export async function initializeGrammarData(): Promise<GrammarDataLoader> {
  const loader = GrammarDataLoader.getInstance();
  await loader.loadData();
  return loader;
}

export function getGrammarDataLoader(): GrammarDataLoader {
  return GrammarDataLoader.getInstance();
}