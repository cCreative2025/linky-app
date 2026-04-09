'use client'
import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

const AVATARS = ['✨','👨‍💻','🙏','⛪','🎯','🚀','📖','🎵','🌟','💡','🤖','🔥','🌱','🦋','🎨','👑','🏆','🛠️','🧠','💎']

type Form = { display_name: string; bio: string; avatar_emoji: string; avatar_url: string }

export default function AdminProfilePage() {
  const [form, setForm] = useState<Form>({ display_name: '', bio: '', avatar_emoji: '✨', avatar_url: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(d => {
      if (d) setForm({ display_name: d.display_name ?? '', bio: d.bio ?? '', avatar_emoji: d.avatar_emoji ?? '✨', avatar_url: d.avatar_url ?? '' })
      setLoading(false)
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="spinner" style={{ borderTopColor: '#7c3aed' }} />
    </div>
  )

  return (
    <>
      <h1 className="text-[20px] font-bold mb-6" style={{ color: '#f0f0ff', letterSpacing: '-0.3px' }}>프로필 설정</h1>

      {/* ── 미리보기 ── */}
      <div className="card flex flex-col items-center py-8 mb-6"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 70%)' }}>
        <div
          className="w-[76px] h-[76px] rounded-full flex items-center justify-center text-[38px] mb-4 overflow-hidden"
          style={{ background: 'rgba(124,58,237,0.15)', border: '1.5px solid rgba(124,58,237,0.3)', boxShadow: '0 0 0 5px rgba(124,58,237,0.08)' }}
        >
          {form.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.avatar_url} alt="avatar" className="w-full h-full object-cover" />
          ) : form.avatar_emoji}
        </div>
        <p className="text-[18px] font-bold" style={{ color: '#f0f0ff' }}>{form.display_name || '이름을 입력하세요'}</p>
        <p className="text-[13px] mt-1.5 text-center max-w-[240px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {form.bio || '한 줄 소개를 입력하세요'}
        </p>
      </div>

      {/* ── 아바타 이모지 ── */}
      <div className="card p-5 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>아바타</p>
        <div className="flex flex-wrap gap-2">
          {AVATARS.map(em => (
            <button
              key={em}
              onClick={() => setForm(f => ({ ...f, avatar_emoji: em, avatar_url: '' }))}
              className="w-10 h-10 rounded-[11px] flex items-center justify-center text-[20px] transition-all"
              style={{
                background: form.avatar_emoji === em && !form.avatar_url ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${form.avatar_emoji === em && !form.avatar_url ? 'rgba(124,58,237,0.6)' : 'transparent'}`,
                transform: form.avatar_emoji === em && !form.avatar_url ? 'scale(1.08)' : undefined,
              }}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* ── 폼 필드 ── */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="card p-5">
          <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2.5" style={{ color: 'rgba(255,255,255,0.35)' }}>이름 *</label>
          <input
            value={form.display_name}
            onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
            placeholder="표시될 이름"
            className="w-full bg-transparent text-[14px] outline-none"
            style={{ color: '#f0f0ff' }}
          />
        </div>
        <div className="card p-5">
          <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2.5" style={{ color: 'rgba(255,255,255,0.35)' }}>한 줄 소개</label>
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            placeholder="간단한 소개 문구"
            rows={2}
            className="w-full bg-transparent text-[14px] outline-none resize-none"
            style={{ color: '#f0f0ff' }}
          />
        </div>
        <div className="card p-5">
          <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2.5" style={{ color: 'rgba(255,255,255,0.35)' }}>프로필 이미지 URL (선택)</label>
          <input
            value={form.avatar_url}
            onChange={e => setForm(f => ({ ...f, avatar_url: e.target.value }))}
            placeholder="https://..."
            inputMode="url"
            className="w-full bg-transparent text-[14px] outline-none"
            style={{ color: '#f0f0ff' }}
          />
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
