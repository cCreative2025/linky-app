import { NextRequest, NextResponse } from 'next/server'

function isValidSession(cookie: { value: string } | undefined): boolean {
  if (!cookie?.value) return false
  const expiresAt = new Date(cookie.value).getTime()
  return !isNaN(expiresAt) && expiresAt >= Date.now()
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookie = request.cookies.get('linky_session')

  // /api/auth 는 항상 허용
  if (pathname.startsWith('/api/auth')) return NextResponse.next()

  // /api/* 보호
  if (pathname.startsWith('/api/')) {
    if (!isValidSession(cookie)) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }
  }

  // /admin/* 보호
  if (pathname.startsWith('/admin')) {
    if (!isValidSession(cookie)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
}
