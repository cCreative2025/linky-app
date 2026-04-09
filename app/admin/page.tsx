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

const ICON_OPTIONS = ['🔗', '🌐', '📱', '💬', '📸', '🎥', '🎵', '📝', '🛒', '✉️', '📞', '🏠', '⭐', '🎯', '🚀', '💡', '🎨', '📚', '🤖', '⛪']

const emptyForm = { title: '', url: '', description: '', icon: '🔗', is_active: true }

export default function AdminLinksPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/links')
    if (res.ok) setLinks(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(link: Link) {
    setEditingId(link.id)
    setForm({ title: link.title, url: link.url, description: link.description ?? '', icon: link.icon, is_active: link.is_active })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.url.trim()) return
    setSaving(true)
    const url = form.url.startsWith('http') ? form.url : `https://${form.url}`
    if (editingId) {
      await fetch('/api/links', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...form, url }) })
    } else {
      await fetch('/api/links', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, url }) })
    }
    setSaving(false)
    setShowForm(false)
    load()
  }

  async function handleToggle(link: Link) {
    await fetch('/api/links', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: link.id, is_active: !link.is_active }) })
    setLinks(prev => prev.map(l => l.id === link.id ? { ...l, is_active: !l.is_active } : l))
  }

  async function handleDelete(id: string) {
    await fetch('/api/links', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setDeleteId(null)
    load()
  }

  // 드래그로 순서 변경
  function handleDragStart(id: string) { setDragId(id) }
  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault()
    if (dragId === id) return
    const reordered = [...links]
    const from = reordered.findIndex(l => l.id === dragId)
    const to = reordered.findIndex(l => l.id === id)
    const [item] = reordered.splice(from, 1)
    reordered.splice(to, 0, item)
    setLinks(reordered)
  }
  async function handleDragEnd() {
    setDragId(null)
    const reorder = links.map((l, i) => ({ id: l.id, order_index: i }))
    await fetch('/api/links', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reorder }) })
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-6 h-6 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-white">링크 관리</h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{links.length}개 등록됨</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', boxShadow: '0 4px 15px rgba(124,58,237,0.4)' }}>
          <Plus className="w-4 h-4" />
          추가
        </button>
      </div>

      {/* 링크 목록 */}
      <div className="flex flex-col gap-3">
        {links.map(link => (
          <div
            key={link.id}
            draggable
            onDragStart={() => handleDragStart(link.id)}
            onDragOver={e => handleDragOver(e, link.id)}
            onDragEnd={handleDragEnd}
            className="admin-card px-4 py-3.5 flex items-center gap-3 transition-all"
            style={{ opacity: dragId === link.id ? 0.5 : 1 }}
          >
            <GripVertical className="w-4 h-4 shrink-0 cursor-grab active:cursor-grabbing" style={{ color: 'rgba(255,255,255,0.25)' }} />
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ background: 'rgba(124,58,237,0.2)' }}>
              {link.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{link.title}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{link.url}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs mr-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{link.click_count}</span>
              <button onClick={() => handleToggle(link)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: link.is_active ? '#a78bfa' : 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)' }}>
                {link.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => openEdit(link)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)' }}>
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteId(link.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: 'rgba(239,68,68,0.7)', background: 'rgba(239,68,68,0.08)' }}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <div className="text-center py-16 admin-card">
            <Link2 className="w-8 h-8 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>링크를 추가해보세요</p>
          </div>
        )}
      </div>

      {/* 링크 추가/수정 모달 */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6"
            style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{editingId ? '링크 수정' : '링크 추가'}</h2>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 아이콘 선택 */}
            <p className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>아이콘</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {ICON_OPTIONS.map(ic => (
                <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all"
                  style={{
                    background: form.icon === ic ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${form.icon === ic ? 'rgba(124,58,237,0.6)' : 'transparent'}`,
                    transform: form.icon === ic ? 'scale(1.1)' : undefined,
                  }}>
                  {ic}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <input
                placeholder="제목 *"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
              />
              <input
                placeholder="URL * (예: instagram.com/...)"
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                inputMode="url"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
              />
              <input
                placeholder="설명 (선택)"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
              />
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                <input type="checkbox" checked={form.is_active}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  className="w-4 h-4 accent-purple-500" />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>공개 표시</span>
              </label>
            </div>

            <button onClick={handleSave} disabled={saving || !form.title || !form.url}
              className="w-full mt-5 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: form.title && form.url ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.08)',
                color: form.title && form.url ? 'white' : 'rgba(255,255,255,0.3)',
              }}>
              {saving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Check className="w-4 h-4" />}
              {editingId ? '수정 완료' : '추가하기'}
            </button>
          </div>
        </div>
      )}

      {/* 삭제 확인 */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-xs rounded-2xl p-6 text-center"
            style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-base font-bold text-white mb-2">링크를 삭제할까요?</p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>삭제 후 되돌릴 수 없어요</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                취소
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(239,68,68,0.8)', color: 'white' }}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
