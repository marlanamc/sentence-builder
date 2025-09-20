import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database introspection utilities
export async function getCurrentSchema() {
  try {
    // Since we can't access information_schema directly,
    // we'll check for the existence of expected tables
    const expectedTables = [
      'users', 'user_progress', 'grammar_categories', 'grammar_levels',
      'grammar_rules', 'vocabulary_words', 'questions', 'question_attempts',
      'user_sessions', 'learning_analytics', 'achievements', 'user_achievements',
      'question_types', 'question_hints', 'word_categories', 'content_collections',
      'skill_assessments', 'difficulty_adjustments'
    ]

    const schemaInfo = []
    for (const tableName of expectedTables) {
      const exists = await checkTableExists(tableName)
      if (exists) {
        schemaInfo.push({
          tableName,
          status: 'exists',
          type: 'table'
        })
      }
    }

    return schemaInfo
  } catch (error) {
    console.error('Error getting schema:', error)
    return []
  }
}

export async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    // Try to query the table with a limit of 0 to check if it exists
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(0)

    // If no error, table exists
    return !error
  } catch {
    return false
  }
}

// Migration utilities
export async function createTableIfNotExists(tableName: string, createSQL: string) {
  const exists = await checkTableExists(tableName)

  if (!exists) {
    console.log(`Creating table: ${tableName}`)
    const { error } = await supabase.rpc('execute_sql', { sql: createSQL })

    if (error) {
      console.error(`Error creating table ${tableName}:`, error)
      return false
    }

    console.log(`Successfully created table: ${tableName}`)
    return true
  } else {
    console.log(`Table ${tableName} already exists`)
    return true
  }
}

// Data seeding utilities
export async function seedInitialData() {
  // Seed grammar categories
  const categories = [
    {
      id: 'present-basics',
      name: 'Present Tense Basics',
      description: 'Foundation present tense structures',
      icon: 'play',
      color_scheme: 'green',
      order_index: 1,
      unlock_requirement: 0
    },
    {
      id: 'time-expressions',
      name: 'Time & Expressions',
      description: 'Time concepts and preposition usage',
      icon: 'clock',
      color_scheme: 'yellow',
      order_index: 2,
      unlock_requirement: 100
    },
    {
      id: 'past-tense',
      name: 'Past Tense',
      description: 'Complete past tense mastery',
      icon: 'history',
      color_scheme: 'red',
      order_index: 3,
      unlock_requirement: 300
    },
    {
      id: 'present-perfect',
      name: 'Present Perfect',
      description: 'Present perfect in all its forms',
      icon: 'trending-up',
      color_scheme: 'purple',
      order_index: 4,
      unlock_requirement: 500
    }
  ]

  for (const category of categories) {
    const { error } = await supabase
      .from('grammar_categories')
      .upsert(category, { onConflict: 'id' })

    if (error) {
      console.error('Error seeding category:', error)
    }
  }

  console.log('Initial data seeded successfully')
}