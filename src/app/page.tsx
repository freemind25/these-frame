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
function ThesisPlanTab() {
  const thesisChapters = [
    { id: 'cover', title: 'Page de couverture', status: 'pending', words: 0, target: 200 },
    { id: 'ack', title: 'Remerciements', status: 'pending', words: 0, target: 500 },
    { id: 'abstract', title: 'Résumé (Français / Anglais)', status: 'pending', words: 0, target: 600 },
    { id: 'intro', title: 'Introduction générale', status: 'in-progress', words: 1200, target: 5000 },
    { id: 'lit', title: 'Revue de la littérature (Chapitre I)', status: 'pending', words: 0, target: 15000 },
    { id: 'context', title: 'Contexte et cadre méthodologique (Chapitre II)', status: 'pending', words: 0, target: 12000 },
    { id: 'results', title: 'Résultats et analyse (Chapitre III)', status: 'pending', words: 0, target: 15000 },
    { id: 'discussion', title: 'Discussion (Chapitre IV)', status: 'pending', words: 0, target: 10000 },
    { id: 'conclusion', title: 'Conclusion générale', status: 'pending', words: 0, target: 3000 },
    { id: 'biblio', title: 'Références bibliographiques', status: 'pending', words: 0, target: 3000 },
    { id: 'annexes', title: 'Annexes', status: 'pending', words: 0, target: 2000 },
  ]

  const totalWords = thesisChapters.reduce((a, c) => a + c.words, 0)
  const totalTarget = thesisChapters.reduce((a, c) => a + c.target, 0)
  const overallProgress = Math.round((totalWords / totalTarget) * 100)

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Progression globale</CardDescription>
            <CardTitle className="text-3xl font-bold">{overallProgress}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {totalWords.toLocaleString()} / {totalTarget.toLocaleString()} mots
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Chapitres rédigés</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {thesisChapters.filter(c => c.words > 0).length} / {thesisChapters.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={(thesisChapters.filter(c => c.words > 0).length / thesisChapters.length) * 100}
              className="h-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Structure IMRaD</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-emerald-600" />
              Actif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Squelette IMRaD adapté à l'architecture et l'urbanisme
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chapter list */}
      <Card>
        <CardHeader>
          <CardTitle>Chapitres de la thèse</CardTitle>
          <CardDescription>Structure IMRaD — Université Constantine 3</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {thesisChapters.map((ch) => {
              const pct = ch.target > 0 ? Math.min(100, Math.round((ch.words / ch.target) * 100)) : 0
              return (
                <div key={ch.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{ch.title}</span>
                      {ch.words > 0 && (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {pct}%
                        </Badge>
                      )}
                    </div>
                    <Progress value={pct} className="h-1.5 mt-2" />
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                    {ch.words > 0 ? `${ch.words.toLocaleString()}` : '—'} / {ch.target.toLocaleString()} mots
                  </span>
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