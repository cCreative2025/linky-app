'use client'
import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

const AVATAR_OPTIONS = ['✨', '👨‍💻', '🙏', '⛪', '🎯', '🚀', '📖', '🎵', '🌟', '💡', '🤖', '🔥', '🌱', '🦋', '🎨']

type ProfileForm = {
  display_name: string
  bio: string
  avatar_emoji: string
  avatar_url: string
}

export default function AdminProfilePage() {
  const [form, setForm] = useState<ProfileForm>({ display_name: '', bio: '', avatar_emoji: '✨', avatar_url: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(data => {
      if (data) setForm({
        display_name: data.display_name ?? '',
        bio: data.bio ?? '',
        avatar_emoji: data.avatar_emoji ?? '✨',
        avatar_url: data.avatar_url ?? '',
      })
      setLoading(false)
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-6 h-6 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
    </div>
  )

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-5">프로필 설정</h1>

      {/* 미리보기 */}
      <div className="admin-card p-6 flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3"
          style={{ background: 'rgba(124,58,237,0.2)', border: '2px solid rgba(124,58,237,0.4)' }}>
          {form.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
          ) : form.avatar_emoji}
        </div>
        <p className="font-bold text-white text-lg">{form.display_name || '이름을 입력하세요'}</p>
        <p className="text-sm text-center mt-1 max-w-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {form.bio || '한 줄 소개를 입력하세요'}
        </p>
      </div>

      {/* 아바타 이모지 */}
      <div className="admin-card p-4 mb-4">
        <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>아바타 이모지</p>
        <div className="flex flex-wrap gap-2">
          {AVATAR_OPTIONS.map(em => (
            <button key={em} onClick={() => setForm(f => ({ ...f, avatar_emoji: em, avatar_url: '' }))}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all"
              style={{
                background: form.avatar_emoji === em && !form.avatar_url ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${form.avatar_emoji === em && !form.avatar_url ? 'rgba(124,58,237,0.6)' : 'transparent'}`,
                transform: form.avatar_emoji === em ? 'scale(1.1)' : undefined,
              }}>
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* 폼 */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="admin-card p-4">
          <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.5)' }}>이름 *</label>
          <input
            value={form.display_name}
            onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
            placeholder="표시될 이름"
            className="w-full bg-transparent text-white text-sm outline-none"
            style={{ color: 'white' }}
          />
        </div>
        <div className="admin-card p-4">
          <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.5)' }}>한 줄 소개</label>
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            placeholder="간단한 소개 문구"
            rows={2}
            className="w-full bg-transparent text-sm outline-none resize-none"
            style={{ color: 'white' }}
          />
        </div>
        <div className="admin-card p-4">
          <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.5)' }}>프로필 이미지 URL (선택)</label>
          <input
            value={form.avatar_url}
            onChange={e => setForm(f => ({ ...f, avatar_url: e.target.value }))}
            placeholder="https://..."
            inputMode="url"
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: 'white' }}
          />
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
