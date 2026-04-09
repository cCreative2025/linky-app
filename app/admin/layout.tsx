'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Link2, User, Palette, BarChart2, LogOut, ExternalLink } from 'lucide-react'

const NAV = [
  { href: '/admin', label: '링크', icon: Link2 },
  { href: '/admin/profile', label: '프로필', icon: User },
  { href: '/admin/appearance', label: '테마', icon: Palette },
  { href: '/admin/stats', label: '통계', icon: BarChart2 },
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
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #0f0f1a 0%, #1a0f2e 50%, #0f0f1a 100%)' }}>
        <div className="w-6 h-6 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0f0f1a 0%, #1a0f2e 50%, #0f0f1a 100%)' }}>
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 h-14"
        style={{ background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="font-bold text-white text-base">Linky Admin</span>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.06)' }}>
            <ExternalLink className="w-3 h-3" />
            미리보기
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)' }}>
            <LogOut className="w-3 h-3" />
            로그아웃
          </button>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-[600px] mx-auto px-4 pt-6 pb-28">
        {children}
      </main>

      {/* 하단 탭바 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex"
        style={{ background: 'rgba(15,15,26,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors"
              style={{ color: active ? '#a78bfa' : 'rgba(255,255,255,0.4)' }}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
