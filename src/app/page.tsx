'use client'

import { createElement, useState } from 'react'
import {
  BookOpen,
  FileText,
  GraduationCap,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  BookMarked,
  ClipboardList,
  Send,
  FlaskConical,
  BarChart3,
  MessageSquare,
  Layout,
  Type,
  ArrowRight,
  XCircle,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  writingSteps,
  sectionGuides,
  referenceArticles,
  submissionChecklist,
  commonMistakes,
} from '@/data/articles-guide'

// ─── Icon map ─────────────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
  ClipboardList,
  Layout,
  Type,
  BookOpen,
  FlaskConical,
  BarChart3,
  MessageSquare,
  CheckCircle2,
  BookMarked,
  Send,
  FileText,
  GraduationCap,
}

function getIcon(name: string): LucideIcon {
  return iconMap[name] || FileText
}

// ─── ThesisPlanTab ────────────────────────────────────────────────
interface Chapter {
  id: string
  title: string
  words: number
  pages: number
  notes: string
  expanded: boolean
}

const DEFAULT_CHAPTERS: Chapter[] = [
  { id: 'cover', title: 'Page de couverture', words: 0, pages: 1, notes: '', expanded: false },
  { id: 'ack', title: 'Remerciements', words: 0, pages: 1, notes: '', expanded: false },
  { id: 'abstract', title: 'Résumé (Français / Anglais)', words: 0, pages: 2, notes: '', expanded: false },
  { id: 'intro', title: 'Introduction générale', words: 0, pages: 0, notes: '', expanded: false },
  { id: 'lit', title: 'Revue de la littérature (Chapitre I)', words: 0, pages: 0, notes: '', expanded: false },
  { id: 'context', title: 'Contexte et cadre méthodologique (Chapitre II)', words: 0, pages: 0, notes: '', expanded: false },
  { id: 'results', title: 'Résultats et analyse (Chapitre III)', words: 0, pages: 0, notes: '', expanded: false },
  { id: 'discussion', title: 'Discussion (Chapitre IV)', words: 0, pages: 0, notes: '', expanded: false },
  { id: 'conclusion', title: 'Conclusion générale', words: 0, pages: 0, notes: '', expanded: false },
  { id: 'biblio', title: 'Références bibliographiques', words: 0, pages: 0, notes: '', expanded: false },
  { id: 'annexes', title: 'Annexes', words: 0, pages: 0, notes: '', expanded: false },
]

function ThesisPlanTab() {
  const [chapters, setChapters] = useState<Chapter[]>(DEFAULT_CHAPTERS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<'words' | 'pages' | 'title' | 'notes' | null>(null)
  const [editValue, setEditValue] = useState('')

  const totalWords = chapters.reduce((a, c) => a + c.words, 0)
  const totalPages = chapters.reduce((a, c) => a + c.pages, 0)
  const startedCount = chapters.filter(c => c.words > 0 || c.pages > 0).length

  function startEdit(id: string, field: 'words' | 'pages' | 'title' | 'notes', currentValue: string | number) {
    setEditingId(id)
    setEditingField(field)
    setEditValue(String(currentValue))
  }

  function commitEdit() {
    if (!editingId || !editingField) return
    setChapters(prev =>
      prev.map(ch => {
        if (ch.id !== editingId) return ch
        const val = editingField === 'title' || editingField === 'notes'
          ? editValue
          : Math.max(0, parseInt(editValue) || 0)
        return { ...ch, [editingField]: val }
      })
    )
    setEditingId(null)
    setEditingField(null)
    setEditValue('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingField(null)
    setEditValue('')
  }

  function toggleExpand(id: string) {
    setChapters(prev => prev.map(ch => ch.id === id ? { ...ch, expanded: !ch.expanded } : ch))
  }

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Mots rédigés</CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {totalWords.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mt-1">
              {startedCount} / {chapters.length} chapitres commencés
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pages estimées</CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {totalPages}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mt-1">
              ≈ {totalWords > 0 ? Math.round(totalWords / 250) : '—'} pages (base 250 mots/page)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Structure IMRaD</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-emerald-600" />
              11 chapitres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Squelette IMRaD — Université Constantine 3
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chapter list */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Chapitres de la thèse</CardTitle>
              <CardDescription className="mt-1">
                Cliquez sur les valeurs pour les modifier — la longueur est libre
              </CardDescription>
            </div>
            <p className="text-xs text-muted-foreground shrink-0 text-right leading-relaxed">
              Cliquez sur <strong>titre</strong>, <strong>mots</strong> ou <strong>pages</strong> pour éditer.&#10;
              Entrée pour valider, Échap pour annuler.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {chapters.map((ch) => {
              const isEditingThis = editingId === ch.id
              const isStarted = ch.words > 0 || ch.pages > 0
              return (
                <div key={ch.id} className={`rounded-lg border transition-colors ${isStarted ? 'border-emerald-200 bg-emerald-50/30' : 'hover:bg-muted/50'}`}>
                  {/* Main row */}
                  <div
                    className="flex items-center gap-3 p-3 cursor-pointer select-none"
                    onClick={() => toggleExpand(ch.id)}
                    onKeyDown={(e) => e.key === 'Enter' && toggleExpand(ch.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <ChevronRight className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${ch.expanded ? 'rotate-90' : ''}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {isEditingThis && editingField === 'title' ? (
                          <input
                            className="font-medium text-sm bg-white border rounded px-2 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') commitEdit()
                              if (e.key === 'Escape') cancelEdit()
                              e.stopPropagation()
                            }}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="font-medium text-sm truncate">{ch.title}</span>
                        )}
                        {isStarted && (
                          <Badge variant="secondary" className="text-xs shrink-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                            En cours
                          </Badge>
                        )}
                      </div>
                    </div>
                    {/* Words */}
                    <div
                      className="shrink-0 text-right min-w-[90px]"
                      onClick={(e) => { e.stopPropagation(); startEdit(ch.id, 'words', ch.words) }}
                    >
                      {isEditingThis && editingField === 'words' ? (
                        <input
                          className="text-xs bg-white border rounded px-1.5 py-0.5 w-full text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit()
                            if (e.key === 'Escape') cancelEdit()
                            e.stopPropagation()
                          }}
                          autoFocus
                        />
                      ) : (
                        <span className={`text-xs tabular-nums ${ch.words > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                          {ch.words > 0 ? `${ch.words.toLocaleString()} mots` : '— mots'}
                        </span>
                      )}
                    </div>
                    {/* Pages */}
                    <div
                      className="shrink-0 text-right min-w-[70px]"
                      onClick={(e) => { e.stopPropagation(); startEdit(ch.id, 'pages', ch.pages) }}
                    >
                      {isEditingThis && editingField === 'pages' ? (
                        <input
                          className="text-xs bg-white border rounded px-1.5 py-0.5 w-full text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit()
                            if (e.key === 'Escape') cancelEdit()
                            e.stopPropagation()
                          }}
                          autoFocus
                        />
                      ) : (
                        <span className={`text-xs tabular-nums ${ch.pages > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                          {ch.pages > 0 ? `${ch.pages} p.` : '— p.'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded section */}
                  {ch.expanded && (
                    <div className="px-3 pb-3 pl-10 space-y-3">
                      <div className="h-px bg-border" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Edit words */}
                        <div
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                          onClick={() => startEdit(ch.id, 'words', ch.words)}
                        >
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-xs text-muted-foreground">Mots :</span>
                          {isEditingThis && editingField === 'words' ? (
                            <input
                              className="text-sm bg-white border rounded px-2 py-0.5 flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') commitEdit()
                                if (e.key === 'Escape') cancelEdit()
                              }}
                              autoFocus
                            />
                          ) : (
                            <span className="text-sm font-medium tabular-nums">
                              {ch.words > 0 ? ch.words.toLocaleString() : 'Non défini'}
                            </span>
                          )}
                        </div>
                        {/* Edit pages */}
                        <div
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                          onClick={() => startEdit(ch.id, 'pages', ch.pages)}
                        >
                          <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-xs text-muted-foreground">Pages :</span>
                          {isEditingThis && editingField === 'pages' ? (
                            <input
                              className="text-sm bg-white border rounded px-2 py-0.5 flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') commitEdit()
                                if (e.key === 'Escape') cancelEdit()
                              }}
                              autoFocus
                            />
                          ) : (
                            <span className="text-sm font-medium tabular-nums">
                              {ch.pages > 0 ? ch.pages : 'Non défini'}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Notes */}
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground shrink-0 mt-0.5">Notes :</span>
                        {isEditingThis && editingField === 'notes' ? (
                          <textarea
                            className="text-xs bg-white border rounded px-2 py-1 flex-1 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[60px]"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') cancelEdit()
                              if (e.key === 'Enter' && e.metaKey) commitEdit()
                            }}
                            autoFocus
                            rows={2}
                          />
                        ) : (
                          <div
                            className="flex-1 text-sm cursor-pointer p-2 rounded-md hover:bg-muted/50 min-h-[32px] border border-dashed border-border"
                            onClick={() => startEdit(ch.id, 'notes', ch.notes)}
                          >
                            {ch.notes ? (
                              <span className="text-sm text-foreground">{ch.notes}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">
                                Cliquer pour ajouter des remarques…
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Sub-components for ArticlesTab ───────────────────────────────

function StepIcon({ name, className }: { name: string; className?: string }) {
  return createElement(getIcon(name), { className })
}

function StepCard({ step, index }: { step: typeof writingSteps[0]; index: number }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
            <StepIcon name={step.icon} className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs shrink-0">Étape {index + 1}</Badge>
            </div>
            <CardTitle className="text-base mt-1">{step.title}</CardTitle>
            <CardDescription className="text-sm mt-1">{step.shortDesc}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Tips */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">Conseils</span>
          </div>
          <ul className="space-y-1.5">
            {step.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Pitfalls */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-semibold text-red-600">Pièges à éviter</span>
          </div>
          <ul className="space-y-1.5">
            {step.pitfalls.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function SectionGuideCard({ guide }: { guide: typeof sectionGuides[0] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-sky-100 text-sky-700 shrink-0">
            <StepIcon name={guide.icon} className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{guide.label}</CardTitle>
            {guide.wordCount && (
              <Badge variant="secondary" className="mt-1 text-xs">{guide.wordCount}</Badge>
            )}
          </div>
        </div>
        <CardDescription className="mt-2 text-sm">{guide.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Structure attendue</span>
          <ol className="mt-2 space-y-1">
            {guide.structure.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-muted text-muted-foreground text-xs font-medium shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <Separator />
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conseils</span>
          <ul className="mt-2 space-y-1">
            {guide.tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sky-500" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        {guide.example && (
          <>
            <Separator />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exemple</span>
              <p className="mt-2 text-sm italic text-muted-foreground bg-muted/50 rounded-md p-3">
                {guide.example}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function ChecklistSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const totalItems = submissionChecklist.reduce((a, c) => a + c.items.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Checklist de soumission</CardTitle>
            <CardDescription className="text-sm mt-1">
              {checkedCount} / {totalItems} étapes complétées
            </CardDescription>
          </div>
          <Badge variant={checkedCount === totalItems ? 'default' : 'secondary'} className="shrink-0">
            {Math.round((checkedCount / totalItems) * 100)}%
          </Badge>
        </div>
        <Progress value={(checkedCount / totalItems) * 100} className="h-1.5" />
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {submissionChecklist.map((section) => (
            <AccordionItem key={section.category} value={section.category}>
              <AccordionTrigger className="text-sm font-semibold">
                {section.category}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {section.items.map((item) => {
                    const key = `${section.category}-${item}`
                    return (
                      <label
                        key={key}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={checked[key] || false}
                          onCheckedChange={() => toggle(key)}
                        />
                        <span className={`text-sm ${checked[key] ? 'line-through text-muted-foreground' : ''}`}>
                          {item}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

function MistakesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Erreurs fréquentes
        </CardTitle>
        <CardDescription className="text-sm">Les pièges les plus courants et comment les éviter</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {commonMistakes.map((m, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{m.mistake}</span>
              </div>
              <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-1.5 ml-6">
                ⚠️ {m.consequence}
              </p>
              <div className="flex items-start gap-2 ml-6">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-700">{m.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── ArticlesGuideTab ─────────────────────────────────────────────
function ArticlesGuideTab() {
  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 shrink-0">
              <BookOpen className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900">Guide de rédaction d'articles scientifiques</h3>
              <p className="text-sm text-emerald-700 mt-1">
                Ce guide est basé sur les articles de référence fournis, notamment le guide pas-à-pas
                d'Ecarnot et al. (2015). Il est conçu pour les doctorants en architecture et urbanisme
                de l'Université Constantine 3.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sub-tabs for the articles guide */}
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="steps" className="text-xs sm:text-sm">Étapes de rédaction</TabsTrigger>
          <TabsTrigger value="sections" className="text-xs sm:text-sm">Sections IMRaD</TabsTrigger>
          <TabsTrigger value="mistakes" className="text-xs sm:text-sm">Erreurs fréquentes</TabsTrigger>
          <TabsTrigger value="checklist" className="text-xs sm:text-sm">Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="mt-4">
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 pr-4">
              {writingSteps.map((step, i) => (
                <StepCard key={step.id} step={step} index={i} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sections" className="mt-4">
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 pr-4">
              {sectionGuides.map((guide) => (
                <SectionGuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="mistakes" className="mt-4">
          <ScrollArea className="max-h-[70vh]">
            <div className="pr-4">
              <MistakesSection />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="checklist" className="mt-4">
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 pr-4">
              <ChecklistSection />
              {/* Reference article */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookMarked className="h-5 w-5 text-amber-600" />
                    Source de référence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {referenceArticles.map((art) => (
                    <div key={art.id} className="border rounded-lg p-4 space-y-2">
                      <p className="text-sm font-medium">{art.title}</p>
                      <p className="text-xs text-muted-foreground">{art.authors}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">{art.source}</Badge>
                        <Badge variant="outline" className="text-xs">{art.year}</Badge>
                        {art.doi && (
                          <Badge variant="outline" className="text-xs">DOI: {art.doi}</Badge>
                        )}
                      </div>
                      <Separator className="my-2" />
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Points clés</span>
                        <ul className="mt-1 space-y-1">
                          {art.keyPoints.map((kp, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                              <span>{kp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-600 text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">ThesisFrame</h1>
            <p className="text-xs text-muted-foreground">Aide à la structuration — Université Constantine 3</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-6">
              <TabsTrigger value="articles" className="text-sm sm:text-base flex items-center gap-2 py-3">
                <FileText className="h-4 w-4" />
                Articles scientifiques
              </TabsTrigger>
              <TabsTrigger value="thesis" className="text-sm sm:text-base flex items-center gap-2 py-3">
                <BookOpen className="h-4 w-4" />
                Plan de thèse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles">
              <ArticlesGuideTab />
            </TabsContent>

            <TabsContent value="thesis">
              <ThesisPlanTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            ThesisFrame © 2025 — Université Constantine 3, Faculté d'Architecture et d'Urbanisme
          </p>
          <p className="text-xs text-muted-foreground">
            Basé sur le squelette IMRaD • Guide Ecarnot et al. (2015)
          </p>
        </div>
      </footer>
    </div>
  )
}