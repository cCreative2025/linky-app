import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function POST(request: NextRequest) {
  const { pin } = await request.json()
  if (!pin || typeof pin !== 'string' || pin.length !== 4) {
    return NextResponse.json({ error: 'INVALID' }, { status: 400 })
  }

  const hash = createHash('sha256').update(pin + (process.env.PIN_SALT ?? '')).digest('hex')
  const expected = process.env.ADMIN_PIN_HASH

  if (!expected || hash !== expected) {
    return NextResponse.json({ error: 'INVALID_PIN' }, { status: 401 })
  }

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  const response = NextResponse.json({ ok: true })
  response.cookies.set('linky_session', expiresAt, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('linky_session')
  return response
}
