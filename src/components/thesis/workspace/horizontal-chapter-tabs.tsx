'use client'

import { useState, useRef, useEffect } from 'react'
import {
  FileText, BookOpen, FlaskConical, BarChart3, MessageSquare, GraduationCap,
  Plus, ChevronUp, ChevronDown, Trash2, Pencil, Check, FolderOpen, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHAPTERS, CHAPTER_COLORS } from '@/data/chapters-structure'
import type { ThesisData, PartData, ChapterData } from '@/types/thesis'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, BookOpen, FlaskConical, BarChart3, MessageSquare, GraduationCap,
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-400',
  in_progress: 'bg-amber-400',
  submitted: 'bg-sky-400',
  revised: 'bg-emerald-400',
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'brouillon',
  in_progress: 'en cours',
  submitted: 'soumis',
  revised: 'révisé',
}

interface HorizontalChapterTabsProps {
  thesis: ThesisData
  activeChapterId: string
  onSelectChapter: (id: string) => void
  // Chapter management
  onAddChapter: (insertAfterOrder: number, partId?: string) => void
  onDeleteChapter: (chapterId: string) => void
  onReorderChapter: (chapterId: string, direction: 'up' | 'down') => void
  onRenameChapter: (chapterId: string, newTitle: string) => void
  // Part management
  onAddPart: () => void
  onDeletePart: (partId: string) => void
  onRenamePart: (partId: string, newTitle: string) => void
}

// ─── Chapter Tab (flat mode) ─────────────────────────────
function ChapterTab({
  ch, idx, total, isActive, meta,
  onSelect, onEdit, onDelete, onReorder,
}: {
  ch: ChapterData; idx: number; total: number
  isActive: boolean; meta: ReturnType<typeof CHAPTERS.find>
  onSelect: () => void
  onEdit: (id: string, title: string) => void
  onDelete: (id: string) => void
  onReorder: (id: string, dir: 'up' | 'down') => void
}) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [confirmDel, setConfirmDel] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const Icon = (meta?.icon && ICON_MAP[meta.icon]) || FileText
  const isCustom = !meta
  const color = meta ? (CHAPTER_COLORS[meta.color] || CHAPTER_COLORS.emerald) : CHAPTER_COLORS.emerald

  // Close menu on click outside
  useEffect(() => {
    if (!showMenu) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showMenu])

  const startEdit = () => { setEditing(true); setEditTitle(ch.title); setShowMenu(false) }
  const confirmEdit = () => { if (editTitle.trim()) onEdit(ch.id, editTitle.trim()); setEditing(false) }
  const handleDel = () => {
    if (confirmDel) { onDelete(ch.id); setConfirmDel(false); setShowMenu(false) }
    else { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000) }
  }

  return (
    <div className="relative shrink-0 group/tab">
      {editing ? (
        <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white border-2 border-emerald-400 shadow-lg">
          <input
            type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') confirmEdit(); if (e.key === 'Escape') setEditing(false) }}
            onClick={(e) => e.stopPropagation()} autoFocus
            className="text-xs font-medium bg-transparent text-slate-900 w-28 sm:w-36 focus:outline-none"
            placeholder="Titre du chapitre"
          />
          <button onClick={confirmEdit} className="p-0.5 text-emerald-600 hover:bg-emerald-50 rounded"><Check className="h-3.5 w-3.5" /></button>
          <button onClick={() => setEditing(false)} className="p-0.5 text-slate-400 hover:bg-slate-100 rounded"><X className="h-3 w-3" /></button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          data-active={isActive}
          onClick={onSelect}
          onKeyDown={(e) => { if (e.key === 'Enter') onSelect() }}
          className={cn(
            'relative flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-200 border cursor-pointer',
            isActive
              ? `${color.bg} text-white border-transparent shadow-sm min-w-[140px]`
              : `bg-white ${color.text} ${color.border} hover:${color.light} min-w-[120px]`,
          )}
        >
          {/* Chapter number + icon */}
          <div className={cn(
            'w-6 h-6 rounded-md flex items-center justify-center shrink-0',
            isActive ? 'bg-white/20' : color.light,
          )}>
            <Icon className={cn('h-3 w-3', isActive ? 'text-white' : color.text)} />
          </div>

          {/* Title + status */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={cn('text-[10px] font-bold', isActive ? 'text-white/70' : 'text-slate-400')}>
                {ch.number}
              </span>
              <span className={cn('text-xs font-semibold leading-tight truncate', isActive && 'text-white')}>
                {meta?.shortTitle || ch.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={cn('h-1.5 w-1.5 rounded-full', STATUS_COLORS[ch.status] || STATUS_COLORS.draft)} />
              <span className={cn('text-[9px] tabular-nums', isActive ? 'text-white/70' : 'text-slate-400')}>
                {ch.wordCount.toLocaleString()}m
              </span>
              {isCustom && !isActive && <span className="text-[7px] bg-slate-100 text-slate-400 px-1 rounded">+</span>}
            </div>
          </div>

          {/* Active indicator dot */}
          {isActive && (
            <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-current opacity-60" />
          )}

          {/* Context menu button */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
            className={cn(
              'absolute -right-1 -top-1 p-0.5 rounded-full shadow-sm border transition-all z-10',
              showMenu
                ? 'bg-white border-slate-300 text-slate-700'
                : 'opacity-0 group-hover/tab:opacity-100 bg-white border-slate-200 text-slate-400 hover:text-slate-600',
              isActive && 'text-white/80 border-white/30 hover:bg-white/20 hover:text-white',
            )}
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {/* Context menu dropdown */}
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute top-full right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={startEdit}
                className="w-full px-3 py-2 flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <Pencil className="h-3 w-3 text-slate-400" /> Renommer
              </button>
              {idx > 0 && (
                <button
                  onClick={() => { onReorder(ch.id, 'up'); setShowMenu(false) }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <ChevronUp className="h-3 w-3 text-slate-400" /> Monter
                </button>
              )}
              {idx < total - 1 && (
                <button
                  onClick={() => { onReorder(ch.id, 'down'); setShowMenu(false) }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <ChevronDown className="h-3 w-3 text-slate-400" /> Descendre
                </button>
              )}
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={handleDel}
                className={cn(
                  'w-full px-3 py-2 flex items-center gap-2.5 text-xs transition-colors',
                  confirmDel ? 'text-red-600 bg-red-50' : 'text-red-500 hover:text-red-700 hover:bg-red-50',
                )}
              >
                <Trash2 className="h-3 w-3" /> {confirmDel ? 'Confirmer la suppression' : 'Supprimer'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Part Group (horizontal mode) ───────────────────────
function PartGroup({
  part, chapters, activeChapterId,
  onRenamePart, onDeletePart, onSelectChapter,
  onAddChapter, onDeleteChapter, onReorderChapter, onRenameChapter,
}: {
  part: PartData; chapters: ChapterData[]; activeChapterId: string
  onRenamePart: (id: string, t: string) => void; onDeletePart: (id: string) => void
  onSelectChapter: (id: string) => void
  onAddChapter: (order: number, partId?: string) => void
  onDeleteChapter: (id: string) => void
  onReorderChapter: (id: string, dir: 'up' | 'down') => void
  onRenameChapter: (id: string, t: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [showPartMenu, setShowPartMenu] = useState(false)
  const partMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showPartMenu) return
    function handleClick(e: MouseEvent) {
      if (partMenuRef.current && !partMenuRef.current.contains(e.target as Node)) setShowPartMenu(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showPartMenu])

  return (
    <div className="flex items-center gap-1 shrink-0">
      <div className="relative">
        <button
          onClick={() => setShowPartMenu(!showPartMenu)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200 hover:bg-emerald-100 transition-colors"
        >
          <FolderOpen className="h-3 w-3" />
          {editing ? (
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { if (title.trim()) onRenamePart(part.id, title.trim()); setEditing(false) }; if (e.key === 'Escape') setEditing(false) }}
              onClick={(e) => e.stopPropagation()} autoFocus
              className="text-[10px] font-bold bg-white rounded px-1 py-0 w-20 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          ) : (
            <span className="max-w-[100px] truncate">{part.title}</span>
          )}
        </button>
        {showPartMenu && (
          <div ref={partMenuRef} className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
            <button onClick={() => { setEditing(true); setTitle(part.title); setShowPartMenu(false) }} className="w-full px-3 py-2 flex items-center gap-2 text-xs text-slate-600 hover:bg-slate-50">
              <Pencil className="h-3 w-3" /> Renommer
            </button>
            <button onClick={() => { onAddChapter(chapters.length > 0 ? Math.max(...chapters.map(c => c.order)) : 0, part.id); setShowPartMenu(false) }} className="w-full px-3 py-2 flex items-center gap-2 text-xs text-slate-600 hover:bg-slate-50">
              <Plus className="h-3 w-3" /> Ajouter chapitre
            </button>
            <div className="border-t border-slate-100" />
            <button onClick={() => { onDeletePart(part.id); setShowPartMenu(false) }} className="w-full px-3 py-2 flex items-center gap-2 text-xs text-red-500 hover:bg-red-50">
              <Trash2 className="h-3 w-3" /> Supprimer partie
            </button>
          </div>
        )}
      </div>
      <div className="w-px h-6 bg-slate-200" />
      <div className="flex items-center gap-1.5">
        {chapters.map((ch, idx) => {
          const meta = CHAPTERS.find(m => m.order === ch.order)
          return (
            <ChapterTab
              key={ch.id} ch={ch} idx={idx} total={chapters.length}
              isActive={ch.id === activeChapterId} meta={meta}
              onSelect={() => onSelectChapter(ch.id)}
              onEdit={onRenameChapter}
              onDelete={onDeleteChapter}
              onReorder={onReorderChapter}
            />
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────
export default function HorizontalChapterTabs({
  thesis, activeChapterId, onSelectChapter,
  onAddChapter, onDeleteChapter, onReorderChapter, onRenameChapter,
  onAddPart, onDeletePart, onRenamePart,
}: HorizontalChapterTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isPartsMode = thesis.structureMode === 'parts'

  // Auto-scroll to active chapter
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const activeEl = container.querySelector('[data-active="true"]')
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeChapterId])

  // Group chapters by part
  const chaptersByPart = isPartsMode
    ? thesis.parts.map(part => ({
        part,
        chapters: thesis.chapters.filter(c => c.partId === part.id).sort((a, b) => a.order - b.order),
      }))
    : [{ part: null, chapters: [...thesis.chapters].sort((a, b) => a.order - b.order) }]

  const unassignedChapters = isPartsMode
    ? thesis.chapters.filter(c => !c.partId).sort((a, b) => a.order - b.order)
    : []

  const sortedChapters = [...thesis.chapters].sort((a, b) => a.order - b.order)
  const lastOrder = sortedChapters.length > 0 ? Math.max(...sortedChapters.map(c => c.order)) : 0

  return (
    <nav className="bg-white border-b border-slate-200 shrink-0 z-20">
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto scrollbar-thin"
        style={{ scrollbarWidth: 'thin' }}
      >
        {chaptersByPart.map(({ part, chapters }) => {
          if (isPartsMode && part) {
            return (
              <PartGroup
                key={part.id}
                part={part} chapters={chapters} activeChapterId={activeChapterId}
                onRenamePart={onRenamePart} onDeletePart={onDeletePart}
                onSelectChapter={onSelectChapter}
                onAddChapter={onAddChapter}
                onDeleteChapter={onDeleteChapter}
                onReorderChapter={onReorderChapter}
                onRenameChapter={onRenameChapter}
              />
            )
          }
          // Flat mode
          return (
            <div key="flat" className="flex items-center gap-1.5">
              {chapters.map((ch, idx) => {
                const meta = CHAPTERS.find(m => m.order === ch.order)
                return (
                  <ChapterTab
                    key={ch.id}
                    ch={ch} idx={idx} total={chapters.length}
                    isActive={ch.id === activeChapterId}
                    meta={meta}
                    onSelect={() => onSelectChapter(ch.id)}
                    onEdit={onRenameChapter}
                    onDelete={onDeleteChapter}
                    onReorder={onReorderChapter}
                  />
                )
              })}
            </div>
          )
        })}

        {/* Unassigned chapters in parts mode */}
        {isPartsMode && unassignedChapters.length > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <div className="w-px h-6 bg-slate-200" />
            <span className="text-[9px] text-slate-400 uppercase tracking-wider shrink-0">Non assignés</span>
            {unassignedChapters.map((ch, idx) => {
              const meta = CHAPTERS.find(m => m.order === ch.order)
              return (
                <ChapterTab
                  key={ch.id}
                  ch={ch} idx={idx} total={unassignedChapters.length}
                  isActive={ch.id === activeChapterId}
                  meta={meta}
                  onSelect={() => onSelectChapter(ch.id)}
                  onEdit={onRenameChapter}
                  onDelete={onDeleteChapter}
                  onReorder={onReorderChapter}
                />
              )
            })}
          </div>
        )}

        {/* Add chapter / part button */}
        {isPartsMode ? (
          <button
            onClick={onAddPart}
            className="shrink-0 p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-dashed border-slate-300 hover:border-emerald-400"
            title="Ajouter une partie"
          >
            <Plus className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => onAddChapter(lastOrder)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-dashed border-slate-300 hover:border-emerald-400 text-xs font-medium"
            title="Ajouter un chapitre"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Chapitre</span>
          </button>
        )}
      </div>
    </nav>
  )
}
