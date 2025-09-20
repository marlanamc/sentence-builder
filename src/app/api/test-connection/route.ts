import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple environment check first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        connected: false,
        error: 'Missing Supabase environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey
        }
      }, { status: 400 });
    }

    // Try to import and create Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Simple connection test
    const { data, error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      return NextResponse.json({
        connected: false,
        error: 'Database connection failed',
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      connected: true,
      message: 'Supabase connection successful',
      tables_accessible: true
    });

  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}