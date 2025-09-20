import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSchema, checkTableExists } from '@/lib/supabase-client';

// GET /api/admin/schema - Inspect current database schema
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'inspect';

    if (action === 'inspect') {
      const schema = await getCurrentSchema();

      if (!schema) {
        return NextResponse.json({
          error: 'Could not retrieve schema information',
          suggestion: 'Check your Supabase connection and ensure you have the correct permissions'
        }, { status: 500 });
      }

      // Check which tables from our comprehensive schema exist
      const expectedTables = [
        'users', 'user_progress', 'grammar_categories', 'grammar_levels',
        'grammar_rules', 'vocabulary_words', 'questions', 'question_attempts',
        'user_sessions', 'learning_analytics', 'achievements', 'user_achievements'
      ];

      const tableStatus = {};
      for (const table of expectedTables) {
        tableStatus[table] = await checkTableExists(table);
      }

      return NextResponse.json({
        currentSchema: schema,
        tableCount: schema.length,
        expectedTables: tableStatus,
        missingTables: Object.entries(tableStatus)
          .filter(([, exists]) => !exists)
          .map(([table]) => table),
        recommendations: generateSchemaRecommendations(schema, tableStatus)
      });

    } else if (action === 'compare') {
      // Compare with our comprehensive schema
      const currentSchema = await getCurrentSchema();
      const comparison = compareWithComprehensiveSchema(currentSchema);

      return NextResponse.json(comparison);

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "inspect" or "compare"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error inspecting schema:', error);
    return NextResponse.json({
      error: 'Failed to inspect database schema',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/admin/schema/migrate - Apply schema migrations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, tables } = body;

    if (action === 'create-missing') {
      const results = [];

      // Apply our comprehensive schema
      const migrations = getComprehensiveSchemaMigrations();

      for (const migration of migrations) {
        if (!tables || tables.includes(migration.tableName)) {
          try {
            const success = await createTableIfNotExists(migration.tableName, migration.sql);
            results.push({
              table: migration.tableName,
              success,
              action: 'created'
            });
          } catch (error) {
            results.push({
              table: migration.tableName,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }
      }

      return NextResponse.json({
        message: 'Migration completed',
        results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "create-missing"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error during migration:', error);
    return NextResponse.json({
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateSchemaRecommendations(currentSchema: any[], tableStatus: Record<string, boolean>) {
  const recommendations = [];

  if (currentSchema.length === 0) {
    recommendations.push({
      type: 'setup',
      priority: 'high',
      message: 'No tables found. Initialize database with comprehensive schema.',
      action: 'Create all required tables for the sentence builder game'
    });
  }

  const missingCritical = ['users', 'user_progress', 'questions', 'question_attempts'];
  const missingCriticalTables = missingCritical.filter(table => !tableStatus[table]);

  if (missingCriticalTables.length > 0) {
    recommendations.push({
      type: 'critical',
      priority: 'high',
      message: `Missing critical tables: ${missingCriticalTables.join(', ')}`,
      action: 'Create core tables for user management and question tracking'
    });
  }

  const missingGrammar = ['grammar_categories', 'grammar_levels', 'grammar_rules'];
  const missingGrammarTables = missingGrammar.filter(table => !tableStatus[table]);

  if (missingGrammarTables.length > 0) {
    recommendations.push({
      type: 'feature',
      priority: 'medium',
      message: `Missing grammar system tables: ${missingGrammarTables.join(', ')}`,
      action: 'Create tables for advanced grammar validation and rules'
    });
  }

  const missingAnalytics = ['learning_analytics', 'user_sessions'];
  const missingAnalyticsTables = missingAnalytics.filter(table => !tableStatus[table]);

  if (missingAnalyticsTables.length > 0) {
    recommendations.push({
      type: 'analytics',
      priority: 'medium',
      message: `Missing analytics tables: ${missingAnalyticsTables.join(', ')}`,
      action: 'Create tables for learning analytics and progress tracking'
    });
  }

  return recommendations;
}

function compareWithComprehensiveSchema(currentSchema: any[]) {
  const comprehensive = getComprehensiveSchemaDefinition();
  const current = currentSchema.map(table => table.tableName);

  return {
    comprehensive: {
      totalTables: comprehensive.length,
      tables: comprehensive.map(t => t.name)
    },
    current: {
      totalTables: current.length,
      tables: current
    },
    analysis: {
      missing: comprehensive.filter(c => !current.includes(c.name)).map(t => t.name),
      existing: comprehensive.filter(c => current.includes(c.name)).map(t => t.name),
      extra: current.filter(c => !comprehensive.find(comp => comp.name === c))
    },
    recommendations: {
      priority: 'Implement missing core tables first',
      nextSteps: [
        'Create user management tables',
        'Add question and progress tracking',
        'Implement analytics system',
        'Add gamification features'
      ]
    }
  };
}

function getComprehensiveSchemaDefinition() {
  return [
    { name: 'users', type: 'core', description: 'User accounts and profiles' },
    { name: 'user_progress', type: 'core', description: 'Learning progress tracking' },
    { name: 'grammar_categories', type: 'content', description: 'Grammar category organization' },
    { name: 'grammar_levels', type: 'content', description: '45-level progression system' },
    { name: 'grammar_rules', type: 'engine', description: 'Advanced grammar validation rules' },
    { name: 'vocabulary_words', type: 'content', description: 'Comprehensive word database' },
    { name: 'word_categories', type: 'content', description: 'Word type categorization' },
    { name: 'question_types', type: 'content', description: 'Question format definitions' },
    { name: 'questions', type: 'core', description: 'Extensive question bank' },
    { name: 'question_hints', type: 'content', description: 'Progressive hint system' },
    { name: 'question_attempts', type: 'core', description: 'Student answer tracking' },
    { name: 'user_sessions', type: 'analytics', description: 'Learning session management' },
    { name: 'learning_analytics', type: 'analytics', description: 'Performance metrics' },
    { name: 'skill_assessments', type: 'adaptive', description: 'Skill proficiency tracking' },
    { name: 'achievements', type: 'gamification', description: 'Achievement definitions' },
    { name: 'user_achievements', type: 'gamification', description: 'User achievement progress' },
    { name: 'content_collections', type: 'content', description: 'Curated content sets' }
  ];
}

function getComprehensiveSchemaMigrations() {
  // This would return the SQL from our comprehensive schema file
  // For now, returning a simplified version
  return [
    {
      tableName: 'users',
      sql: `
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          username VARCHAR(50) UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          native_language VARCHAR(50),
          proficiency_level VARCHAR(20) DEFAULT 'beginner',
          is_active BOOLEAN DEFAULT true
        );
      `
    },
    {
      tableName: 'user_progress',
      sql: `
        CREATE TABLE user_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          total_xp INTEGER DEFAULT 0,
          current_streak INTEGER DEFAULT 0,
          longest_streak INTEGER DEFAULT 0,
          total_questions_answered INTEGER DEFAULT 0,
          correct_answers INTEGER DEFAULT 0,
          current_level INTEGER DEFAULT 1,
          unlocked_categories TEXT[] DEFAULT ARRAY['present-basics'],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
    // Add more migrations as needed
  ];
}