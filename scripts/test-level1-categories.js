// Test script to verify Level 1 has correct categories
const fs = require('fs');
const path = require('path');

// Read the comprehensive levels file
const levelsPath = path.join(__dirname, '../src/data/comprehensiveLevels45.js');
const levelsContent = fs.readFileSync(levelsPath, 'utf8');

// Extract Level 1 data
const level1Match = levelsContent.match(/{\s*id:\s*1,[\s\S]*?}/);
if (!level1Match) {
  console.log('❌ Level 1 not found in levels file');
  process.exit(1);
}

const level1Str = level1Match[0];
console.log('🔍 Level 1 Configuration:');
console.log('========================');

// Extract required categories
const categoriesMatch = level1Str.match(/requiredCategories:\s*\[([^\]]+)\]/);
if (categoriesMatch) {
  const categories = categoriesMatch[1].split(',').map(c => c.trim().replace(/['"]/g, ''));
  console.log('📋 Required Categories:', categories);
} else {
  console.log('❌ No required categories found');
}

// Extract pattern
const patternMatch = level1Str.match(/pattern:\s*['"`]([^'"`]+)['"`]/);
if (patternMatch) {
  console.log('🎯 Pattern:', patternMatch[1]);
}

// Extract formula
const formulaMatch = level1Str.match(/formula:\s*['"`]([^'"`]+)['"`]/);
if (formulaMatch) {
  console.log('📐 Formula:', formulaMatch[1]);
}

console.log('\n✅ Level 1 should show:');
console.log('  - Subjects: I, you, he, she, it, we, they');
console.log('  - Verbs: eat/eats, like/likes, play/plays, watch/watches, drink/drinks, read/reads');
console.log('  - Objects: pizza, music, coffee, book/books, apple/apples, game/games');
console.log('\n🎯 Expected sentence examples:');
console.log('  - "I eat pizza"');
console.log('  - "She likes music"');
console.log('  - "We play games"');
console.log('  - "He drinks coffee"');
