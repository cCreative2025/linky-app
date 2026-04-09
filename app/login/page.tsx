'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  function handleChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return
    const next = [...pin]
    next[i] = val
    setPin(next)
    setError('')
    if (val && i < 3) inputs.current[i + 1]?.focus()
    if (next.every(v => v)) submitPin(next.join(''))
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !pin[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  async function submitPin(pinStr: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinStr }),
      })
      if (res.ok) {
        router.push('/admin')
      } else {
        setError('PIN이 올바르지 않아요')
        setPin(['', '', '', ''])
        setTimeout(() => inputs.current[0]?.focus(), 50)
      }
    } catch {
      setError('오류가 발생했어요. 다시 시도해주세요')
    } finally {
      setLoading(false)
    }
  }

  const filled = pin.filter(v => v).length

  return (
    <div
      className="min-h-dvh flex items-center justify-center px-5"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, #1a0f3a 0%, #08080f 60%)' }}
    >
      {/* 글로우 */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #7c3aed20 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      <div className="relative w-full max-w-[320px] text-center fade-in">
        {/* 로고 */}
        <div
          className="w-14 h-14 rounded-[16px] flex items-center justify-center mx-auto mb-8"
          style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}
        >
          <span className="text-2xl">🔗</span>
        </div>

        <h1 className="text-[22px] font-bold mb-1.5" style={{ color: '#f0f0ff' }}>Linky</h1>
        <p className="text-[14px] mb-10" style={{ color: 'rgba(255,255,255,0.42)' }}>4자리 PIN을 입력하세요</p>

        {/* PIN 입력 */}
        <div className="flex gap-3 justify-center mb-5">
          {pin.map((v, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={v}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              autoFocus={i === 0}
              style={{
                width: 60, height: 64,
                textAlign: 'center',
                fontSize: 26,
                fontWeight: 700,
                background: 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${error ? 'rgba(239,68,68,0.6)' : v ? 'rgba(124,58,237,0.7)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 14,
                color: '#f0f0ff',
                outline: 'none',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                boxShadow: v ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none',
              }}
            />
          ))}
        </div>

        {/* 진행 표시 */}
        <div className="flex gap-1.5 justify-center mb-6">
          {[0,1,2,3].map(i => (
            <div
              key={i}
              style={{
                width: i < filled ? 20 : 6, height: 4,
                borderRadius: 2,
                background: i < filled ? '#7c3aed' : 'rgba(255,255,255,0.12)',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </div>

        {/* 에러 */}
        {error && (
          <p className="text-[13px] mb-3" style={{ color: 'rgba(239,68,68,0.85)' }}>{error}</p>
        )}

        {/* 로딩 */}
        {loading && (
          <div className="flex justify-center mt-2">
            <div className="spinner" style={{ borderTopColor: '#7c3aed' }} />
          </div>
        )}
      </div>
    </div>
  )
}
