import { NextRequest, NextResponse } from 'next/server';

// Quick database setup endpoint
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'create-tables') {
      // Essential tables for the enhanced sentence builder
      const essentialTables = [
        {
          name: 'users',
          description: 'User accounts and authentication',
          sql: `CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  username VARCHAR(50) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  native_language VARCHAR(50),
  proficiency_level VARCHAR(20) DEFAULT 'beginner',
  is_active BOOLEAN DEFAULT true
);`
        },
        {
          name: 'user_progress',
          description: 'Track XP, streaks, and level progression',
          sql: `CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_level_progress INTEGER DEFAULT 0,
  unlocked_categories TEXT[] DEFAULT ARRAY['present-basics'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`
        },
        {
          name: 'user_sessions',
          description: 'Daily learning sessions for streak tracking',
          sql: `CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_date DATE DEFAULT CURRENT_DATE,
  sentences_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  levels_completed INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, session_date)
);`
        },
        {
          name: 'question_attempts',
          description: 'Every sentence attempt for learning analytics',
          sql: `CREATE TABLE IF NOT EXISTS question_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  level_id INTEGER,
  sentence_text TEXT NOT NULL,
  is_correct BOOLEAN,
  score NUMERIC(3,2),
  feedback TEXT,
  time_spent INTEGER,
  hint_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`
        },
        {
          name: 'achievements',
          description: 'Achievement definitions and unlockable content',
          sql: `CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  category VARCHAR(50),
  unlock_condition JSONB,
  xp_reward INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`
        },
        {
          name: 'user_achievements',
          description: 'Track which achievements users have unlocked',
          sql: `CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);`
        }
      ];

      return NextResponse.json({
        success: true,
        message: 'Essential tables for enhanced sentence builder',
        tables: essentialTables,
        setupSteps: [
          {
            step: 1,
            title: 'Go to Supabase Dashboard',
            description: 'Open your Supabase project dashboard'
          },
          {
            step: 2,
            title: 'Open SQL Editor',
            description: 'Navigate to SQL Editor in the left sidebar'
          },
          {
            step: 3,
            title: 'Run Table Creation Scripts',
            description: 'Copy and run each SQL statement to create the tables'
          },
          {
            step: 4,
            title: 'Enable Row Level Security',
            description: 'Set up RLS policies for user data protection'
          },
          {
            step: 5,
            title: 'Test Connection',
            description: 'Use the admin dashboard to verify everything works'
          }
        ],
        features: [
          'Real-time progress tracking across devices',
          'Daily streak tracking and session analytics',
          'Achievement system with unlockable content',
          'Comprehensive learning analytics',
          'Secure user data with RLS policies'
        ]
      });
    }

    return NextResponse.json({
      message: '🎯 Enhanced Sentence Builder Database Setup',
      description: 'Ready to create tables for your gamified learning platform',
      availableActions: ['create-tables'],
      benefits: [
        'Cross-device progress synchronization',
        'Real-time XP and streak tracking',
        'Advanced learning analytics',
        'Achievement and gamification system',
        'Secure user data management'
      ],
      nextStep: 'POST with action: "create-tables" to get SQL scripts'
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Setup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for setup information
export async function GET() {
  return NextResponse.json({
    message: 'Sentence Builder Database Setup',
    supabaseConnected: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    nextSteps: [
      '1. Visit /admin to inspect your current database schema',
      '2. Use the admin interface to create missing tables',
      '3. Test the connection with sample data',
      '4. Start using the game with database integration'
    ],
    features: [
      'Complete user management system',
      'Progress tracking and analytics',
      'Comprehensive question bank',
      'Advanced grammar validation',
      'Adaptive difficulty system',
      'Gamification features'
    ]
  });
}