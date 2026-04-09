'use client'
import { useEffect, useState } from 'react'
import { BarChart2, TrendingUp, MousePointerClick } from 'lucide-react'

type Link = {
  id: string
  title: string
  icon: string
  click_count: number
  is_active: boolean
}

export default function StatsPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/links').then(r => r.json()).then(data => {
      setLinks((data as Link[]).sort((a, b) => b.click_count - a.click_count))
      setLoading(false)
    })
  }, [])

  const totalClicks = links.reduce((s, l) => s + l.click_count, 0)
  const maxClicks = links[0]?.click_count ?? 1

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-6 h-6 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
    </div>
  )

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-5">통계</h1>

      {/* 총 클릭 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="admin-card p-4 flex flex-col gap-1">
          <MousePointerClick className="w-5 h-5 mb-1" style={{ color: '#a78bfa' }} />
          <p className="text-2xl font-black text-white">{totalClicks}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>총 클릭수</p>
        </div>
        <div className="admin-card p-4 flex flex-col gap-1">
          <TrendingUp className="w-5 h-5 mb-1" style={{ color: '#34d399' }} />
          <p className="text-2xl font-black text-white">{links.filter(l => l.is_active).length}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>활성 링크</p>
        </div>
      </div>

      {/* 링크별 클릭 */}
      <div className="admin-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4" style={{ color: '#a78bfa' }} />
          <p className="text-sm font-semibold text-white">링크별 클릭</p>
        </div>
        <div className="flex flex-col gap-4">
          {links.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: 'rgba(255,255,255,0.3)' }}>아직 데이터가 없어요</p>
          )}
          {links.map((link, i) => (
            <div key={link.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">{link.icon}</span>
                  <span className="text-sm truncate" style={{ color: link.is_active ? 'white' : 'rgba(255,255,255,0.4)' }}>
                    {link.title}
                  </span>
                </div>
                <span className="text-sm font-bold ml-3 shrink-0" style={{ color: i === 0 ? '#a78bfa' : 'rgba(255,255,255,0.6)' }}>
                  {link.click_count}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${maxClicks > 0 ? (link.click_count / maxClicks) * 100 : 0}%`,
                    background: i === 0 ? 'linear-gradient(90deg, #7c3aed, #a855f7)' : 'rgba(167,139,250,0.4)',
                  }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
