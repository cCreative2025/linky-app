'use client'
import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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

const THEMES: Record<string, string> = {
  dark:   'linear-gradient(160deg, #0f0f1a 0%, #1a0f2e 50%, #0f0f1a 100%)',
  purple: 'linear-gradient(160deg, #1a0033 0%, #2d0050 50%, #1a0033 100%)',
  ocean:  'linear-gradient(160deg, #001a33 0%, #002d50 50%, #001a33 100%)',
  forest: 'linear-gradient(160deg, #001a0f 0%, #002d1a 50%, #001a0f 100%)',
  sunset: 'linear-gradient(160deg, #1a0a00 0%, #2d1500 50%, #1a0a00 100%)',
  rose:   'linear-gradient(160deg, #1a0010 0%, #2d0020 50%, #1a0010 100%)',
}

export default function PublicPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [clickingId, setClickingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const [{ data: profileData }, { data: linksData }] = await Promise.all([
        supabase.from('linky_profile').select('*').single(),
        supabase.from('linky_links').select('*').eq('is_active', true).order('order_index'),
      ])
      if (profileData) setProfile(profileData as Profile)
      if (linksData) setLinks(linksData as Link[])
      setLoading(false)
    }
    load()
  }, [])

  async function handleClick(link: Link) {
    setClickingId(link.id)
    supabase.from('linky_links').update({ click_count: link.click_count + 1 }).eq('id', link.id).then(() => {})
    setTimeout(() => {
      window.open(link.url, '_blank', 'noopener,noreferrer')
      setClickingId(null)
    }, 150)
  }

  const bg = THEMES[profile?.theme ?? 'dark']
  const accent = profile?.accent_color ?? '#7c3aed'

  if (loading) {
    return (
      <div style={{ background: THEMES.dark }} className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: bg }}>
      <div className="max-w-[480px] mx-auto px-4 pt-14">

        {/* 프로필 */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-4 shadow-2xl overflow-hidden"
            style={{ background: `${accent}22`, border: `2px solid ${accent}55` }}
          >
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{profile?.avatar_emoji ?? '✨'}</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{profile?.display_name ?? 'My Links'}</h1>
          {profile?.bio && (
            <p className="text-sm text-center leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* 링크 목록 */}
        <div className="flex flex-col gap-3">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => handleClick(link)}
              className="link-card w-full text-left px-5 py-4 flex items-center gap-4"
              style={{
                background: clickingId === link.id ? `${accent}22` : 'rgba(255,255,255,0.07)',
                border: `1px solid ${clickingId === link.id ? accent + '55' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '16px',
                boxShadow: clickingId === link.id ? `0 0 20px ${accent}30` : undefined,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: `${accent}22` }}
              >
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm leading-tight">{link.title}</p>
                {link.description && (
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {link.description}
                  </p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
            </button>
          ))}

          {links.length === 0 && (
            <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <p className="text-4xl mb-3">🔗</p>
              <p className="text-sm">아직 등록된 링크가 없어요</p>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Linky ✦</p>
        </div>
      </div>
    </div>
  )
}
