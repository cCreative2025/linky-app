'use client'
import { useEffect, useState } from 'react'
import { MousePointerClick, Link2, TrendingUp } from 'lucide-react'

type Link = { id: string; title: string; icon: string; click_count: number; is_active: boolean }

export default function StatsPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/links').then(r => r.json()).then((d: Link[]) => {
      setLinks(d.sort((a, b) => b.click_count - a.click_count))
      setLoading(false)
    })
  }, [])

  const total = links.reduce((s, l) => s + l.click_count, 0)
  const active = links.filter(l => l.is_active).length
  const max = links[0]?.click_count || 1

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="spinner" style={{ borderTopColor: '#7c3aed' }} />
    </div>
  )

  return (
    <>
      <h1 className="text-[20px] font-bold mb-6" style={{ color: '#f0f0ff', letterSpacing: '-0.3px' }}>통계</h1>

      {/* ── 요약 카드 ── */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)' }}>
            <MousePointerClick className="w-[18px] h-[18px]" style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <p className="text-[28px] font-black" style={{ color: '#f0f0ff', letterSpacing: '-1px' }}>{total}</p>
            <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>총 클릭수</p>
          </div>
        </div>
        <div className="card p-5 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)' }}>
            <Link2 className="w-[18px] h-[18px]" style={{ color: '#34d399' }} />
          </div>
          <div>
            <p className="text-[28px] font-black" style={{ color: '#f0f0ff', letterSpacing: '-1px' }}>{active}</p>
            <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>활성 링크</p>
          </div>
        </div>
      </div>

      {/* ── 링크별 클릭 ── */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4" style={{ color: '#a78bfa' }} />
          <p className="text-[13px] font-semibold" style={{ color: '#f0f0ff' }}>링크별 클릭수</p>
        </div>

        {links.length === 0 ? (
          <p className="text-[13px] text-center py-8" style={{ color: 'rgba(255,255,255,0.28)' }}>
            아직 클릭 데이터가 없어요
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {links.map((link, i) => (
              <div key={link.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[16px] shrink-0">{link.icon}</span>
                    <span
                      className="text-[13px] font-medium truncate"
                      style={{ color: link.is_active ? '#f0f0ff' : 'rgba(255,255,255,0.35)' }}
                    >
                      {link.title}
                    </span>
                  </div>
                  <span
                    className="text-[13px] font-bold shrink-0 ml-3"
                    style={{ color: i === 0 ? '#a78bfa' : 'rgba(255,255,255,0.45)' }}
                  >
                    {link.click_count}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(link.click_count / max) * 100}%`,
                      background: i === 0
                        ? 'linear-gradient(90deg, #6d28d9, #a78bfa)'
                        : 'rgba(167,139,250,0.35)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
