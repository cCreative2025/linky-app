'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Link2, User, Palette, BarChart2, LogOut, ExternalLink } from 'lucide-react'

const NAV = [
  { href: '/admin',             label: '링크',   icon: Link2 },
  { href: '/admin/profile',     label: '프로필', icon: User },
  { href: '/admin/appearance',  label: '테마',   icon: Palette },
  { href: '/admin/stats',       label: '통계',   icon: BarChart2 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch('/api/profile').then(res => {
      if (res.status === 401) router.replace('/login')
      else setChecking(false)
    }).catch(() => router.replace('/login'))
  }, [router])

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.replace('/login')
  }

  if (checking) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: '#08080f' }}>
        <div className="spinner" style={{ borderTopColor: '#7c3aed' }} />
      </div>
    )
  }

  return (
    <div className="min-h-dvh" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% -5%, #1a0f3a 0%, #08080f 55%)' }}>

      {/* ── 헤더 ── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 h-[56px]"
        style={{
          background: 'rgba(8,8,15,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <span className="text-[15px] font-bold tracking-tight" style={{ color: '#f0f0ff' }}>
          Linky
          <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(124,58,237,0.25)', color: '#a78bfa' }}>
            Admin
          </span>
        </span>

        <div className="flex items-center gap-2">
          <a
            href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[12px] font-medium transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <ExternalLink className="w-3 h-3" />
            미리보기
          </a>
          <button
            onClick={handleLogout}
            className="btn-icon"
            title="로그아웃"
          >
            <LogOut className="w-[15px] h-[15px]" />
          </button>
        </div>
      </header>

      {/* ── 본문 ── */}
      <main className="max-w-[560px] mx-auto px-5 pt-7 pb-28 fade-in">
        {children}
      </main>

      {/* ── 하단 탭바 ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
        style={{
          background: 'rgba(8,8,15,0.92)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 transition-all"
              style={{ color: active ? '#a78bfa' : 'rgba(255,255,255,0.35)' }}
            >
              <div
                className="flex items-center justify-center w-[34px] h-[28px] rounded-[8px] transition-all"
                style={{ background: active ? 'rgba(124,58,237,0.2)' : 'transparent' }}
              >
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
