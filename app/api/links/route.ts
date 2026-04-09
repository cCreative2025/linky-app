import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isValidSession } from '@/lib/auth'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function unauthorized() {
  return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
}

// GET: 전체 링크 (관리자용 — 비활성 포함)
export async function GET(request: NextRequest) {
  if (!isValidSession(request.cookies.get('linky_session'))) return unauthorized()
  const sb = getSupabase()
  const { data, error } = await sb.from('links').select('*').order('order_index')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST: 링크 추가
export async function POST(request: NextRequest) {
  if (!isValidSession(request.cookies.get('linky_session'))) return unauthorized()
  const body = await request.json()
  const sb = getSupabase()

  // 현재 최대 order_index 조회
  const { data: existing } = await sb.from('links').select('order_index').order('order_index', { ascending: false }).limit(1)
  const nextOrder = existing && existing.length > 0 ? (existing[0].order_index + 1) : 0

  const { data, error } = await sb.from('links').insert({
    title: body.title,
    url: body.url,
    description: body.description ?? null,
    icon: body.icon ?? '🔗',
    is_active: body.is_active ?? true,
    order_index: nextOrder,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH: 링크 수정 / 순서 일괄 변경
export async function PATCH(request: NextRequest) {
  if (!isValidSession(request.cookies.get('linky_session'))) return unauthorized()
  const body = await request.json()
  const sb = getSupabase()

  // 순서 일괄 업데이트
  if (body.reorder && Array.isArray(body.reorder)) {
    const updates = body.reorder.map((item: { id: string; order_index: number }) =>
      sb.from('links').update({ order_index: item.order_index }).eq('id', item.id)
    )
    await Promise.all(updates)
    return NextResponse.json({ ok: true })
  }

  // 단일 링크 수정
  const { id, ...fields } = body
  const { data, error } = await sb.from('links').update(fields).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE: 링크 삭제
export async function DELETE(request: NextRequest) {
  if (!isValidSession(request.cookies.get('linky_session'))) return unauthorized()
  const { id } = await request.json()
  const sb = getSupabase()
  const { error } = await sb.from('links').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
