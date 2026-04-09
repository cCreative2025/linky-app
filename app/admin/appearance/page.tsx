'use client'
import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { THEMES, getTheme } from '@/lib/themes'

const ACCENTS = [
  { id: '#7c3aed', label: '퍼플'    },
  { id: '#3b82f6', label: '블루'    },
  { id: '#ec4899', label: '핑크'    },
  { id: '#10b981', label: '그린'    },
  { id: '#f59e0b', label: '옐로'    },
  { id: '#ef4444', label: '레드'    },
  { id: '#8b5cf6', label: '바이올렛' },
  { id: '#06b6d4', label: '시안'    },
  { id: '#f97316', label: '오렌지'  },
  { id: '#14b8a6', label: '틸'      },
  { id: '#a855f7', label: '라벤더'  },
  { id: '#1d4ed8', label: '네이비'  },
]

export default function AppearancePage() {
  const [theme, setTheme] = useState('dark')
  const [accent, setAccent] = useState('#7c3aed')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(d => {
      if (d?.theme) setTheme(d.theme)
      if (d?.accent_color) setAccent(d.accent_color)
      setLoading(false)
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    await fetch('/api/profile', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, accent_color: accent }),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const current = getTheme(theme)
  const isLight = current.light

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="spinner" style={{ borderTopColor: '#7c3aed' }} />
    </div>
  )

  return (
    <>
      <h1 className="text-[20px] font-bold mb-6" style={{ color: '#f0f0ff', letterSpacing: '-0.3px' }}>테마 설정</h1>

      {/* ── 미리보기 ── */}
      <div
        className="relative overflow-hidden rounded-[18px] mb-6 h-[130px] flex items-center justify-center"
        style={{ background: current.bg, border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}` }}
      >
        <div className="flex flex-col items-center gap-2.5">
          {/* 아바타 */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: `${accent}25`, border: `1.5px solid ${accent}50` }}>
            ✨
          </div>
          {/* 이름/소개 바 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-2 w-20 rounded-full" style={{ background: isLight ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.25)' }} />
            <div className="h-1.5 w-14 rounded-full" style={{ background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)' }} />
          </div>
          {/* 미니 링크 카드 */}
          <div className="h-7 w-40 rounded-[8px] flex items-center px-2.5 gap-2"
            style={{ background: current.cardBg, border: `1px solid ${current.cardBorder}` }}>
            <div className="w-3.5 h-3.5 rounded-[4px]" style={{ background: `${accent}40` }} />
            <div className="h-1.5 flex-1 rounded-full" style={{ background: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)' }} />
          </div>
        </div>
      </div>

      {/* ── 배경 테마 — 다크 ── */}
      <div className="card p-5 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
          🌙 다크 테마
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {THEMES.filter(t => !t.light).map(t => (
            <ThemeButton key={t.id} t={t} active={theme === t.id} accent={accent} onClick={() => setTheme(t.id)} />
          ))}
        </div>
      </div>

      {/* ── 배경 테마 — 라이트 ── */}
      <div className="card p-5 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
          ☀️ 라이트 테마
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {THEMES.filter(t => t.light).map(t => (
            <ThemeButton key={t.id} t={t} active={theme === t.id} accent={accent} onClick={() => setTheme(t.id)} />
          ))}
        </div>
      </div>

      {/* ── 포인트 컬러 ── */}
      <div className="card p-5 mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>포인트 컬러</p>
        <div className="grid grid-cols-4 gap-3">
          {ACCENTS.map(c => (
            <button
              key={c.id}
              onClick={() => setAccent(c.id)}
              className="flex flex-col items-center gap-2 transition-transform"
              style={{ transform: accent === c.id ? 'scale(1.06)' : undefined }}
            >
              <div
                className="w-full h-10 rounded-[12px] transition-all"
                style={{
                  background: c.id,
                  border: `2.5px solid ${accent === c.id ? 'rgba(255,255,255,0.75)' : 'transparent'}`,
                  boxShadow: accent === c.id ? `0 0 14px ${c.id}70` : undefined,
                }}
              />
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.38)' }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary w-full py-[14px] text-[14px] flex items-center justify-center gap-2"
        style={saved ? { background: 'rgba(34,197,94,0.75)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' } : undefined}
      >
        {saving ? <div className="spinner" style={{ width: 16, height: 16, borderTopColor: 'white' }} /> : <Check className="w-4 h-4" />}
        {saved ? '저장됐어요!' : '저장하기'}
      </button>
    </>
  )
}

function ThemeButton({ t, active, accent, onClick }: {
  t: { id: string; label: string; emoji: string; bg: string; light: boolean }
  active: boolean; accent: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="relative h-[68px] rounded-[14px] overflow-hidden transition-all"
      style={{
        background: t.bg,
        border: `2px solid ${active ? accent : t.light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: active ? `0 0 16px ${accent}50` : undefined,
      }}
    >
      <span className="absolute top-2.5 left-0 right-0 text-center text-base leading-none">{t.emoji}</span>
      <span
        className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-semibold"
        style={{ color: t.light ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.75)' }}
      >
        {t.label}
      </span>
      {active && (
        <div className="absolute top-2 right-2 w-[14px] h-[14px] rounded-full flex items-center justify-center"
          style={{ background: accent }}>
          <Check className="w-2 h-2 text-white" />
        </div>
      )}
    </button>
  )
}
