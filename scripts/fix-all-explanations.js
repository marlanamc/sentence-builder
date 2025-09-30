const fs = require('fs');
const path = require('path');

const levelsPath = path.join(__dirname, '../src/data/comprehensiveLevels45.js');
let content = fs.readFileSync(levelsPath, 'utf8');

// Clean up all explanation strings - remove duplicates and fix escaping
const cleanExplanation = (explanation) => {
  // Remove any duplicate content that might have been created
  let cleaned = explanation
    .replace(/\*\*([^*]+)\*\*([^*]+)\*\*([^*]+)\*\*/g, '**$1**$2**$3**') // Fix malformed bold
    .replace(/([^\\])\n/g, '$1\\n') // Escape newlines
    .replace(/'/g, "\\'") // Escape single quotes
    .replace(/"/g, '\\"'); // Escape double quotes
  
  // Remove any duplicate sentences
  const lines = cleaned.split('\\n');
  const uniqueLines = [...new Set(lines)];
  return uniqueLines.join('\\n');
};

// Find and fix all explanation fields
content = content.replace(/explanation:\s*['"`]([^'"`]+)['"`]/g, (match, explanation) => {
  const cleaned = cleanExplanation(explanation);
  return `explanation: '${cleaned}'`;
});

// Write updated content
fs.writeFileSync(levelsPath, content, 'utf8');
console.log('✅ Fixed all explanation strings and removed duplicates');
