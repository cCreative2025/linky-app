'use client'
import { useEffect, useState, useCallback } from 'react'
import { Plus, GripVertical, Pencil, Trash2, Eye, EyeOff, X, Check, Link2 } from 'lucide-react'

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

const ICONS = ['🔗','🌐','📱','💬','📸','🎥','🎵','📝','✉️','📞','🏠','⭐','🎯','🚀','💡','🎨','📚','🤖','⛪','🏝️']
const empty = { title: '', url: '', description: '', icon: '🔗', is_active: true }

function Spinner() {
  return <div className="spinner" style={{ width: 16, height: 16, borderTopColor: 'white' }} />
}

export default function AdminLinksPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/links')
    if (res.ok) setLinks(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openAdd() { setEditingId(null); setForm(empty); setShowForm(true) }
  function openEdit(l: Link) {
    setEditingId(l.id)
    setForm({ title: l.title, url: l.url, description: l.description ?? '', icon: l.icon, is_active: l.is_active })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.url.trim()) return
    setSaving(true)
    const url = form.url.startsWith('http') ? form.url : `https://${form.url}`
    const method = editingId ? 'PATCH' : 'POST'
    const body = editingId ? { id: editingId, ...form, url } : { ...form, url }
    await fetch('/api/links', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setSaving(false); setShowForm(false); load()
  }

  async function handleToggle(l: Link) {
    await fetch('/api/links', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: l.id, is_active: !l.is_active }) })
    setLinks(prev => prev.map(x => x.id === l.id ? { ...x, is_active: !x.is_active } : x))
  }

  async function handleDelete(id: string) {
    await fetch('/api/links', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setDeleteId(null); load()
  }

  function onDragStart(id: string) { setDragId(id) }
  function onDragOver(e: React.DragEvent, id: string) {
    e.preventDefault()
    if (dragId === id) return
    const arr = [...links]
    const from = arr.findIndex(l => l.id === dragId)
    const to = arr.findIndex(l => l.id === id)
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    setLinks(arr)
  }
  async function onDragEnd() {
    setDragId(null)
    const reorder = links.map((l, i) => ({ id: l.id, order_index: i }))
    await fetch('/api/links', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reorder }) })
  }

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="spinner" style={{ borderTopColor: '#7c3aed' }} />
    </div>
  )

  return (
    <>
      {/* ── 페이지 헤더 ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold" style={{ color: '#f0f0ff', letterSpacing: '-0.3px' }}>링크 관리</h1>
          <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {links.filter(l => l.is_active).length}개 공개 · 총 {links.length}개
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 text-[13px]"
        >
          <Plus className="w-4 h-4" />
          링크 추가
        </button>
      </div>

      {/* ── 링크 목록 ── */}
      <div className="flex flex-col gap-2">
        {links.map(link => (
          <div
            key={link.id}
            draggable
            onDragStart={() => onDragStart(link.id)}
            onDragOver={e => onDragOver(e, link.id)}
            onDragEnd={onDragEnd}
            className="card flex items-center gap-3 px-4 py-3.5 transition-all"
            style={{ opacity: dragId === link.id ? 0.4 : 1, cursor: 'default' }}
          >
            {/* 드래그 핸들 */}
            <GripVertical
              className="w-4 h-4 shrink-0 cursor-grab active:cursor-grabbing"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            />

            {/* 아이콘 */}
            <div
              className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[18px] shrink-0"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)' }}
            >
              {link.icon}
            </div>

            {/* 텍스트 */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold truncate" style={{ color: link.is_active ? '#f0f0ff' : 'rgba(255,255,255,0.35)' }}>
                {link.title}
              </p>
              <p className="text-[11px] truncate mt-[2px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {link.url}
              </p>
            </div>

            {/* 클릭수 */}
            <span className="text-[11px] font-medium shrink-0" style={{ color: 'rgba(255,255,255,0.25)', minWidth: 20, textAlign: 'right' }}>
              {link.click_count > 0 ? link.click_count : ''}
            </span>

            {/* 액션 버튼 */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleToggle(link)}
                className="btn-icon"
                style={{ color: link.is_active ? '#a78bfa' : 'rgba(255,255,255,0.22)' }}
                title={link.is_active ? '비공개' : '공개'}
              >
                {link.is_active ? <Eye className="w-[15px] h-[15px]" /> : <EyeOff className="w-[15px] h-[15px]" />}
              </button>
              <button onClick={() => openEdit(link)} className="btn-icon" title="수정">
                <Pencil className="w-[14px] h-[14px]" />
              </button>
              <button
                onClick={() => setDeleteId(link.id)}
                className="btn-icon"
                style={{ color: 'rgba(239,68,68,0.65)', borderColor: 'rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.06)' }}
                title="삭제"
              >
                <Trash2 className="w-[14px] h-[14px]" />
              </button>
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <div className="card flex flex-col items-center py-16 gap-3 text-center">
            <Link2 className="w-7 h-7" style={{ color: 'rgba(255,255,255,0.15)' }} />
            <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              링크를 추가해보세요
            </p>
          </div>
        )}
      </div>

      {/* ── 추가/수정 모달 ── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}
        >
          <div
            className="w-full sm:max-w-[420px] sm:mx-4 p-6"
            style={{
              background: '#0e0e1c',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px 24px 0 0',
            }}
            // sm:rounded-[22px] via style below
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[17px] font-bold" style={{ color: '#f0f0ff' }}>
                {editingId ? '링크 수정' : '링크 추가'}
              </h2>
              <button onClick={() => setShowForm(false)} className="btn-icon">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 아이콘 선택 */}
            <p className="text-[11px] font-semibold mb-2.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>아이콘</p>
            <div className="flex flex-wrap gap-2 mb-5 p-3 rounded-[14px]" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {ICONS.map(ic => (
                <button
                  key={ic}
                  onClick={() => setForm(f => ({ ...f, icon: ic }))}
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[18px] transition-all"
                  style={{
                    background: form.icon === ic ? 'rgba(124,58,237,0.3)' : 'transparent',
                    border: `1.5px solid ${form.icon === ic ? 'rgba(124,58,237,0.65)' : 'transparent'}`,
                    transform: form.icon === ic ? 'scale(1.1)' : undefined,
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>

            {/* 폼 필드 */}
            <div className="flex flex-col gap-3 mb-5">
              <input className="inp" placeholder="제목 *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <input className="inp" placeholder="URL * (예: instagram.com/...)" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} inputMode="url" />
              <input className="inp" placeholder="설명 (선택)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

              <label
                className="flex items-center gap-3 px-4 py-3.5 rounded-[14px] cursor-pointer transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  className="w-4 h-4 accent-violet-500"
                />
                <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>공개 표시</span>
              </label>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !form.title || !form.url}
              className="btn-primary w-full py-[14px] text-[14px] flex items-center justify-center gap-2"
            >
              {saving ? <Spinner /> : <Check className="w-4 h-4" />}
              {editingId ? '수정 완료' : '추가하기'}
            </button>
          </div>
        </div>
      )}

      {/* ── 삭제 확인 ── */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}
        >
          <div className="w-full max-w-[300px] p-6 text-center" style={{ background: '#0e0e1c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22 }}>
            <p className="text-[16px] font-bold mb-2" style={{ color: '#f0f0ff' }}>삭제할까요?</p>
            <p className="text-[13px] mb-6" style={{ color: 'rgba(255,255,255,0.42)' }}>되돌릴 수 없어요</p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteId(null)}
                className="btn-ghost flex-1 py-3 text-[13px] font-semibold"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 rounded-[14px] text-[13px] font-bold text-white transition-all"
                style={{ background: 'rgba(220,38,38,0.75)', border: '1px solid rgba(220,38,38,0.4)' }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
