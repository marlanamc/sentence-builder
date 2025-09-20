// Grammar Engine Instance
// Singleton instance of the enhanced grammar engine with CSV data loaded

import { EnhancedGrammarEngine } from './enhanced-grammar-engine';
import { initializeGrammarData, getGrammarDataLoader } from './grammar-data-loader';

let grammarEngineInstance: EnhancedGrammarEngine | null = null;
let isInitialized = false;

export async function getGrammarEngine(): Promise<EnhancedGrammarEngine> {
  if (!isInitialized) {
    await initializeEngine();
  }

  if (!grammarEngineInstance) {
    throw new Error('Grammar engine failed to initialize');
  }

  return grammarEngineInstance;
}

async function initializeEngine(): Promise<void> {
  try {
    console.log('🚀 Initializing enhanced grammar engine...');

    // Load CSV data
    const dataLoader = await initializeGrammarData();

    // Create enhanced engine with loaded data
    grammarEngineInstance = new EnhancedGrammarEngine(
      dataLoader.getGrammarRules(),
      dataLoader.getValidationMatrix()
    );

    isInitialized = true;
    console.log('✅ Enhanced grammar engine initialized successfully!');

  } catch (error) {
    console.error('❌ Failed to initialize grammar engine:', error);
    throw error;
  }
}

// Export the validation interface that matches the existing code
export interface ValidationResult {
  isValid: boolean;
  score: number;
  feedback: string;
}

export const grammarEngine = {
  async validateSentence(tokens: any[], context: { levelId: number }): Promise<ValidationResult> {
    try {
      const engine = await getGrammarEngine();
      return engine.validateSentence(tokens, context);
    } catch (error) {
      console.error('Error validating sentence:', error);
      // Fallback to basic validation
      return {
        isValid: tokens.length > 0,
        score: tokens.length > 0 ? 0.5 : 0,
        feedback: tokens.length > 0 ? 'Sentence looks good!' : 'Please build a sentence first.'
      };
    }
  }
};

// Initialize the engine when this module is imported
if (typeof window !== 'undefined') {
  // Only initialize in browser environment
  initializeEngine().catch(console.error);
}