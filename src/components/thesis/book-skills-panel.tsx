'use client'

import { useState, useMemo } from 'react'
import {
  BookOpen, BookCheck, ChevronDown, ChevronRight, Lightbulb, AlertTriangle, Target, Wrench, Bookmark, GraduationCap, FlaskConical, Cpu, Users,
} from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { RESOURCES, CATEGORY_LABELS, CATEGORY_COLORS } from '@/data/resources'
import { BOOK_SKILLS } from '@/data/book-skills'
import type { Resource } from '@/data/resources'
import { cn } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────
interface BookSkillsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chapterNumber?: string
  activeBookIds: string[]
  onToggleBook: (bookId: string) => void
}

type FilterCategory = Resource['category'] | 'all'

// ─── Constants ──────────────────────────────────────────
const CATEGORY_ICONS: Record<Resource['category'], React.ElementType> = {
  redaction: BookOpen,
  methodologie: FlaskConical,
  ia: Cpu,
  encadrement: Users,
}

const CHAPTER_LABELS: Record<string, string> = {
  I: 'Introduction',
  II: 'Bibliographie',
  III: 'Méthodologie',
  IV: 'Résultats',
  V: 'Discussion',
  VI: 'Conclusion',
  all: 'Tous les chapitres',
}

const FILTER_TABS: { key: FilterCategory; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'redaction', label: 'Rédaction' },
  { key: 'methodologie', label: 'Méthodologie' },
  { key: 'ia', label: 'IA & Académie' },
  { key: 'encadrement', label: 'Encadrement' },
]

// ─── Component ──────────────────────────────────────────
export default function BookSkillsPanel({
  open,
  onOpenChange,
  chapterNumber,
  activeBookIds,
  onToggleBook,
}: BookSkillsPanelProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Merge resources (for metadata) with book skills
  const books = useMemo(() => {
    return RESOURCES.map(r => ({
      resource: r,
      skill: BOOK_SKILLS[r.id],
    })).filter(b => b.skill) // only books with extracted skills
  }, [])

  const filtered = useMemo(() => {
    return books.filter(b => {
      const matchCat = activeFilter === 'all' || b.resource.category === activeFilter
      return matchCat
    })
  }, [books, activeFilter])

  const handleToggleExpand = (bookId: string) => {
    setExpandedId(prev => (prev === bookId ? null : bookId))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[560px] p-0 overflow-hidden bg-slate-50 flex flex-col">
        {/* Sticky header */}
        <div className="shrink-0 bg-white/95 backdrop-blur-sm border-b border-slate-200">
          <SheetHeader className="px-5 pt-5 pb-2">
            <SheetTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-emerald-700" />
              </div>
              Livres-compétences
            </SheetTitle>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Connaissances structurées extraites de chaque ouvrage. Activez les livres que le Directeur IA doit utiliser.
            </p>
          </SheetHeader>

          {/* Active books banner */}
          <div className="px-5 py-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
              <BookCheck className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span className="text-[11px] font-medium text-amber-800">
                {activeBookIds.length} livre{activeBookIds.length > 1 ? 's' : ''} activé{activeBookIds.length > 1 ? 's' : ''} pour le Directeur IA
              </span>
            </div>
          </div>

          {/* Category filter tabs */}
          <div className="px-5 pb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {FILTER_TABS.map(tab => {
              const Icon = tab.key === 'all' ? GraduationCap : CATEGORY_ICONS[tab.key]
              const isActive = activeFilter === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={cn(
                    'shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all',
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Scrollable content */}
        <ScrollArea className="flex-1">
          <div className="px-5 pb-8 space-y-3 pt-3">
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Bookmark className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Aucun livre dans cette catégorie</p>
              </div>
            )}

            {filtered.map(({ resource: r, skill: s }) => {
              const isActive = activeBookIds.includes(r.id)
              const isExpanded = expandedId === r.id
              const isRelevantForChapter = chapterNumber
                && s.relevance.some(rel => rel.chapterType === chapterNumber || rel.chapterType === 'all')

              return (
                <div
                  key={r.id}
                  className={cn(
                    'bg-white rounded-xl border overflow-hidden transition-all',
                    isActive ? 'border-amber-300 shadow-sm' : 'border-slate-200 hover:shadow-md hover:border-slate-300',
                    isRelevantForChapter && 'ring-1 ring-emerald-200',
                  )}
                >
                  {/* Colored top bar */}
                  <div className={cn('h-1 bg-gradient-to-r', r.coverColor)} />

                  {/* Collapsed header */}
                  <div className="p-3.5">
                    <div className="flex items-start gap-3">
                      {/* Left: book info */}
                      <button
                        onClick={() => handleToggleExpand(r.id)}
                        className="flex-1 min-w-0 text-left group"
                      >
                        <div className="flex items-start gap-2">
                          {isExpanded
                            ? <ChevronDown className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                            : <ChevronRight className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                          }
                          <div className="min-w-0">
                            <h3 className="text-[13px] font-bold text-slate-900 leading-snug line-clamp-1">
                              {r.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {r.author} &middot; {r.year}
                            </p>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 italic mt-1.5 ml-[22px] line-clamp-2 leading-relaxed">
                          {s.coreConcept}
                        </p>
                      </button>

                      {/* Right: toggle + badge */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {isActive && (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[9px] px-1.5 py-0">
                            Actif
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            'h-8 w-8 rounded-lg transition-all',
                            isActive
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700',
                          )}
                          onClick={() => onToggleBook(r.id)}
                        >
                          {isActive ? <BookCheck className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Category badge row */}
                    <div className="flex items-center gap-1.5 mt-2.5 ml-[22px]">
                      <Badge variant="outline" className={cn('text-[9px] px-1.5 py-0', CATEGORY_COLORS[r.category])}>
                        {CATEGORY_LABELS[r.category]}
                      </Badge>
                      {isRelevantForChapter && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] px-1.5 py-0">
                          <Target className="h-2.5 w-2.5 mr-0.5" />
                          Pertinent chap. {chapterNumber}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <>
                      <Separator />
                      <div className="p-4 space-y-4 bg-slate-50/50">
                        {/* Concept clé */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                            <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Concept clé</h4>
                          </div>
                          <p className="text-[12px] text-slate-600 leading-relaxed pl-5">{s.coreConcept}</p>
                        </div>

                        {/* Cadres et frameworks */}
                        {s.frameworks.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <Target className="h-3.5 w-3.5 text-emerald-500" />
                              <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Cadres et frameworks</h4>
                            </div>
                            <div className="space-y-2 pl-5">
                              {s.frameworks.map((fw, i) => (
                                <div key={i} className="bg-white rounded-lg border border-slate-200 p-2.5">
                                  <p className="text-[12px] font-semibold text-slate-800">{fw.name}</p>
                                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{fw.description}</p>
                                  <p className="text-[10px] text-emerald-600 mt-1 font-medium">
                                    Quand : {fw.when}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Principes */}
                        {s.principles.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <Lightbulb className="h-3.5 w-3.5 text-emerald-500" />
                              <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Principes</h4>
                            </div>
                            <ul className="space-y-1 pl-5">
                              {s.principles.map((p, i) => (
                                <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
                                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Techniques */}
                        {s.techniques.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <Wrench className="h-3.5 w-3.5 text-blue-500" />
                              <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Techniques</h4>
                            </div>
                            <ol className="space-y-1 pl-5">
                              {s.techniques.map((t, i) => (
                                <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
                                  <span className="mt-0.5 text-[10px] font-bold text-blue-500 shrink-0">{i + 1}.</span>
                                  {t}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Pièges (anti-patterns) */}
                        {s.antiPatterns.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                              <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Pièges</h4>
                            </div>
                            <ul className="space-y-1 pl-5">
                              {s.antiPatterns.map((a, i) => (
                                <li key={i} className="flex items-start gap-2 text-[11px] text-rose-700/80 leading-relaxed">
                                  <AlertTriangle className="h-3 w-3 mt-0.5 text-rose-400 shrink-0" />
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Pertinence chapitres */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Bookmark className="h-3.5 w-3.5 text-violet-500" />
                            <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Pertinence</h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pl-5">
                            {s.relevance.map((rel, i) => (
                              <div
                                key={i}
                                className={cn(
                                  'text-[10px] px-2 py-1 rounded-md border',
                                  rel.chapterType === 'all'
                                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                                    : chapterNumber === rel.chapterType
                                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200 font-semibold'
                                      : 'bg-violet-50 text-violet-700 border-violet-200',
                                )}
                                title={rel.reason}
                              >
                                {rel.chapterType === 'all' ? 'Tous les chapitres' : `Chap. ${rel.chapterType}`}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Aide-mémoire */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Bookmark className="h-3.5 w-3.5 text-amber-500" />
                            <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Aide-mémoire</h4>
                          </div>
                          <div className="ml-5 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-[11px] text-amber-900 leading-relaxed font-medium">{s.quickReference}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
