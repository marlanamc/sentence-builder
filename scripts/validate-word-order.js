#!/usr/bin/env node

// Word Order Validation Script
// Validates that all 47 levels have the necessary parts of speech for their word order patterns

const fs = require('fs');
const path = require('path');

// Read the levels data
const levelsPath = path.join(__dirname, '../src/data/comprehensiveLevels45.js');
const levelsContent = fs.readFileSync(levelsPath, 'utf8');

// Extract levels array (simple regex approach)
const levelsMatch = levelsContent.match(/export const comprehensiveLevels47 = \[([\s\S]*?)\]/);
if (!levelsMatch) {
  console.error('Could not find levels array');
  process.exit(1);
}

// Parse levels (simplified - in real implementation, you'd use a proper parser)
const levelsText = levelsMatch[1];
const levelObjects = [];

// Split by level objects (looking for { id: pattern)
const levelMatches = levelsText.match(/\{\s*id:\s*\d+[\s\S]*?(?=\{\s*id:\s*\d+|\s*\]\s*$)/g);
if (levelMatches) {
  levelMatches.forEach(levelText => {
    const idMatch = levelText.match(/id:\s*(\d+)/);
    const nameMatch = levelText.match(/name:\s*['"`]([^'"`]+)['"`]/);
    const patternMatch = levelText.match(/pattern:\s*['"`]([^'"`]+)['"`]/);
    const formulaMatch = levelText.match(/formula:\s*['"`]([^'"`]+)['"`]/);
    const requiredCategoriesMatch = levelText.match(/requiredCategories:\s*\[([^\]]+)\]/);
    
    if (idMatch && nameMatch && patternMatch && formulaMatch && requiredCategoriesMatch) {
      const level = {
        id: parseInt(idMatch[1]),
        name: nameMatch[1],
        pattern: patternMatch[1],
        formula: formulaMatch[1],
        requiredCategories: requiredCategoriesMatch[1]
          .split(',')
          .map(cat => cat.trim().replace(/['"`]/g, ''))
          .filter(cat => cat.length > 0)
      };
      levelObjects.push(level);
    }
  });
}

console.log(`\n🔍 WORD ORDER VALIDATION REPORT`);
console.log(`=====================================`);
console.log(`Found ${levelObjects.length} levels to validate\n`);

// Define word order patterns and their required parts of speech
const wordOrderPatterns = {
  // Basic SVO patterns
  'Subject + V1/V1-3rd + Object': {
    required: ['subjects', 'verbs', 'objects'],
    description: 'Basic subject-verb-object order'
  },
  'Subject + V1/V1-3rd + a/an/the + Object': {
    required: ['subjects', 'verbs', 'objects', 'articles'],
    description: 'SVO with articles'
  },
  'Subject + do/does + not + V1 + Object': {
    required: ['subjects', 'helpers', 'negatives', 'verbs', 'objects'],
    description: 'Negative present tense'
  },
  'Do/Does + Subject + V1 + Object?': {
    required: ['helpers', 'subjects', 'verbs', 'objects'],
    description: 'Yes/No questions'
  },
  'What + do/does + Subject + V1?': {
    required: ['question-words', 'helpers', 'subjects', 'verbs'],
    description: 'Wh-questions (What)'
  },
  'Wh-word + do/does + Subject + V1?': {
    required: ['question-words', 'helpers', 'subjects', 'verbs'],
    description: 'Wh-questions (Who/Where/When)'
  },
  'Subject + am/is/are + V1-ing + Object': {
    required: ['subjects', 'be-verbs', 'verbs', 'objects'],
    description: 'Present continuous'
  },
  'Wh-word + am/is/are + Subject + V1-ing?': {
    required: ['question-words', 'be-verbs', 'subjects', 'verbs'],
    description: 'Present continuous questions'
  },
  
  // Past tense patterns
  'Subject + V2 + Object': {
    required: ['subjects', 'verbs', 'objects', 'time-markers'],
    description: 'Past simple affirmative'
  },
  'Subject + didn\'t + V1 + Object': {
    required: ['subjects', 'helpers', 'negatives', 'verbs', 'objects'],
    description: 'Past simple negative'
  },
  'Did + Subject + V1 + Object?': {
    required: ['helpers', 'subjects', 'verbs', 'objects'],
    description: 'Past simple questions'
  },
  'Subject + was/were + V1-ing + Object': {
    required: ['subjects', 'be-verbs', 'verbs', 'objects'],
    description: 'Past continuous'
  },
  'Subject + was/were + V3': {
    required: ['subjects', 'be-verbs', 'verbs'],
    description: 'Passive voice'
  },
  
  // Present perfect patterns
  'Subject + have/has + V3 + Object': {
    required: ['subjects', 'have-verbs', 'verbs', 'objects'],
    description: 'Present perfect introduction'
  },
  'Have/Has + Subject + ever + V3?': {
    required: ['have-verbs', 'subjects', 'experience-words', 'verbs'],
    description: 'Present perfect experience'
  },
  'Subject + have/has + just/already + V3': {
    required: ['subjects', 'have-verbs', 'recent-words', 'verbs'],
    description: 'Present perfect recent actions'
  },
  'Subject + have/has + V3 + for/since': {
    required: ['subjects', 'have-verbs', 'verbs', 'duration-expressions'],
    description: 'Present perfect duration'
  },
  
  // Future tense patterns
  'Subject + am/is/are + going to + V1': {
    required: ['subjects', 'be-verbs', 'going-to', 'verbs'],
    description: 'Going to future'
  },
  'Subject + will + V1 + Object': {
    required: ['subjects', 'will', 'verbs', 'objects'],
    description: 'Will future'
  },
  'If + Present, will + V1': {
    required: ['conditionals', 'subjects', 'verbs'],
    description: 'First conditional'
  },
  'Subject + will be + V1-ing + Object': {
    required: ['subjects', 'will', 'be-verbs', 'verbs', 'objects'],
    description: 'Future continuous'
  },
  'Subject + will have + V3 + by time': {
    required: ['subjects', 'will', 'have-verbs', 'verbs'],
    description: 'Future perfect'
  },
  
  // Modal patterns
  'Subject + modal + V1': {
    required: ['subjects', 'modals', 'verbs'],
    description: 'Modal verbs'
  },
  'Subject + have to/must + V1': {
    required: ['subjects', 'obligation-words', 'verbs'],
    description: 'Obligation expressions'
  },
  'Verb + V1-ing / Verb + to + V1': {
    required: ['subjects', 'verbs', 'gerunds', 'infinitives'],
    description: 'Gerunds and infinitives'
  },
  
  // Command patterns
  'V1 + Object / Don\'t + V1 + Object': {
    required: ['verbs', 'objects', 'negatives'],
    description: 'Imperatives'
  },
  'Let\'s + V1 + Object': {
    required: ['lets', 'verbs', 'objects'],
    description: 'Let\'s suggestions'
  },
  'How about/What about + V1-ing/noun': {
    required: ['suggestion-phrases', 'verbs', 'objects'],
    description: 'Casual suggestions'
  },
  
  // Comparison patterns
  'Subject + V1 + comparative + than + Object': {
    required: ['subjects', 'verbs', 'comparatives', 'objects'],
    description: 'Comparatives'
  },
  'Subject + V1 + the + superlative': {
    required: ['subjects', 'verbs', 'superlatives', 'objects'],
    description: 'Superlatives'
  },
  'someone/nothing/anything/everyone + verb': {
    required: ['indefinite-pronouns', 'verbs'],
    description: 'Indefinite pronouns'
  },
  
  // Advanced patterns
  'Noun + who/which/that + clause': {
    required: ['subjects', 'relative-pronouns', 'verbs'],
    description: 'Relative clauses'
  },
  'Statement + tag': {
    required: ['subjects', 'verbs', 'tag-questions'],
    description: 'Tag questions'
  },
  'If + Subject + V2, Subject + would + V1': {
    required: ['subjects', 'verbs', 'conditionals'],
    description: 'Second conditional'
  },
  'If + Past Perfect, would have + V3': {
    required: ['subjects', 'verbs', 'conditionals'],
    description: 'Third conditional'
  },
  'Subject + phrasal verb + Object': {
    required: ['subjects', 'phrasal-verbs', 'objects'],
    description: 'Phrasal verbs'
  },
  'Subject + said + clause (backshift)': {
    required: ['subjects', 'reporting-verbs', 'verbs'],
    description: 'Reported speech'
  },
  'Do you know + wh-word + Subject + V1?': {
    required: ['polite-phrases', 'question-words', 'subjects', 'verbs'],
    description: 'Embedded questions'
  }
};

// Available word categories (from tiles.ts analysis)
const availableCategories = [
  'subjects', 'verbs', 'objects', 'articles', 'helpers', 'negatives',
  'question-words', 'be-verbs', 'time-prepositions', 'time-expressions',
  'frequency-adverbs', 'frequency-expressions', 'duration-expressions',
  'time-markers', 'have-verbs', 'experience-words', 'recent-words',
  'completion-words', 'going-to', 'will', 'modals', 'obligation-words',
  'used-to-forms', 'gerunds', 'infinitives', 'preference-words',
  'permission-modals', 'lets', 'suggestion-phrases', 'comparatives',
  'superlatives', 'indefinite-pronouns', 'relative-pronouns',
  'tag-questions', 'conditionals', 'phrasal-verbs', 'reporting-verbs',
  'polite-phrases'
];

// Validation results
const validationResults = {
  passed: 0,
  failed: 0,
  issues: []
};

console.log('📋 VALIDATING EACH LEVEL:\n');

levelObjects.forEach(level => {
  console.log(`Level ${level.id}: ${level.name}`);
  console.log(`  Pattern: ${level.pattern}`);
  console.log(`  Formula: ${level.formula}`);
  console.log(`  Required: [${level.requiredCategories.join(', ')}]`);
  
  // Check if pattern exists in our word order patterns
  const patternInfo = wordOrderPatterns[level.pattern];
  if (!patternInfo) {
    console.log(`  ❌ UNKNOWN PATTERN: "${level.pattern}"`);
    validationResults.failed++;
    validationResults.issues.push({
      level: level.id,
      name: level.name,
      issue: `Unknown word order pattern: "${level.pattern}"`,
      severity: 'high'
    });
  } else {
    console.log(`  ✅ Pattern recognized: ${patternInfo.description}`);
    
    // Check if all required categories are available
    const missingCategories = patternInfo.required.filter(cat => 
      !availableCategories.includes(cat)
    );
    
    if (missingCategories.length > 0) {
      console.log(`  ❌ MISSING CATEGORIES: [${missingCategories.join(', ')}]`);
      validationResults.failed++;
      validationResults.issues.push({
        level: level.id,
        name: level.name,
        issue: `Missing word categories: [${missingCategories.join(', ')}]`,
        severity: 'high'
      });
    } else {
      console.log(`  ✅ All required categories available`);
      validationResults.passed++;
    }
  }
  
  // Check if level's required categories match the pattern
  const levelRequired = new Set(level.requiredCategories);
  const patternRequired = new Set(patternInfo?.required || []);
  
  const missingInLevel = [...patternRequired].filter(cat => !levelRequired.has(cat));
  const extraInLevel = [...levelRequired].filter(cat => !patternRequired.has(cat));
  
  if (missingInLevel.length > 0) {
    console.log(`  ⚠️  MISSING IN LEVEL: [${missingInLevel.join(', ')}]`);
    validationResults.issues.push({
      level: level.id,
      name: level.name,
      issue: `Level missing required categories: [${missingInLevel.join(', ')}]`,
      severity: 'medium'
    });
  }
  
  if (extraInLevel.length > 0) {
    console.log(`  ℹ️  EXTRA IN LEVEL: [${extraInLevel.join(', ')}]`);
  }
  
  console.log('');
});

// Summary
console.log('\n📊 VALIDATION SUMMARY');
console.log('====================');
console.log(`✅ Passed: ${validationResults.passed}`);
console.log(`❌ Failed: ${validationResults.failed}`);
console.log(`⚠️  Issues: ${validationResults.issues.length}`);

if (validationResults.issues.length > 0) {
  console.log('\n🚨 ISSUES FOUND:');
  validationResults.issues.forEach(issue => {
    console.log(`  Level ${issue.level} (${issue.name}): ${issue.issue} [${issue.severity}]`);
  });
}

// Word order progression analysis
console.log('\n📈 WORD ORDER PROGRESSION ANALYSIS');
console.log('===================================');

const progressionAnalysis = {
  'Basic SVO': levelObjects.filter(l => l.pattern.includes('Subject + V1') && !l.pattern.includes('do/does')).length,
  'Questions': levelObjects.filter(l => l.pattern.includes('?') || l.pattern.includes('Wh-word')).length,
  'Negatives': levelObjects.filter(l => l.pattern.includes('not') || l.pattern.includes('don\'t')).length,
  'Continuous': levelObjects.filter(l => l.pattern.includes('ing')).length,
  'Perfect': levelObjects.filter(l => l.pattern.includes('have/has') || l.pattern.includes('V3')).length,
  'Future': levelObjects.filter(l => l.pattern.includes('will') || l.pattern.includes('going to')).length,
  'Modals': levelObjects.filter(l => l.pattern.includes('modal') || l.pattern.includes('can/should/must')).length,
  'Advanced': levelObjects.filter(l => l.pattern.includes('clause') || l.pattern.includes('conditional')).length
};

Object.entries(progressionAnalysis).forEach(([category, count]) => {
  console.log(`${category}: ${count} levels`);
});

console.log('\n🎯 RECOMMENDATIONS:');
if (validationResults.failed > 0) {
  console.log('1. Fix missing word categories for failed levels');
  console.log('2. Ensure all word order patterns are properly defined');
}
if (validationResults.issues.some(i => i.severity === 'high')) {
  console.log('3. Address high-severity issues immediately');
}
console.log('4. Consider adding more word tiles for missing categories');
console.log('5. Test each level to ensure word order patterns work correctly');

console.log('\n✨ Word order validation complete!');
