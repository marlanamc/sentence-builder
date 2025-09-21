import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { levelId: string } }
) {
  try {
    const supabase = createClient()
    const levelId = parseInt(params.levelId)

    if (!levelId || isNaN(levelId)) {
      return NextResponse.json(
        { error: 'Invalid level ID' },
        { status: 400 }
      )
    }

    // Get rules for specific level
    const { data: rules, error } = await supabase
      .from('grammar_rules')
      .select('*')
      .eq('level_id', levelId)
      .eq('is_active', true)
      .order('priority', { ascending: false })

    if (error) {
      console.error('Error fetching rules for level:', levelId, error)
      return NextResponse.json(
        { error: 'Failed to fetch grammar rules' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: rules || [],
      levelId
    })

  } catch (error) {
    console.error('Error in grammar rules level API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
