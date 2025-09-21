#!/usr/bin/env node

/**
 * Level Validation Test Script
 *
 * This script validates that all 47 levels have:
 * ✅ Grammar guides with proper structure
 * ✅ No Spanish content (to be inclusive)
 * ✅ Correct pattern components
 * ✅ Word toolbox requirements
 */

console.log('🎯 LEVEL VALIDATION TEST')
console.log('========================')

// Simple validation - count levels in fallback patterns
import fs from 'fs'
import path from 'path'

try {
  const grammarFile = path.join(__dirname, '../src/utils/grammarPatterns.ts')
  const content = fs.readFileSync(grammarFile, 'utf8')

  // Count how many levels have patterns (looking for both single and double quotes)
  const levelMatches = content.match(/["'](\d+)["']: \{/g) || []
  const validLevels = levelMatches.length

  console.log(`📊 Grammar Guide Status:`)
  console.log(`   ✅ Levels with grammar guides: ${validLevels}/47`)
  console.log(`   ❌ Levels missing grammar guides: ${47 - validLevels}/47`)

  // Check for Spanish content in actual grammar explanations (ignoring validation code and empty fields)
  const explanationMatches = content.match(/explanation: "([^"]+)"/g) || []
  const spanishInExplanations = explanationMatches.filter(match => {
    const explanation = match.match(/explanation: "([^"]+)"/)[1].toLowerCase()
    return explanation.includes('spanish') || explanation.includes('español')
  }).length
  const hasSpanish = spanishInExplanations > 0

  console.log(`\n🌍 Inclusivity Check:`)
  console.log(`   ${hasSpanish ? '❌' : '✅'} Spanish content detected: ${spanishInExplanations} instances`)

  // Check for helper vs auxiliary (ignoring comments)
  const helperMatches = content.match(/helper/g) || []
  const auxiliaryMatches = content.match(/(?<!\/\/.*)auxiliary/g) || []

  console.log(`\n🔧 Terminology Check:`)
  console.log(`   ✅ Helper usage: ${helperMatches.length} instances`)
  console.log(`   ❌ Auxiliary usage: ${auxiliaryMatches.length} instances`)

  // Check word toolbox requirements by examining pattern components
  const patternComponents = content.match(/pattern_components: ["']([^"']+)["']/g) || []
  const toolboxIssues = patternComponents.filter(comp => {
    const components = comp.match(/pattern_components: ["']([^"']+)["']/)[1]
    return !components.includes('subject') || !components.includes('verb')
  })

  console.log(`\n🧰 Pattern Structure Check:`)
  console.log(`   ✅ Levels with proper subject+verb patterns: ${patternComponents.length - toolboxIssues.length}/${patternComponents.length}`)
  console.log(`   ❌ Levels with pattern issues: ${toolboxIssues.length}`)

  // Overall assessment
  console.log('\n🏁 VALIDATION RESULTS')
  console.log('======================')

  const issues = [
    validLevels < 47,
    hasSpanish,
    auxiliaryMatches.length > 0,
    toolboxIssues.length > 0
  ].filter(Boolean).length

  if (issues === 0) {
    console.log('🎉 SUCCESS: All levels are ready for production!')
    console.log('   ✓ All 47 levels have grammar guides')
    console.log('   ✓ No Spanish content detected')
    console.log('   ✓ Using inclusive "helper" terminology')
    console.log('   ✓ All patterns have proper structure')
    console.log('\n📚 Students can now learn from any level 1-47!')
    console.log('   The grammar guides are inclusive and comprehensive.')
  } else {
    console.log(`⚠️  WARNING: ${issues} issue(s) found that need attention:`)
    if (validLevels < 47) console.log(`   - ${47 - validLevels} levels are missing grammar guides`)
    if (hasSpanish) console.log(`   - Spanish content detected (not inclusive)`)
    if (auxiliaryMatches.length > 0) console.log(`   - Still using "auxiliary" instead of "helper"`)
    if (toolboxIssues.length > 0) console.log(`   - ${toolboxIssues.length} levels have pattern structure issues`)
  }

} catch (error) {
  console.error('❌ Error running validation:', error.message)
  process.exit(1)
}
