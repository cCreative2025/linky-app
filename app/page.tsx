'use client'
import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getTheme } from '@/lib/themes'

type Profile = {
  display_name: string
  bio: string | null
  avatar_emoji: string
  avatar_url: string | null
  theme: string
  accent_color: string
}

type Link = {
  id: string
  title: string
  url: string
  description: string | null
  icon: string
  is_active: boolean
  order_index: number
  click_count: number
}

export default function PublicPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [clickingId, setClickingId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('linky_profile').select('*').single(),
      supabase.from('linky_links').select('*').eq('is_active', true).order('order_index'),
    ]).then(([{ data: p }, { data: l }]) => {
      if (p) setProfile(p as Profile)
      if (l) setLinks(l as Link[])
      setLoading(false)
    })
  }, [])

  async function handleClick(link: Link) {
    setClickingId(link.id)
    supabase.from('linky_links').update({ click_count: link.click_count + 1 }).eq('id', link.id).then(() => {})
    setTimeout(() => {
      window.open(link.url, '_blank', 'noopener,noreferrer')
      setClickingId(null)
    }, 140)
  }

  const themeId = profile?.theme ?? 'dark'
  const accent  = profile?.accent_color ?? '#7c3aed'
  const t       = getTheme(themeId)

  if (loading) {
    return (
      <div style={{ background: '#08080f' }} className="min-h-dvh flex items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-dvh" style={{ background: t.bg }}>

      {/* 상단 글로우 */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[280px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${accent}15 0%, transparent 70%)`, filter: 'blur(40px)' }}
      />

      <div className="relative max-w-[420px] mx-auto px-5 pt-16 pb-20 fade-in">

        {/* ── 프로필 ── */}
        <div className="flex flex-col items-center text-center mb-10">
          <div
            className="w-[88px] h-[88px] rounded-full flex items-center justify-center text-[44px] mb-5 overflow-hidden"
            style={{
              background: `${accent}18`,
              border: `1.5px solid ${accent}35`,
              boxShadow: `0 0 0 6px ${accent}0e, 0 8px 32px rgba(0,0,0,0.2)`,
            }}
          >
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              profile?.avatar_emoji ?? '✨'
            )}
          </div>

          <h1
            className="text-[22px] font-bold mb-2"
            style={{ color: t.textPrimary, letterSpacing: '-0.3px' }}
          >
            {profile?.display_name ?? 'My Links'}
          </h1>

          {profile?.bio && (
            <p className="text-[14px] leading-relaxed max-w-[280px]" style={{ color: t.textSecondary }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* ── 링크 목록 ── */}
        <div className="flex flex-col gap-[10px]">
          {links.map(link => {
            const active = clickingId === link.id
            return (
              <button
                key={link.id}
                onClick={() => handleClick(link)}
                className="link-card w-full text-left flex items-center gap-4 px-5 py-[18px]"
                style={{
                  background: active ? `${accent}18` : t.cardBg,
                  borderColor: active ? `${accent}50` : t.cardBorder,
                  boxShadow: active ? `0 0 0 1px ${accent}35, 0 8px 24px rgba(0,0,0,0.15)` : undefined,
                }}
              >
                {/* 아이콘 */}
                <div
                  className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center text-[20px] shrink-0"
                  style={{ background: `${accent}18`, border: `1px solid ${accent}25` }}
                >
                  {link.icon}
                </div>

                {/* 텍스트 */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] leading-snug truncate" style={{ color: t.textPrimary }}>
                    {link.title}
                  </p>
                  {link.description && (
                    <p className="text-[12px] mt-[3px] truncate" style={{ color: t.textDim }}>
                      {link.description}
                    </p>
                  )}
                </div>

                <ChevronRight
                  className="w-[16px] h-[16px] shrink-0"
                  style={{ color: active ? accent : t.textDim }}
                />
              </button>
            )
          })}

          {links.length === 0 && (
            <div
              className="flex flex-col items-center py-16 gap-3 rounded-[22px]"
              style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}
            >
              <span className="text-4xl">🔗</span>
              <p className="text-[13px]" style={{ color: t.textDim }}>아직 등록된 링크가 없어요</p>
            </div>
          )}
        </div>

        {/* ── 하단 ── */}
        <p className="text-center text-[11px] mt-12" style={{ color: t.textDim, letterSpacing: '1px' }}>
          LINKY
        </p>
      </div>
    </div>
  )
}
