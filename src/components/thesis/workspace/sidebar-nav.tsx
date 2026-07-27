'use client'

import { useState } from 'react'
import {
  GraduationCap, FileText, X, Library, BookOpen, Download, Search,
  Scale, Cloud, Newspaper, FlaskConical, BarChart3, MessageSquare,
  Plus, ChevronUp, ChevronDown, Trash2, Pencil, Check, Layers, FolderOpen, LayoutTemplate,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
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

interface SidebarNavProps {
  thesis: ThesisData
  activeChapterId: string
  onSelectChapter: (id: string) => void
  sidebarOpen: boolean
  onCloseSidebar: () => void
  isMobile: boolean
  totalWords: number
  onOpenRefs: () => void
  onOpenResources: () => void
  onOpenExport: () => void
  onOpenLiterature: () => void
  onOpenBalance: () => void
  onOpenCloudDrive: () => void
  onOpenJournalFinder: () => void
  // Chapter management
  onAddChapter: (insertAfterOrder: number, partId?: string) => void
  onDeleteChapter: (chapterId: string) => void
  onReorderChapter: (chapterId: string, direction: 'up' | 'down') => void
  onRenameChapter: (chapterId: string, newTitle: string) => void
  // Parts management
  onAddPart: () => void
  onDeletePart: (partId: string) => void
  onRenamePart: (partId: string, newTitle: string) => void
  onReorderPart: (partId: string, direction: 'up' | 'down') => void
  // Structure mode
  onSwitchMode: (mode: 'chapters' | 'parts') => void
  // Template
  onOpenTemplates: () => void
}

// ─── Chapter Row (shared for flat & parts mode) ──────────
function ChapterRow({
  ch, idx, total, isActive, meta, isPartsMode,
  onSelect, onEdit, onDelete, onReorder, onAddAfter,
}: {
  ch: ChapterData; idx: number; total: number
  isActive: boolean; meta: ReturnType<typeof CHAPTERS.find>
  isPartsMode: boolean
  onSelect: () => void
  onEdit: (id: string, title: string) => void
  onDelete: (id: string) => void
  onReorder: (id: string, dir: 'up' | 'down') => void
  onAddAfter: (id: string, order: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [confirmDel, setConfirmDel] = useState(false)
  const Icon = (meta?.icon && ICON_MAP[meta.icon]) || FileText
  const isCustom = !meta

  const startEdit = () => { setEditing(true); setEditTitle(ch.title) }
  const confirmEdit = () => { if (editTitle.trim()) onEdit(ch.id, editTitle.trim()); setEditing(false) }
  const handleDel = () => {
    if (confirmDel) { onDelete(ch.id); setConfirmDel(false) }
    else { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000) }
  }

  return (
    <div className="group relative">
      <button
        onClick={onSelect}
        className={cn(
          'w-full p-2.5 flex items-start gap-2.5 rounded-xl text-left transition-all duration-200 relative overflow-hidden',
          isActive
            ? 'bg-gradient-to-r from-emerald-900/80 to-slate-900 text-white border border-emerald-500/40'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent',
        )}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
          isActive ? 'bg-emerald-500/20' : 'bg-slate-800 group-hover:bg-slate-700',
        )}>
          <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400')} />
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') confirmEdit(); if (e.key === 'Escape') setEditing(false) }}
                onClick={(e) => e.stopPropagation()} autoFocus
                className="text-[11px] font-semibold bg-slate-700 text-white rounded px-1.5 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button onClick={(e) => { e.stopPropagation(); confirmEdit() }} className="p-0.5 text-emerald-400"><Check className="h-3 w-3" /></button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className={cn('text-[10px] font-bold', isActive ? 'text-emerald-400' : 'text-slate-600')}>{ch.number}</span>
                <span className={cn('text-[11px] font-semibold leading-tight truncate', isActive && 'text-white')}>{ch.title}</span>
                {isCustom && <span className="text-[8px] bg-slate-700 text-slate-400 px-1 rounded shrink-0">custom</span>}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={cn('h-1.5 w-1.5 rounded-full', STATUS_COLORS[ch.status] || STATUS_COLORS.draft)} />
                <span className="text-[9px] text-slate-600">{ch.wordCount.toLocaleString()} mots</span>
              </div>
            </>
          )}
        </div>
      </button>
      {/* Action buttons */}
      <div className={cn(
        'absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10',
        isActive && 'opacity-100',
      )}>
        <button onClick={(e) => { e.stopPropagation(); startEdit() }} className="p-1 text-slate-500 hover:text-amber-400 hover:bg-slate-700/80 rounded" title="Renommer"><Pencil className="h-3 w-3" /></button>
        {idx > 0 && <button onClick={(e) => { e.stopPropagation(); onReorder(ch.id, 'up') }} className="p-1 text-slate-500 hover:text-sky-400 hover:bg-slate-700/80 rounded" title="Monter"><ChevronUp className="h-3 w-3" /></button>}
        {idx < total - 1 && <button onClick={(e) => { e.stopPropagation(); onReorder(ch.id, 'down') }} className="p-1 text-slate-500 hover:text-sky-400 hover:bg-slate-700/80 rounded" title="Descendre"><ChevronDown className="h-3 w-3" /></button>}
        <button onClick={(e) => { e.stopPropagation(); onAddAfter(ch.id, ch.order) }} className="p-1 text-slate-500 hover:text-emerald-400 hover:bg-slate-700/80 rounded" title="Ajouter après"><Plus className="h-3 w-3" /></button>
        <button onClick={(e) => { e.stopPropagation(); handleDel() }} className={cn('p-1 rounded',
          confirmDel ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20 animate-pulse' : 'text-slate-500 hover:text-red-400 hover:bg-slate-700/80',
        )} title={confirmDel ? 'Confirmer' : 'Supprimer'}><Trash2 className="h-3 w-3" /></button>
      </div>
    </div>
  )
}

// ─── Part Header ──────────────────────────────────────────
function PartHeader({
  part, chaptersInPart, activeChapterId,
  isCollapsed, onToggle,
  onRenamePart, onDeletePart, onReorderPart,
  onSelectChapter, onAddChapter, onDeleteChapter, onReorderChapter, onRenameChapter,
  isOnly, isLast,
}: {
  part: PartData; chaptersInPart: ChapterData[]; activeChapterId: string
  isCollapsed: boolean; onToggle: () => void
  onRenamePart: (id: string, t: string) => void; onDeletePart: (id: string) => void
  onReorderPart: (id: string, dir: 'up' | 'down') => void
  onSelectChapter: (id: string) => void
  onAddChapter: (order: number, partId?: string) => void
  onDeleteChapter: (id: string) => void
  onReorderChapter: (id: string, dir: 'up' | 'down') => void
  onRenameChapter: (id: string, t: string) => void
  isOnly: boolean; isLast: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [confirmDel, setConfirmDel] = useState(false)

  const startRename = () => { setEditing(true); setTitle(part.title) }
  const confirm = () => { if (title.trim()) onRenamePart(part.id, title.trim()); setEditing(false) }
  const handleDel = () => {
    if (confirmDel) { onDeletePart(part.id); setConfirmDel(false) }
    else { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000) }
  }

  const partWords = chaptersInPart.reduce((s, c) => s + c.wordCount, 0)

  return (
    <div className="group/part">
      <div className="flex items-center gap-1 px-1 py-1">
        <button onClick={onToggle} className="p-0.5 text-slate-500 hover:text-emerald-400 transition-colors shrink-0">
          <FolderOpen className={cn('h-3.5 w-3.5 transition-transform', isCollapsed && '-rotate-90')} />
        </button>
        {editing ? (
          <div className="flex-1 flex items-center gap-1">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') confirm(); if (e.key === 'Escape') setEditing(false) }}
              autoFocus className="text-[10px] font-bold bg-slate-700 text-white rounded px-1 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            <button onClick={confirm} className="p-0.5 text-emerald-400"><Check className="h-2.5 w-2.5" /></button>
          </div>
        ) : (
          <span className="flex-1 text-[10px] font-bold uppercase tracking-wider text-emerald-500 truncate">{part.title}</span>
        )}
        <span className="text-[8px] text-slate-600 tabular-nums">{partWords.toLocaleString()}m</span>
        {/* Part actions on hover */}
        <div className="flex items-center gap-0 opacity-0 group-hover/part:opacity-100 transition-opacity">
          <button onClick={startRename} className="p-0.5 text-slate-600 hover:text-amber-400 rounded" title="Renommer"><Pencil className="h-2.5 w-2.5" /></button>
          <button onClick={() => onReorderPart(part.id, 'up')} className={cn('p-0.5 text-slate-600 hover:text-sky-400 rounded', isOnly && 'invisible')} title="Monter"><ChevronUp className="h-2.5 w-2.5" /></button>
          <button onClick={() => onReorderPart(part.id, 'down')} className={cn('p-0.5 text-slate-600 hover:text-sky-400 rounded', isLast && 'invisible')} title="Descendre"><ChevronDown className="h-2.5 w-2.5" /></button>
          <button onClick={() => onAddChapter(chaptersInPart.length > 0 ? Math.max(...chaptersInPart.map(c => c.order)) : 0, part.id)} className="p-0.5 text-slate-600 hover:text-emerald-400 rounded" title="Ajouter chapitre"><Plus className="h-2.5 w-2.5" /></button>
          <button onClick={handleDel} className={cn('p-0.5 rounded',
            confirmDel ? 'text-red-400 animate-pulse' : 'text-slate-600 hover:text-red-400'
          )} title={confirmDel ? 'Confirmer suppression' : 'Supprimer partie'}><Trash2 className="h-2.5 w-2.5" /></button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="space-y-0.5 ml-2 pl-2 border-l border-slate-800">
          {chaptersInPart.map((ch, idx) => {
            const meta = CHAPTERS.find(m => m.order === ch.order)
            return (
              <ChapterRow
                key={ch.id} ch={ch} idx={idx} total={chaptersInPart.length}
                isActive={ch.id === activeChapterId}
                meta={meta}
                isPartsMode={true}
                onSelect={() => onSelectChapter(ch.id)}
                onEdit={onRenameChapter}
                onDelete={onDeleteChapter}
                onReorder={onReorderChapter}
                onAddAfter={(_id, order) => onAddChapter(order, part.id)}
              />
            )
          })}
          {chaptersInPart.length === 0 && (
            <p className="text-[9px] text-slate-600 italic pl-2 py-1">Aucun chapitre</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Sidebar ────────────────────────────────────────
export default function SidebarNav({
  thesis, activeChapterId, onSelectChapter, sidebarOpen, onCloseSidebar, isMobile, totalWords,
  onOpenRefs, onOpenResources, onOpenExport, onOpenLiterature, onOpenBalance, onOpenCloudDrive, onOpenJournalFinder,
  onAddChapter, onDeleteChapter, onReorderChapter, onRenameChapter,
  onAddPart, onDeletePart, onRenamePart, onReorderPart,
  onSwitchMode, onOpenTemplates,
}: SidebarNavProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [collapsedParts, setCollapsedParts] = useState<Set<string>>(new Set())
  const isPartsMode = thesis.structureMode === 'parts'

  const togglePartCollapse = (partId: string) => {
    setCollapsedParts(prev => {
      const next = new Set(prev)
      if (next.has(partId)) { next.delete(partId) } else { next.add(partId) }
      return next
    })
  }

  // Group chapters by part (or flat list)
  const chaptersByPart = isPartsMode
    ? thesis.parts.map(part => ({
        part,
        chapters: thesis.chapters.filter(c => c.partId === part.id).sort((a, b) => a.order - b.order),
      }))
    : [{ part: null, chapters: thesis.chapters }]

  // Unassigned chapters in parts mode
  const unassignedChapters = isPartsMode
    ? thesis.chapters.filter(c => !c.partId)
    : []

  const handleChapterSelect = (id: string) => { onSelectChapter(id); onCloseSidebar() }
  const handleChapterEdit = (id: string, newTitle: string) => { onRenameChapter(id, newTitle); setEditingId(null) }
  const handleChapterDel = (id: string) => {
    if (confirmDeleteId === id) { onDeleteChapter(id); setConfirmDeleteId(null) }
    else { setConfirmDeleteId(id); setTimeout(() => setConfirmDeleteId(null), 3000) }
  }

  return (
    <aside className={cn(
      'bg-slate-900 border-r border-slate-800 flex flex-col z-40 shrink-0 transition-all duration-300 shadow-2xl',
      'w-64',
      isMobile && !sidebarOpen && 'fixed -translate-x-full',
      isMobile && sidebarOpen && 'fixed translate-x-0',
      !isMobile && 'relative',
    )}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 py-4 mb-2">
        <img src="/logo.png" alt="ThesisFrame" className="w-9 h-9 rounded-xl object-contain shrink-0 shadow-[0_0_16px_rgba(16,185,129,0.2)]" />
        <div className="overflow-hidden">
          <h1 className="font-bold text-sm text-white tracking-tight leading-tight">ThesisFrame</h1>
          <p className="text-[10px] text-emerald-400 font-medium truncate">{thesis.title}</p>
        </div>
        {isMobile && <button onClick={onCloseSidebar} className="ml-auto text-slate-400 hover:text-white p-1"><X className="h-4 w-4" /></button>}
      </div>

      {/* Progress */}
      <div className="px-3 pb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-500 font-medium">PROGRESSION</span>
          <span className="text-[10px] text-emerald-400 font-bold">{totalWords.toLocaleString()} mots</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (totalWords / 80000) * 100)}%` }} />
        </div>
      </div>

      <Separator className="bg-slate-800" />

      {/* Chapters header with mode toggle and template button */}
      <div className="px-3 pt-2 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Structure</span>
          <button
            onClick={() => onSwitchMode(isPartsMode ? 'chapters' : 'parts')}
            className="p-0.5 text-slate-600 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
            title={isPartsMode ? 'Passer en mode chapitres (plat)' : 'Passer en mode parties'}
          >
            <Layers className="h-3 w-3" />
          </button>
          {isPartsMode && (
            <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-medium">Parties</span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onOpenTemplates}
            className="p-0.5 text-slate-600 hover:text-violet-400 hover:bg-slate-800 rounded transition-colors"
            title="Modèles de structure"
          >
            <LayoutTemplate className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => isPartsMode ? onAddPart() : onAddChapter(thesis.chapters.length > 0 ? Math.max(...thesis.chapters.map(c => c.order)) : 0)}
            className="p-0.5 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
            title={isPartsMode ? 'Ajouter une partie' : 'Ajouter un chapitre'}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Chapters list */}
      <nav className="flex-1 overflow-y-auto space-y-1 px-2 min-h-0">
        {chaptersByPart.map(({ part, chapters }) => {
          if (isPartsMode && part) {
            return (
              <PartHeader
                key={part.id} part={part} chaptersInPart={chapters} activeChapterId={activeChapterId}
                isCollapsed={collapsedParts.has(part.id)}
                onToggle={() => togglePartCollapse(part.id)}
                onRenamePart={onRenamePart} onDeletePart={onDeletePart}
                onReorderPart={onReorderPart}
                onSelectChapter={handleChapterSelect}
                onAddChapter={onAddChapter}
                onDeleteChapter={onDeleteChapter}
                onReorderChapter={onReorderChapter}
                onRenameChapter={onRenameChapter}
                isOnly={thesis.parts.length <= 1} isLast={part.order === Math.max(...thesis.parts.map(p => p.order))}
              />
            )
          }
          // Flat mode
          return (
            <div key="flat">
              {chapters.map((ch, idx) => {
                const meta = CHAPTERS.find(m => m.order === ch.order)
                const isActive = ch.id === activeChapterId
                const isEditing = editingId === ch.id
                const isConfirmingDel = confirmDeleteId === ch.id
                const Icon = (meta?.icon && ICON_MAP[meta.icon]) || FileText
                const isCustom = !meta
                return (
                  <div key={ch.id} className="group relative">
                    <button
                      onClick={() => handleChapterSelect(ch.id)}
                      className={cn(
                        'w-full p-2.5 flex items-start gap-2.5 rounded-xl text-left transition-all duration-200 relative overflow-hidden',
                        isActive ? 'bg-gradient-to-r from-emerald-900/80 to-slate-900 text-white border border-emerald-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent',
                      )}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                        isActive ? 'bg-emerald-500/20' : 'bg-slate-800 group-hover:bg-slate-700',
                      )}>
                        <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') { if (editTitle.trim()) onRenameChapter(ch.id, editTitle.trim()); setEditingId(null) } if (e.key === 'Escape') setEditingId(null) }}
                              onClick={(e) => e.stopPropagation()} autoFocus
                              className="text-[11px] font-semibold bg-slate-700 text-white rounded px-1.5 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <button onClick={(e) => { e.stopPropagation(); if (editTitle.trim()) onRenameChapter(ch.id, editTitle.trim()); setEditingId(null) }} className="p-0.5 text-emerald-400"><Check className="h-3 w-3" /></button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1.5">
                              <span className={cn('text-[10px] font-bold', isActive ? 'text-emerald-400' : 'text-slate-600')}>{ch.number}</span>
                              <span className={cn('text-[11px] font-semibold leading-tight truncate', isActive && 'text-white')}>{ch.title}</span>
                              {isCustom && <span className="text-[8px] bg-slate-700 text-slate-400 px-1 rounded shrink-0">custom</span>}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className={cn('h-1.5 w-1.5 rounded-full', STATUS_COLORS[ch.status] || STATUS_COLORS.draft)} />
                              <span className="text-[9px] text-slate-600">{ch.wordCount.toLocaleString()} mots</span>
                            </div>
                          </>
                        )}
                      </div>
                    </button>
                    <div className={cn('absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10', isActive && 'opacity-100')}>
                      <button onClick={(e) => { e.stopPropagation(); setEditingId(ch.id); setEditTitle(ch.title) }} className="p-1 text-slate-500 hover:text-amber-400 hover:bg-slate-700/80 rounded" title="Renommer"><Pencil className="h-3 w-3" /></button>
                      {idx > 0 && <button onClick={(e) => { e.stopPropagation(); onReorderChapter(ch.id, 'up') }} className="p-1 text-slate-500 hover:text-sky-400 hover:bg-slate-700/80 rounded" title="Monter"><ChevronUp className="h-3 w-3" /></button>}
                      {idx < thesis.chapters.length - 1 && <button onClick={(e) => { e.stopPropagation(); onReorderChapter(ch.id, 'down') }} className="p-1 text-slate-500 hover:text-sky-400 hover:bg-slate-700/80 rounded" title="Descendre"><ChevronDown className="h-3 w-3" /></button>}
                      <button onClick={(e) => { e.stopPropagation(); onAddChapter(ch.order) }} className="p-1 text-slate-500 hover:text-emerald-400 hover:bg-slate-700/80 rounded" title="Ajouter après"><Plus className="h-3 w-3" /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleChapterDel(ch.id) }} className={cn('p-1 rounded',
                        isConfirmingDel ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20 animate-pulse' : 'text-slate-500 hover:text-red-400 hover:bg-slate-700/80',
                      )} title={isConfirmingDel ? 'Confirmer' : 'Supprimer'}><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
        {/* Unassigned chapters in parts mode */}
        {isPartsMode && unassignedChapters.length > 0 && (
          <div className="mt-2">
            <div className="px-1 py-1"><span className="text-[9px] text-slate-600 uppercase tracking-wider">Non assignés</span></div>
            {unassignedChapters.map(ch => {
              const isActive = ch.id === activeChapterId
              return (
                <button key={ch.id} onClick={() => handleChapterSelect(ch.id)}
                  className={cn('w-full p-2 pl-4 flex items-center gap-2 rounded-lg text-left text-[11px] transition-all',
                    isActive ? 'text-white bg-emerald-900/60' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60',
                  )}>
                  <FileText className="h-3 w-3 shrink-0" />
                  <span className="truncate">{ch.title}</span>
                </button>
              )
            })}
          </div>
        )}
      </nav>

      <Separator className="bg-slate-800" />

      {/* Tools */}
      <div className="shrink-0 px-3 pt-2 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Outils</span>
      </div>
      <div className="shrink-0 px-2 pb-3 space-y-0.5">
        <button onClick={onOpenRefs} className="w-full p-2 flex items-center gap-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-xs">
          <Library className="h-3.5 w-3.5" /><span>Références biblio.</span>
        </button>
        <button onClick={onOpenResources} className="w-full p-2 flex items-center gap-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-xs">
          <BookOpen className="h-3.5 w-3.5" /><span>Guide rédaction</span>
        </button>
        <button onClick={onOpenExport} className="w-full p-2 flex items-center gap-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-xs">
          <Download className="h-3.5 w-3.5" /><span>Export PDF</span>
        </button>
        <button onClick={onOpenLiterature} className="w-full p-2 flex items-center gap-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-xs">
          <Search className="h-3.5 w-3.5" /><span>Recherche litt.</span>
        </button>
        <button onClick={onOpenBalance} className="w-full p-2 flex items-center gap-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-xs">
          <Scale className="h-3.5 w-3.5" /><span>Équilibre chapitres</span>
        </button>
        <button onClick={onOpenCloudDrive} className="w-full p-2 flex items-center gap-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-xs">
          <Cloud className="h-3.5 w-3.5" /><span>Sauvegarde cloud</span>
        </button>
        <button onClick={onOpenJournalFinder} className="w-full p-2 flex items-center gap-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-xs">
          <Newspaper className="h-3.5 w-3.5" /><span>Journaux OA</span>
        </button>
      </div>

      {/* User */}
      <div className="shrink-0 p-3 border-t border-slate-800">
        <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-[10px] ring-2 ring-emerald-500/30 shrink-0">DR</div>
          <div className="overflow-hidden flex-1">
            <div className="text-[10px] font-medium text-slate-200 truncate">{thesis.author}</div>
            <div className="text-[9px] text-slate-500 truncate">{thesis.university}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
