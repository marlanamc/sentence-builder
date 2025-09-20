// Enhanced Grammar Engine - Phase 2 & 3 Implementation
// Comprehensive grammar validation for all 45 levels

import { comprehensiveLevels45, getLevelById } from './comprehensiveLevels45.js'
import { TimeExpressionValidator, timeExpressionSystem } from './timeExpressionSystem.js'
import { verbSelector, enhancedVerbDatabase } from './enhancedVerbDatabase.js'

export class EnhancedGrammarEngine {
  constructor() {
    this.timeValidator = new TimeExpressionValidator()
    this.verbSelector = verbSelector
    
    // Subject categories for agreement checking
    this.subjectTypes = {
      singular: ['I', 'he', 'she', 'it', 'the student', 'my friend', 'the teacher'],
      plural: ['you', 'we', 'they', 'students', 'my friends', 'the teachers'],
      thirdPersonSingular: ['he', 'she', 'it', 'the student', 'my friend', 'the teacher']
    }
    
    // Auxiliary verb patterns
    this.auxiliaryPatterns = {
      'do/does': {
        'I': 'do', 'you': 'do', 'we': 'do', 'they': 'do',
        'he': 'does', 'she': 'does', 'it': 'does'
      },
      'be': {
        'I': 'am', 'you': 'are', 'we': 'are', 'they': 'are',
        'he': 'is', 'she': 'is', 'it': 'is'
      },
      'was/were': {
        'I': 'was', 'you': 'were', 'we': 'were', 'they': 'were',
        'he': 'was', 'she': 'was', 'it': 'was'
      },
      'have/has': {
        'I': 'have', 'you': 'have', 'we': 'have', 'they': 'have',
        'he': 'has', 'she': 'has', 'it': 'has'
      }
    }
  }

  // Main validation function
  validateSentence(sentenceTiles, levelId) {
    const level = getLevelById(levelId)
    if (!level) {
      return { isCorrect: false, feedback: 'Level not found', points: 0 }
    }

    const sentence = sentenceTiles.map(tile => tile.word || tile).join(' ')
    const words = sentenceTiles.map(tile => tile.word || tile)
    
    // Apply comprehensive grammar validation
    const validation = this.comprehensiveValidation(words, level)
    
    if (validation.isCorrect) {
      return {
        isCorrect: true,
        feedback: this.generatePositiveFeedback(level, sentence),
        points: level.points,
        explanation: level.explanation
      }
    } else {
      return {
        isCorrect: false,
        feedback: this.generateCorrectiveFeedback(validation.errors, level),
        suggestions: validation.suggestions,
        explanation: level.explanation
      }
    }
  }

  // Comprehensive validation logic
  comprehensiveValidation(words, level) {
    const errors = []
    const suggestions = []
    const grammarRules = level.grammarRules || {}

    // 1. Check sentence structure
    const structureCheck = this.validateSentenceStructure(words, level)
    if (!structureCheck.isCorrect) {
      errors.push(structureCheck.error)
      suggestions.push(...structureCheck.suggestions)
    }

    // 2. Check verb forms and tenses
    const verbCheck = this.validateVerbForms(words, grammarRules)
    if (!verbCheck.isCorrect) {
      errors.push(verbCheck.error)
      suggestions.push(...verbCheck.suggestions)
    }

    // 3. Check subject-verb agreement
    const agreementCheck = this.validateSubjectVerbAgreement(words, grammarRules)
    if (!agreementCheck.isCorrect) {
      errors.push(agreementCheck.error)
      suggestions.push(...agreementCheck.suggestions)
    }

    // 4. Check time expressions
    const timeCheck = this.validateTimeExpressions(words, grammarRules, level)
    if (!timeCheck.isCorrect) {
      errors.push(timeCheck.error)
      suggestions.push(...timeCheck.suggestions)
    }

    // 5. Check auxiliary verbs
    const auxiliaryCheck = this.validateAuxiliaryVerbs(words, grammarRules)
    if (!auxiliaryCheck.isCorrect) {
      errors.push(auxiliaryCheck.error)
      suggestions.push(...auxiliaryCheck.suggestions)
    }

    // 6. Check question formation
    if (grammarRules.isQuestion) {
      const questionCheck = this.validateQuestionStructure(words, grammarRules)
      if (!questionCheck.isCorrect) {
        errors.push(questionCheck.error)
        suggestions.push(...questionCheck.suggestions)
      }
    }

    // 7. Check negation
    if (grammarRules.isNegative) {
      const negativeCheck = this.validateNegativeStructure(words, grammarRules)
      if (!negativeCheck.isCorrect) {
        errors.push(negativeCheck.error)
        suggestions.push(...negativeCheck.suggestions)
      }
    }

    return {
      isCorrect: errors.length === 0,
      errors,
      suggestions
    }
  }

  // Validate sentence structure based on level pattern
  validateSentenceStructure(words, level) {
    const pattern = level.pattern
    const requiredCategories = level.requiredCategories || []
    
    // Check if sentence has required components
    const missingComponents = []
    
    if (requiredCategories.includes('subjects') && !this.hasSubject(words)) {
      missingComponents.push('subject')
    }
    
    if (requiredCategories.includes('verbs') && !this.hasVerb(words)) {
      missingComponents.push('verb')
    }
    
    if (requiredCategories.includes('objects') && !this.hasObject(words)) {
      missingComponents.push('object')
    }

    if (missingComponents.length > 0) {
      return {
        isCorrect: false,
        error: `Missing ${missingComponents.join(', ')} in your sentence.`,
        suggestions: [`Add a ${missingComponents[0]} to complete the sentence.`]
      }
    }

    return { isCorrect: true }
  }

  // Validate verb forms based on tense and rules
  validateVerbForms(words, grammarRules) {
    const verbForm = grammarRules.verbForm
    if (!verbForm) return { isCorrect: true }

    const mainVerb = this.findMainVerb(words)
    if (!mainVerb) return { isCorrect: true }

    const verb = this.verbSelector.getVerbByBase(mainVerb.toLowerCase())
    if (!verb) return { isCorrect: true }

    // Check specific verb form requirements
    switch (verbForm) {
      case 'present':
        return this.validatePresentTense(words, verb, grammarRules)
      case 'past':
        return this.validatePastTense(words, verb, grammarRules)
      case 'perfect':
        return this.validatePerfectTense(words, verb, grammarRules)
      case 'continuous':
        return this.validateContinuousTense(words, verb, grammarRules)
      case 'base':
        return this.validateBaseForm(words, verb, grammarRules)
      default:
        return { isCorrect: true }
    }
  }

  // Validate present tense forms
  validatePresentTense(words, verb, grammarRules) {
    const subject = this.findSubject(words)
    const mainVerb = this.findMainVerb(words)
    
    if (!subject || !mainVerb) return { isCorrect: true }

    const expectedForm = this.isThirdPersonSingular(subject) ? verb.V1_3rd : verb.V1
    
    if (mainVerb.toLowerCase() !== expectedForm.toLowerCase()) {
      return {
        isCorrect: false,
        error: `Use "${expectedForm}" with "${subject}" (${this.isThirdPersonSingular(subject) ? 'V1-3rd' : 'V1'} form).`,
        suggestions: [`Change "${mainVerb}" to "${expectedForm}"`]
      }
    }

    return { isCorrect: true }
  }

  // Validate past tense forms
  validatePastTense(words, verb, grammarRules) {
    const mainVerb = this.findMainVerb(words)
    if (!mainVerb) return { isCorrect: true }

    // Check if auxiliary "did" is present (for questions/negatives)
    const hasDid = words.some(word => word.toLowerCase() === 'did' || word.toLowerCase() === "didn't")
    
    if (hasDid) {
      // After "did", use base form (V1)
      if (mainVerb.toLowerCase() !== verb.V1.toLowerCase()) {
        return {
          isCorrect: false,
          error: `Use V1 (base form) "${verb.V1}" after "did", not V2 form.`,
          suggestions: [`Change "${mainVerb}" to "${verb.V1}"`]
        }
      }
    } else {
      // Without auxiliary, use past form (V2)
      if (mainVerb.toLowerCase() !== verb.V2.toLowerCase()) {
        return {
          isCorrect: false,
          error: `Use V2 (past form) "${verb.V2}" for past tense.`,
          suggestions: [`Change "${mainVerb}" to "${verb.V2}"`]
        }
      }
    }

    return { isCorrect: true }
  }

  // Validate present perfect forms
  validatePerfectTense(words, verb, grammarRules) {
    const mainVerb = this.findMainVerb(words)
    const hasHave = words.some(word => ['have', 'has', "haven't", "hasn't"].includes(word.toLowerCase()))
    
    if (!hasHave) {
      return {
        isCorrect: false,
        error: 'Present perfect needs "have" or "has" + V3 (past participle).',
        suggestions: ['Add "have" or "has" before the verb']
      }
    }

    if (mainVerb && mainVerb.toLowerCase() !== verb.V3.toLowerCase()) {
      return {
        isCorrect: false,
        error: `Use V3 (past participle) "${verb.V3}" with have/has.`,
        suggestions: [`Change "${mainVerb}" to "${verb.V3}"`]
      }
    }

    return { isCorrect: true }
  }

  // Validate continuous tense forms
  validateContinuousTense(words, verb, grammarRules) {
    const mainVerb = this.findMainVerb(words)
    const hasBe = words.some(word => ['am', 'is', 'are', 'was', 'were'].includes(word.toLowerCase()))
    
    if (!hasBe) {
      return {
        isCorrect: false,
        error: 'Continuous tense needs "be" verb + verb-ing.',
        suggestions: ['Add "am", "is", "are", "was", or "were" before the verb']
      }
    }

    if (mainVerb && !mainVerb.endsWith('ing')) {
      return {
        isCorrect: false,
        error: `Use verb-ing form "${verb.V1_ing}" for continuous tense.`,
        suggestions: [`Change "${mainVerb}" to "${verb.V1_ing}"`]
      }
    }

    return { isCorrect: true }
  }

  // Validate base form (after auxiliaries)
  validateBaseForm(words, verb, grammarRules) {
    const mainVerb = this.findMainVerb(words)
    
    if (mainVerb && mainVerb.toLowerCase() !== verb.V1.toLowerCase()) {
      return {
        isCorrect: false,
        error: `Use base form (V1) "${verb.V1}" after auxiliary verbs.`,
        suggestions: [`Change "${mainVerb}" to "${verb.V1}"`]
      }
    }

    return { isCorrect: true }
  }

  // Validate subject-verb agreement
  validateSubjectVerbAgreement(words, grammarRules) {
    if (!grammarRules.subjectVerbAgreement) return { isCorrect: true }

    const subject = this.findSubject(words)
    const auxiliary = this.findAuxiliary(words)
    
    if (!subject || !auxiliary) return { isCorrect: true }

    const expectedAuxiliary = this.getExpectedAuxiliary(subject, grammarRules.requiresAuxiliary)
    
    if (auxiliary.toLowerCase() !== expectedAuxiliary.toLowerCase()) {
      return {
        isCorrect: false,
        error: `Use "${expectedAuxiliary}" with "${subject}", not "${auxiliary}".`,
        suggestions: [`Change "${auxiliary}" to "${expectedAuxiliary}"`]
      }
    }

    return { isCorrect: true }
  }

  // Validate time expressions
  validateTimeExpressions(words, grammarRules, level) {
    const sentence = words.join(' ')
    const timeExpressions = this.extractTimeExpressions(sentence)
    
    if (timeExpressions.length === 0) return { isCorrect: true }

    // Check compatibility with tense
    for (const timeExpr of timeExpressions) {
      const validation = this.timeValidator.validateTimeExpressionWithTense(timeExpr, grammarRules.verbForm)
      if (!validation.isCorrect) {
        return {
          isCorrect: false,
          error: validation.explanation,
          suggestions: [validation.suggestion].filter(Boolean)
        }
      }
    }

    // Special validation for present perfect vs past simple (Level 22)
    if (level.isCriticalLevel && grammarRules.tenseComparison) {
      return this.validateCriticalTenseComparison(timeExpressions, grammarRules)
    }

    return { isCorrect: true }
  }

  // Critical validation for present perfect vs past simple
  validateCriticalTenseComparison(timeExpressions, grammarRules) {
    for (const timeExpr of timeExpressions) {
      const isFinished = grammarRules.finishedTimeMarkers?.some(marker => 
        timeExpr.includes(marker) || timeExpr.endsWith('ago')
      )
      const isUnfinished = grammarRules.unfinishedTimeMarkers?.some(marker => 
        timeExpr.includes(marker)
      )

      if (isFinished && grammarRules.verbForm === 'perfect') {
        return {
          isCorrect: false,
          error: `"${timeExpr}" is finished time. Use Past Simple (V2), not Present Perfect.`,
          suggestions: ['Change to Past Simple tense']
        }
      }

      if (isUnfinished && grammarRules.verbForm === 'past') {
        return {
          isCorrect: false,
          error: `"${timeExpr}" is unfinished time. Use Present Perfect (have/has + V3), not Past Simple.`,
          suggestions: ['Change to Present Perfect tense']
        }
      }
    }

    return { isCorrect: true }
  }

  // Validate auxiliary verbs
  validateAuxiliaryVerbs(words, grammarRules) {
    const requiredAuxiliary = grammarRules.requiresAuxiliary
    if (!requiredAuxiliary) return { isCorrect: true }

    const auxiliary = this.findAuxiliary(words)
    const subject = this.findSubject(words)

    if (!auxiliary) {
      return {
        isCorrect: false,
        error: `This sentence needs "${requiredAuxiliary}" auxiliary verb.`,
        suggestions: [`Add "${requiredAuxiliary}" to your sentence`]
      }
    }

    // Check auxiliary agreement with subject
    if (grammarRules.auxiliaryAgreement && subject) {
      const expectedAux = this.getExpectedAuxiliary(subject, requiredAuxiliary)
      if (auxiliary.toLowerCase() !== expectedAux.toLowerCase()) {
        return {
          isCorrect: false,
          error: `Use "${expectedAux}" with "${subject}", not "${auxiliary}".`,
          suggestions: [`Change "${auxiliary}" to "${expectedAux}"`]
        }
      }
    }

    return { isCorrect: true }
  }

  // Validate question structure
  validateQuestionStructure(words, grammarRules) {
    const questionType = grammarRules.questionType
    
    if (questionType === 'yes/no') {
      return this.validateYesNoQuestion(words, grammarRules)
    } else if (questionType === 'wh') {
      return this.validateWhQuestion(words, grammarRules)
    }

    return { isCorrect: true }
  }

  // Validate yes/no questions
  validateYesNoQuestion(words, grammarRules) {
    const auxiliary = words[0]?.toLowerCase()
    const expectedAux = grammarRules.requiresAuxiliary

    if (!['do', 'does', 'did', 'am', 'is', 'are', 'was', 'were', 'have', 'has', 'will', 'can', 'could', 'should', 'must'].includes(auxiliary)) {
      return {
        isCorrect: false,
        error: 'Yes/No questions must start with an auxiliary verb.',
        suggestions: [`Start with "${expectedAux}" for this question type`]
      }
    }

    return { isCorrect: true }
  }

  // Validate wh-questions
  validateWhQuestion(words, grammarRules) {
    const questionWord = words[0]?.toLowerCase()
    const questionWords = ['what', 'who', 'where', 'when', 'why', 'how', 'which']

    if (!questionWords.includes(questionWord)) {
      return {
        isCorrect: false,
        error: 'Wh-questions must start with a question word (what, who, where, etc.).',
        suggestions: ['Start with a question word like "what" or "who"']
      }
    }

    return { isCorrect: true }
  }

  // Validate negative structure
  validateNegativeStructure(words, grammarRules) {
    const hasNegative = words.some(word => 
      ['not', "don't", "doesn't", "didn't", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "won't", "can't", "couldn't", "shouldn't", "mustn't"].includes(word.toLowerCase())
    )

    if (!hasNegative) {
      return {
        isCorrect: false,
        error: 'Negative sentences need "not" or a negative contraction.',
        suggestions: ['Add "not" or use a contraction like "don\'t"']
      }
    }

    return { isCorrect: true }
  }

  // Helper functions
  findSubject(words) {
    const subjects = ['I', 'you', 'he', 'she', 'it', 'we', 'they', 'the student', 'my friend']
    return words.find(word => subjects.includes(word.toLowerCase()))
  }

  findMainVerb(words) {
    // Skip auxiliary verbs and find main verb
    const auxiliaries = ['am', 'is', 'are', 'was', 'were', 'have', 'has', 'do', 'does', 'did', 'will', 'would', 'can', 'could', 'should', 'must']
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase()
      if (!auxiliaries.includes(word) && this.verbSelector.getVerbByBase(word)) {
        return words[i]
      }
    }
    return null
  }

  findAuxiliary(words) {
    const auxiliaries = ['am', 'is', 'are', 'was', 'were', 'have', 'has', 'do', 'does', 'did', 'will', 'would', 'can', 'could', 'should', 'must']
    return words.find(word => auxiliaries.includes(word.toLowerCase()))
  }

  hasSubject(words) {
    return this.findSubject(words) !== null
  }

  hasVerb(words) {
    return this.findMainVerb(words) !== null
  }

  hasObject(words) {
    // Simplified object detection
    const objects = ['pizza', 'book', 'car', 'house', 'music', 'movie', 'food', 'water', 'coffee', 'tea']
    return words.some(word => objects.includes(word.toLowerCase()))
  }

  isThirdPersonSingular(subject) {
    return ['he', 'she', 'it'].includes(subject?.toLowerCase())
  }

  getExpectedAuxiliary(subject, auxiliaryType) {
    const patterns = this.auxiliaryPatterns[auxiliaryType]
    if (!patterns) return auxiliaryType

    const subjectKey = subject.toLowerCase()
    return patterns[subjectKey] || auxiliaryType
  }

  extractTimeExpressions(sentence) {
    const timeWords = [
      'yesterday', 'today', 'tomorrow', 'now', 'ago', 'since', 'for',
      'last week', 'this week', 'next week', 'last month', 'this month',
      'always', 'usually', 'sometimes', 'never', 'often', 'rarely',
      'just', 'already', 'yet', 'recently', 'ever', 'before'
    ]

    return timeWords.filter(timeWord => 
      sentence.toLowerCase().includes(timeWord.toLowerCase())
    )
  }

  // Feedback generation
  generatePositiveFeedback(level, sentence) {
    const feedbackTemplates = [
      `Perfect! You correctly used ${level.name}: "${sentence}"`,
      `Excellent! That's a great example of ${level.pattern}.`,
      `Well done! You've mastered ${level.formula}.`,
      `Outstanding! Your sentence follows the ${level.name} pattern perfectly.`,
      `Fantastic! You understand ${level.explanation.split('.')[0]}.`
    ]

    const randomTemplate = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)]
    return `${randomTemplate} +${level.points} points! 🎉`
  }

  generateCorrectiveFeedback(errors, level) {
    const mainError = errors[0] || 'There seems to be an issue with your sentence.'
    return `${mainError} Remember: ${level.explanation}`
  }
}

// Export the enhanced grammar engine
export const grammarEngine = new EnhancedGrammarEngine()

export default EnhancedGrammarEngine

