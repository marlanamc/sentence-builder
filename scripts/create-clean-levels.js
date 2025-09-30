const fs = require('fs');
const path = require('path');

// Clean level data with properly escaped explanations
const cleanLevels = `export const comprehensiveLevels = [
  {
    id: 1,
    name: 'Present Simple - Basic',
    shortDescription: 'Basic present tense with I, you, he, she, it, we, they',
    category: 'present-basics',
    pattern: 'Subject + V1/V1-3rd + Object',
    formula: 'subject + verb + object',
    example: 'I eat pizza. / She likes music.',
    explanation: '**Verb Forms:**\\n• **V1 (base form)** with: I, you, we, they\\n• **V1-3rd (adds -s/-es)** with: he, she, it\\n\\n**Nouns & Articles:**\\n• Use **uncountable nouns** (pizza, soccer, coffee) or **plural nouns** (apples, books)\\n• **No articles needed**',
    requiredCategories: ['subjects', 'verbs', 'objects'],
    color: 'bg-green-50 border-green-200',
    points: 15,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['always', 'usually', 'often', 'sometimes', 'never'],
    grammarRules: ['present-simple-basic']
  },
  {
    id: 2,
    name: 'Articles - A, An, The',
    shortDescription: 'Using a, an, the with nouns',
    category: 'present-basics',
    pattern: 'Subject + V1/V1-3rd + a/an/the + Object',
    formula: 'subject + verb + a/an/the + object',
    example: 'I eat a sandwich. / She drinks the coffee.',
    explanation: '**Articles:**\\n• **"a"** before consonant sounds (a book, a car)\\n• **"an"** before vowel sounds (an apple, an hour)\\n• **"the"** for specific things (the book I read)\\n• **No article** with plural or uncountable nouns',
    requiredCategories: ['subjects', 'verbs', 'objects', 'articles'],
    color: 'bg-green-50 border-green-200',
    points: 20,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['always', 'usually', 'often', 'sometimes', 'never'],
    grammarRules: ['articles-basic']
  },
  {
    id: 3,
    name: 'Present Simple - Negative',
    shortDescription: 'Making negative sentences with do/does not',
    category: 'present-basics',
    pattern: 'Subject + do/does + not + V1 + Object',
    formula: 'subject + do(es) + not + verb + object',
    example: 'I don\'t like vegetables. / She doesn\'t eat meat.',
    explanation: '**Negative Forms:**\\n• **"don\'t"** with: I, you, we, they\\n• **"doesn\'t"** with: he, she, it\\n• Always use **V1 (base form)** after do/does',
    requiredCategories: ['subjects', 'verbs', 'objects', 'helpers', 'negatives'],
    color: 'bg-green-50 border-green-200',
    points: 25,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['never', 'not usually', 'rarely'],
    grammarRules: ['present-simple-negative']
  },
  {
    id: 4,
    name: 'Present Simple - Questions',
    shortDescription: 'Making questions with do/does',
    category: 'present-basics',
    pattern: 'Do/Does + Subject + V1 + Object?',
    formula: 'do(es) + subject + verb + object?',
    example: 'Do you like pizza? / Does she play soccer?',
    explanation: '**Question Forms:**\\n• **"Do"** with: I, you, we, they\\n• **"Does"** with: he, she, it\\n• Always use **V1 (base form)** after do/does\\n• Add **"?"** at the end',
    requiredCategories: ['helpers', 'subjects', 'verbs', 'objects'],
    color: 'bg-green-50 border-green-200',
    points: 25,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['always', 'usually', 'often', 'sometimes', 'never'],
    grammarRules: ['present-simple-questions']
  },
  {
    id: 5,
    name: 'Wh-Questions - What',
    shortDescription: 'Asking what questions',
    category: 'present-basics',
    pattern: 'What + do/does + Subject + V1?',
    formula: 'what + do(es) + subject + verb?',
    example: 'What do you eat?',
    explanation: '**Be Verbs:**\\n• **"am"** with: I\\n• **"is"** with: he, she, it\\n• **"are"** with: you, we, they\\n• Use **adjectives** or **noun phrases** after be',
    requiredCategories: ['question-words', 'helpers', 'subjects', 'verbs'],
    color: 'bg-green-50 border-green-200',
    points: 30,
    unlockRequirement: 0,
    difficulty: 'beginner',
    timeExpressions: ['always', 'usually', 'often', 'sometimes', 'never'],
    grammarRules: ['wh-questions-what']
  }
];

export default comprehensiveLevels;`;

const levelsPath = path.join(__dirname, '../src/data/comprehensiveLevels45.js');
fs.writeFileSync(levelsPath, cleanLevels, 'utf8');
console.log('✅ Created clean levels file with proper escaping');
