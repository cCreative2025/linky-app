'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

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
        setError('PIN이 틀렸어요')
        setPin(['', '', '', ''])
        inputs.current[0]?.focus()
      }
    } catch {
      setError('오류가 발생했어요')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #0f0f1a 0%, #1a0f2e 50%, #0f0f1a 100%)' }}
    >
      <div className="w-full max-w-xs text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)' }}>
          <Lock className="w-7 h-7" style={{ color: '#7c3aed' }} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">관리자 로그인</h1>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>4자리 PIN을 입력하세요</p>

        <div className="flex gap-3 justify-center mb-6">
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
              className="w-14 h-14 text-center text-2xl font-bold rounded-xl outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: `2px solid ${error ? '#ef4444' : v ? '#7c3aed' : 'rgba(255,255,255,0.15)'}`,
                color: 'white',
                caretColor: '#7c3aed',
              }}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error && <p className="text-sm mb-4" style={{ color: '#ef4444' }}>{error}</p>}
        {loading && (
          <div className="flex justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}
