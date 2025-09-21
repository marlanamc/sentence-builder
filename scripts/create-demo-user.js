#!/usr/bin/env node

/**
 * Script to create demo user in Supabase Auth
 * Run this to set up the demo account: demo@example.com / demo123
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Make sure you have:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createDemoUser() {
  console.log('🔧 Creating demo user...')

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'demo@example.com',
      password: 'demo123',
      email_confirm: true,
      user_metadata: {
        username: 'demo_user'
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('✅ Demo user already exists in auth system')
        return
      }
      throw authError
    }

    console.log('✅ Demo user created in auth system:', authData.user.email)

    // Create user progress record
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert([
        {
          user_id: authData.user.id,
          total_xp: 150,
          current_streak: 3,
          longest_streak: 7,
          total_questions_answered: 25,
          correct_answers: 20,
          current_level: 4,
          unlocked_categories: ['present-basics', 'time-expressions'],
          achievements: ['first_login', 'level_complete'],
          study_time_minutes: 45
        }
      ])

    if (progressError) {
      console.log('⚠️  Progress record error (might already exist):', progressError.message)
    } else {
      console.log('✅ Demo user progress created')
    }

    console.log('\n🎉 Demo user ready!')
    console.log('📧 Email: demo@example.com')
    console.log('🔑 Password: demo123')

  } catch (error) {
    console.error('❌ Error creating demo user:', error.message)
  }
}

createDemoUser()