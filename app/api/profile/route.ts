import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isValidSession } from '@/lib/auth'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: NextRequest) {
  if (!isValidSession(request.cookies.get('linky_session'))) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  }
  const sb = getSupabase()
  const { data, error } = await sb.from('profile').select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest) {
  if (!isValidSession(request.cookies.get('linky_session'))) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  }
  const body = await request.json()
  const sb = getSupabase()

  // upsert (profile은 row 1개)
  const { data, error } = await sb.from('profile').upsert({
    id: '00000000-0000-0000-0000-000000000001',
    ...body,
    updated_at: new Date().toISOString(),
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
