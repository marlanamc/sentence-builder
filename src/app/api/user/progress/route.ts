import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user progress from Supabase
    const { data: userProgress, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user progress:', error)

      // If no progress exists, create default progress
      if (error.code === 'PGRST116') {
        const { data: newProgress, error: createError } = await supabase
          .from('user_progress')
          .insert([
            {
              user_id: userId,
              total_xp: 0,
              current_streak: 0,
              longest_streak: 0,
              total_questions_answered: 0,
              correct_answers: 0,
              current_level: 1,
              unlocked_categories: ['present-basics'],
              achievements: [],
              study_time_minutes: 0
            }
          ])
          .select()
          .single()

        if (createError) {
          return NextResponse.json({ error: 'Failed to create user progress' }, { status: 500 })
        }

        return NextResponse.json(newProgress)
      }

      return NextResponse.json({ error: 'Failed to fetch user progress' }, { status: 500 })
    }

    return NextResponse.json(userProgress)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, updates } = await request.json()

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('user_progress')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user progress:', error)
      return NextResponse.json({ error: 'Failed to update user progress' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}