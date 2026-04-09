import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { createHash } from 'crypto'

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30일

export function hashPin(pin: string): string {
  return createHash('sha256').update(pin + process.env.PIN_SALT).digest('hex')
}

export function isValidSession(cookie: { value: string } | undefined): boolean {
  if (!cookie?.value) return false
  const expiresAt = new Date(cookie.value).getTime()
  return !isNaN(expiresAt) && expiresAt >= Date.now()
}

export function getSessionExpiry(): string {
  return new Date(Date.now() + SESSION_DURATION).toISOString()
}

export async function requireAuth(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get('linky_session')
  return isValidSession(cookie)
}
