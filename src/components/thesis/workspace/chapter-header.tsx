'use client'

import { createElement } from 'react'
import {
  FileText, BookOpen, FlaskConical, BarChart3, MessageSquare, GraduationCap,
  Menu, Loader2, Check, PanelRightOpen, PanelRightClose, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { ChapterData } from '@/types/thesis'
import type { ChapterStructure } from '@/data/chapters-structure'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, BookOpen, FlaskConical, BarChart3, MessageSquare, GraduationCap,
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-400',
  in_progress: 'bg-amber-400',
  submitted: 'bg-sky-400',
  revised: 'bg-emerald-400',
}

interface ColorSet {
  light: string
  text: string
  bg: string
  border: string
}

interface ChapterHeaderProps {
  isMobile: boolean
  onOpenSidebar: () => void
  chapterMeta: ChapterStructure | undefined
  colors: ColorSet
  activeChapter: ChapterData | undefined
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  helpOpen: boolean
  onToggleHelp: () => void
}

export default function ChapterHeader({
  isMobile, onOpenSidebar, chapterMeta, colors, activeChapter, saveStatus, helpOpen, onToggleHelp,
}: ChapterHeaderProps) {
  const isCustom = !chapterMeta
  const Icon = chapterMeta?.icon ? (ICON_MAP[chapterMeta.icon] || FileText) : FileText

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center gap-3 shrink-0 z-20">
      {isMobile && (
        <button onClick={onOpenSidebar} className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
          <Menu className="h-4 w-4" />
        </button>
      )}

      {/* Icon */}
      <div className={cn('p-1.5 rounded-lg flex items-center justify-center', colors.light, colors.text)}>
        {createElement(Icon, { className: 'h-3.5 w-3.5' })}
      </div>

      {/* Title block */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
            {isCustom ? activeChapter?.title || 'Chapitre sans titre' : `Chapitre ${chapterMeta.number}. ${chapterMeta.title}`}
          </h2>
          {isCustom && (
            <Badge variant="outline" className="text-[9px] border-slate-300 text-slate-500 shrink-0">Personnalisé</Badge>
          )}
        </div>
        <p className="text-[10px] sm:text-xs text-slate-500 truncate">
          {isCustom
            ? 'Chapitre personnalisé — structure libre'
            : chapterMeta.description}
        </p>
      </div>

      {/* Status badges */}
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="outline" className="text-[10px] gap-1">
          <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_COLORS[activeChapter?.status || 'draft'])} />
          {activeChapter?.status || 'brouillon'}
        </Badge>
        <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">
          {activeChapter?.wordCount?.toLocaleString() || 0} mots
        </Badge>
        {saveStatus === 'saving' && <Loader2 className="h-3 w-3 text-slate-400 animate-spin" />}
        {saveStatus === 'saved' && <Check className="h-3 w-3 text-emerald-500" />}
      </div>

      {/* Help toggle */}
      <button
        onClick={onToggleHelp}
        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        title={helpOpen ? 'Fermer le panneau' : "Ouvrir l'aide"}
      >
        {helpOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
      </button>
    </header>
  )
}
