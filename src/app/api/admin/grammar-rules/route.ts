import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/grammar-rules - Fetch all grammar rules
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get all active grammar rules with level information
    const { data: rules, error } = await supabase
      .from('grammar_rules')
      .select(`
        *,
        grammar_levels (
          id,
          name,
          short_description,
          category_id
        )
      `)
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .order('created_at')

    if (error) {
      console.error('Error fetching grammar rules:', error)
      return NextResponse.json(
        { error: 'Failed to fetch grammar rules' },
        { status: 500 }
      )
    }

    // Group rules by level for easier frontend consumption
    const rulesByLevel = rules?.reduce((acc: any, rule: any) => {
      const levelId = rule.level_id
      if (!acc[levelId]) {
        acc[levelId] = {
          level: rule.grammar_levels,
          rules: []
        }
      }
      acc[levelId].rules.push({
        id: rule.id,
        rule_type: rule.rule_type,
        rule_name: rule.rule_name,
        conditions: rule.conditions,
        validation_logic: rule.validation_logic,
        error_messages: rule.error_messages,
        examples: rule.examples,
        priority: rule.priority
      })
      return acc
    }, {}) || {}

    return NextResponse.json({
      success: true,
      data: rulesByLevel,
      count: rules?.length || 0
    })

  } catch (error) {
    console.error('Error in grammar rules API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/grammar-rules - Create new grammar rule
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { level_id, rule_type, rule_name, conditions, validation_logic, error_messages, examples, priority = 1 } = body

    if (!level_id || !rule_type || !rule_name || !conditions || !validation_logic || !error_messages) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('grammar_rules')
      .insert([{
        level_id,
        rule_type,
        rule_name,
        conditions,
        validation_logic,
        error_messages,
        examples,
        priority,
        is_active: true
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating grammar rule:', error)
      return NextResponse.json(
        { error: 'Failed to create grammar rule' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Error in grammar rules POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
