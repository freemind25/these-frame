'use client'

import {
  GraduationCap, FileText, X, Library, BookOpen, Download, Search,
  Scale, Cloud, Newspaper, FlaskConical, BarChart3, MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { CHAPTERS, CHAPTER_COLORS } from '@/data/chapters-structure'
import type { ThesisData } from '@/types/thesis'

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
}

export default function SidebarNav({
  thesis, activeChapterId, onSelectChapter, sidebarOpen, onCloseSidebar, isMobile, totalWords,
  onOpenRefs, onOpenResources, onOpenExport, onOpenLiterature, onOpenBalance, onOpenCloudDrive, onOpenJournalFinder,
}: SidebarNavProps) {
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
          <p className="text-[10px] text-emerald-400 font-medium">{thesis.title}</p>
        </div>
        {isMobile && (
          <button onClick={onCloseSidebar} className="ml-auto text-slate-400 hover:text-white p-1"><X className="h-4 w-4" /></button>
        )}
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

      {/* Chapters list */}
      <div className="px-3 pt-2 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Chapitres</span>
      </div>
      <nav className="flex-1 overflow-y-auto space-y-0.5 px-2 min-h-0">
        {thesis.chapters.map((ch) => {
          const meta = CHAPTERS.find(m => m.order === ch.order)
          const isActive = ch.id === activeChapterId
          const Icon = (meta?.icon && ICON_MAP[meta.icon]) || FileText
          const chColors = meta ? CHAPTER_COLORS[meta.color] : CHAPTER_COLORS.emerald
          return (
            <button
              key={ch.id}
              onClick={() => { onSelectChapter(ch.id); onCloseSidebar() }}
              className={cn(
                'w-full p-2.5 flex items-start gap-2.5 rounded-xl text-left transition-all duration-200 group relative overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-emerald-900/80 to-slate-900 text-white border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent',
              )}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                isActive ? chColors.bg.replace('bg-', 'bg-').replace('/500', '/500/20') : 'bg-slate-800 group-hover:bg-slate-700',
              )}>
                <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400')} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={cn('text-[10px] font-bold', isActive ? 'text-emerald-400' : 'text-slate-600')}>{ch.number}</span>
                  <span className={cn('text-[11px] font-semibold leading-tight truncate', isActive && 'text-white')}>{ch.title}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={cn('h-1.5 w-1.5 rounded-full', STATUS_COLORS[ch.status] || STATUS_COLORS.draft)} />
                  <span className="text-[9px] text-slate-600">{ch.wordCount.toLocaleString()} mots</span>
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      <Separator className="bg-slate-800" />

      {/* Tools — always visible, never shrunk */}
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
