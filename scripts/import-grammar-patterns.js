// Script to import all CSV grammar patterns into Supabase
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Simple CSV parser that handles quoted fields
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  // Add the last field
  result.push(current)
  return result
}

function parseCSVRow(row) {
  if (row.length < 21) return null

  return {
    level_id: row[0],
    name: row[1],
    category: row[2],
    pattern_display: row[3],
    pattern_formula: row[4],
    pattern_components: row[5],
    example_1: row[6],
    example_2: row[7],
    example_3: row[8],
    explanation: row[9],
    show_articles: row[10].toLowerCase() === 'true',
    show_auxiliaries: row[11].toLowerCase() === 'true',
    show_negation: row[12].toLowerCase() === 'true',
    show_questions: row[13].toLowerCase() === 'true',
    auxiliary_type: row[14],
    question_type: row[15],
    spanish_error_pattern: row[16],
    gentle_correction: row[17],
    memory_trick: row[18],
    time_markers: row[19],
    exception_notes: row[20]
  }
}

async function importGrammarPatterns() {
  try {
    console.log('Reading CSV file...')
    const csvPath = path.join(process.cwd(), 'enhanced_grammar_guide_patterns_complete.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')

    const lines = csvContent.split('\n').filter(line => line.trim().length > 0)
    const patterns = []

    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i])
      const pattern = parseCSVRow(row)
      if (pattern && pattern.level_id) {
        patterns.push(pattern)
      }
    }

    console.log(`Parsed ${patterns.length} patterns from CSV`)

    // Clear existing data
    console.log('Clearing existing patterns...')
    const { error: deleteError } = await supabase
      .from('enhanced_grammar_patterns')
      .delete()
      .neq('id', 0) // Delete all records

    if (deleteError) {
      console.warn('Warning during delete:', deleteError)
    }

    // Insert new data in batches
    const batchSize = 10
    let inserted = 0

    for (let i = 0; i < patterns.length; i += batchSize) {
      const batch = patterns.slice(i, i + batchSize)

      const { error } = await supabase
        .from('enhanced_grammar_patterns')
        .insert(batch)

      if (error) {
        console.error('Error inserting batch:', error)
        console.error('Batch data:', batch)
        break
      }

      inserted += batch.length
      console.log(`Inserted ${inserted}/${patterns.length} patterns...`)
    }

    console.log('✅ Import completed successfully!')

    // Verify the import
    const { data: verifyData, error: verifyError } = await supabase
      .from('enhanced_grammar_patterns')
      .select('level_id, name')
      .order('level_id')

    if (verifyError) {
      console.error('Verification error:', verifyError)
    } else {
      console.log(`✅ Verified: ${verifyData.length} patterns in database`)
      console.log('First few patterns:')
      verifyData.slice(0, 5).forEach(p => console.log(`  ${p.level_id}: ${p.name}`))
    }

  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  }
}

importGrammarPatterns()