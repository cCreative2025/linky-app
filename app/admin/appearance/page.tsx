'use client'
import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

const THEMES = [
  { id: 'dark',   label: '다크',   bg: 'linear-gradient(160deg, #0f0f1a 0%, #1a0f2e 50%, #0f0f1a 100%)' },
  { id: 'purple', label: '퍼플',   bg: 'linear-gradient(160deg, #1a0033 0%, #2d0050 50%, #1a0033 100%)' },
  { id: 'ocean',  label: '오션',   bg: 'linear-gradient(160deg, #001a33 0%, #002d50 50%, #001a33 100%)' },
  { id: 'forest', label: '포레스트', bg: 'linear-gradient(160deg, #001a0f 0%, #002d1a 50%, #001a0f 100%)' },
  { id: 'sunset', label: '선셋',   bg: 'linear-gradient(160deg, #1a0a00 0%, #2d1500 50%, #1a0a00 100%)' },
  { id: 'rose',   label: '로즈',   bg: 'linear-gradient(160deg, #1a0010 0%, #2d0020 50%, #1a0010 100%)' },
]

const ACCENT_COLORS = [
  { id: '#7c3aed', label: '퍼플' },
  { id: '#3b82f6', label: '블루' },
  { id: '#ec4899', label: '핑크' },
  { id: '#10b981', label: '그린' },
  { id: '#f59e0b', label: '옐로우' },
  { id: '#ef4444', label: '레드' },
  { id: '#8b5cf6', label: '바이올렛' },
  { id: '#06b6d4', label: '시안' },
]

export default function AppearancePage() {
  const [theme, setTheme] = useState('dark')
  const [accent, setAccent] = useState('#7c3aed')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(data => {
      if (data?.theme) setTheme(data.theme)
      if (data?.accent_color) setAccent(data.accent_color)
      setLoading(false)
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, accent_color: accent }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const currentTheme = THEMES.find(t => t.id === theme)

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-6 h-6 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
    </div>
  )

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-5">테마 설정</h1>

      {/* 미리보기 */}
      <div className="rounded-2xl overflow-hidden mb-6 h-32 flex items-center justify-center"
        style={{ background: currentTheme?.bg, border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full" style={{ background: accent }} />
          <div className="h-2 w-20 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
          <div className="h-1.5 w-14 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>
      </div>

      {/* 배경 테마 */}
      <div className="admin-card p-4 mb-4">
        <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>배경 테마</p>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map(t => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className="relative h-16 rounded-xl overflow-hidden transition-all"
              style={{
                background: t.bg,
                border: `2px solid ${theme === t.id ? accent : 'transparent'}`,
                boxShadow: theme === t.id ? `0 0 12px ${accent}60` : undefined,
              }}>
              <span className="absolute bottom-1.5 left-0 right-0 text-center text-[10px] font-semibold"
                style={{ color: 'rgba(255,255,255,0.8)' }}>
                {t.label}
              </span>
              {theme === t.id && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: accent }}>
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 포인트 컬러 */}
      <div className="admin-card p-4 mb-6">
        <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>포인트 컬러</p>
        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map(c => (
            <button key={c.id} onClick={() => setAccent(c.id)}
              className="flex flex-col items-center gap-1.5 transition-transform"
              style={{ transform: accent === c.id ? 'scale(1.1)' : undefined }}>
              <div className="w-10 h-10 rounded-xl"
                style={{
                  background: c.id,
                  border: `3px solid ${accent === c.id ? 'white' : 'transparent'}`,
                  boxShadow: accent === c.id ? `0 0 12px ${c.id}80` : undefined,
                }} />
              <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
        style={{ background: saved ? 'rgba(34,197,94,0.8)' : 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white' }}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        {saved ? '저장됨!' : '저장하기'}
      </button>
    </div>
  )
}
