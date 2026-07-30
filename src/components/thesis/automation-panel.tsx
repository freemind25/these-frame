'use client'

import { useState, useCallback } from 'react'
import {
  Zap, FileText, Presentation, FileSpreadsheet, Download, Loader2,
  CheckCircle2, X, AlertTriangle, Play, BarChart3, RefreshCw,
  ChevronDown, ChevronRight, TrendingUp, Users, PenLine,
  GraduationCap, Search, Eye, Clock, Star, ArrowRight, CircleDot,
  Target,
} from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ThesisData } from '@/types/thesis'
import { THESIS_AGENTS, KANBAN_COLUMNS, type OrchestrationRun, type OrchestrationTask, type AgentRole } from '@/types/agent-orchestration'

interface AutomationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  thesis: ThesisData | null
  onContentChange?: (chapterId: string, content: string) => void
}

interface PipelineStep {
  label: string
  status: 'pending' | 'running' | 'done' | 'error'
  detail?: string
}

interface ReviewResult {
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  success: boolean
  remarks: { type: string; severity: string; text: string }[]
  score?: number
  error?: string
}

const AGENT_ICONS: Record<AgentRole, any> = { redacteur: PenLine, directeur: GraduationCap, chercheur: Search }
const AGENT_COLORS: Record<AgentRole, string> = { redacteur: 'violet', directeur: 'amber', chercheur: 'cyan' }
const AGENT_LABELS: Record<AgentRole, string> = { redacteur: 'R\u00e9dacteur', directeur: 'Directeur', chercheur: 'Chercheur' }
const STATUS_BADGE: Record<string, string> = {
  idle: 'bg-slate-500/20 text-slate-400 border-slate-600/30',
  working: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  done: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  error: 'bg-red-500/20 text-red-300 border-red-500/30',
}
const TASK_STATUS_STYLES: Record<string, string> = {
  todo: 'border-l-slate-500',
  in_progress: 'border-l-violet-500',
  in_review: 'border-l-amber-500',
  needs_fix: 'border-l-red-500',
  completed: 'border-l-emerald-500',
}
const TASK_STATUS_LABELS: Record<string, string> = {
  todo: '\u00c0 faire', in_progress: 'En cours', in_review: 'En r\u00e9vision',
  needs_fix: '\u00c0 corriger', completed: 'Termin\u00e9',
}

export default function AutomationPanel({ open, onOpenChange, thesis }: AutomationPanelProps) {
  const [activeTab, setActiveTab] = useState('exports')

  // Export states
  const [exporting, setExporting] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const [exportSuccess, setExportSuccess] = useState<string | null>(null)

  // Pipeline states
  const [pipelineRunning, setPipelineRunning] = useState(false)
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([])
  const [pipelineMessage, setPipelineMessage] = useState('')

  // Review states
  const [reviewRunning, setReviewRunning] = useState(false)
  const [reviewResults, setReviewResults] = useState<ReviewResult[]>([])
  const [reviewAvgScore, setReviewAvgScore] = useState<number | null>(null)
  const [reviewExpanded, setReviewExpanded] = useState<Record<string, boolean>>({})

  // Orchestration states
  const [orchRunning, setOrchRunning] = useState(false)
  const [orchRun, setOrchRun] = useState<OrchestrationRun | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  // ─── Computed stats ───
  const totalWords = thesis?.chapters.reduce((s, c) => s + c.wordCount, 0) || 0
  const filledChapters = thesis?.chapters.filter(c => c.wordCount > 0).length || 0
  const totalChapters = thesis?.chapters.length || 0
  const completionPct = totalChapters > 0 ? Math.round((filledChapters / totalChapters) * 100) : 0
  const wordPct = Math.min(100, Math.round((totalWords / 80000) * 100))

  const resetMessages = useCallback(() => { setExportError(null); setExportSuccess(null) }, [])

  // ─── Export helpers ───
  const downloadBlob = useCallback(async (url: string, filename: string, payload: any) => {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) { const err = await res.json().catch(() => ({ error: 'Erreur r\u00e9seau' })); throw new Error(err.error || 'Erreur inconnue') }
    const blob = await res.blob()
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href)
  }, [])

  const thesisPayload = useCallback(() => {
    if (!thesis) return null
    return {
      title: thesis.title, author: thesis.author, university: thesis.university, field: thesis.field,
      chapters: thesis.chapters.map(c => ({ id: c.id, number: c.number, title: c.title, content: c.content, order: c.order, wordCount: c.wordCount, status: c.status })),
    }
  }, [thesis])

  const slug = (name: string) => (name || 'these').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)

  const handleExportDocx = async () => {
    const payload = thesisPayload(); if (!payload) return
    setExporting('docx'); resetMessages()
    try { await downloadBlob('/api/office/export-docx', `these-${slug(payload.title)}.docx`, payload); setExportSuccess('Document Word export\u00e9 \u2713') } catch (err: any) { setExportError(err.message) } finally { setExporting(null) }
  }
  const handleExportPptx = async () => {
    const payload = thesisPayload(); if (!payload) return
    setExporting('pptx'); resetMessages()
    try { await downloadBlob('/api/office/export-pptx', `soutenance-${slug(payload.title)}.pptx`, payload); setExportSuccess('Pr\u00e9sentation PowerPoint g\u00e9n\u00e9r\u00e9e \u2713') } catch (err: any) { setExportError(err.message) } finally { setExporting(null) }
  }
  const handleExportXlsx = async () => {
    const payload = thesisPayload(); if (!payload) return
    setExporting('xlsx'); resetMessages()
    try { await downloadBlob('/api/office/export-xlsx', `suivi-${slug(payload.title)}.xlsx`, payload); setExportSuccess('Tableur de suivi g\u00e9n\u00e9r\u00e9 \u2713') } catch (err: any) { setExportError(err.message) } finally { setExporting(null) }
  }
  const handleBatchExport = async () => {
    const payload = thesisPayload(); if (!payload) return
    setExporting('batch'); resetMessages()
    const errors: string[] = []
    try { await downloadBlob('/api/office/export-docx', `these-${slug(payload.title)}.docx`, payload) } catch (e: any) { errors.push('Word: ' + e.message) }
    try { await downloadBlob('/api/office/export-pptx', `soutenance-${slug(payload.title)}.pptx`, payload) } catch (e: any) { errors.push('PPT: ' + e.message) }
    try { await downloadBlob('/api/office/export-xlsx', `suivi-${slug(payload.title)}.xlsx`, payload) } catch (e: any) { errors.push('Excel: ' + e.message) }
    setExporting(null)
    if (errors.length === 0) setExportSuccess('3 fichiers export\u00e9s avec succ\u00e8s \u2713')
    else if (errors.length < 3) setExportSuccess(`${3 - errors.length}/3 export(s) r\u00e9ussi(s). \u00c9checs : ${errors.join(', ')}`)
    else setExportError('Tous les exports ont \u00e9chou\u00e9.')
  }

  // ─── AI Pipeline (simple) ───
  const handleGenerateDrafts = async () => {
    if (!thesis || pipelineRunning) return
    const payload = thesisPayload(); if (!payload) return
    const emptyChapters = payload.chapters.filter(ch => !ch.content || ch.wordCount < 50)
    if (emptyChapters.length === 0) { setPipelineMessage('Tous les chapitres ont d\u00e9j\u00e0 du contenu.'); return }
    setPipelineRunning(true); setPipelineMessage('')
    setPipelineSteps([{ label: 'Analyse des chapitres vides', status: 'running' }, ...emptyChapters.map(ch => ({ label: `Ch.${ch.number} : ${ch.title}`, status: 'pending' as const })), { label: 'Finalisation', status: 'pending' as const }])
    try {
      setPipelineSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'done' as const, detail: `${emptyChapters.length} chapitre(s)` } : s))
      const res = await fetch('/api/automation/pipeline', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'generate-drafts', thesis: payload }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur pipeline')
      data.results.forEach((r: any, i: number) => { setPipelineSteps(prev => prev.map((s, j) => j === i + 1 ? { ...s, status: r.success ? 'done' as const : 'error' as const, detail: r.success ? `${r.draftLength} car.` : r.error } : s)) })
      setPipelineSteps(prev => prev.map((s, i) => i === prev.length - 1 ? { ...s, status: 'done' as const } : s))
      setPipelineMessage(data.message)
    } catch (err: any) {
      setPipelineSteps(prev => prev.map(s => s.status === 'running' ? { ...s, status: 'error' as const, detail: err.message } : s))
      setPipelineMessage(err.message)
    } finally { setPipelineRunning(false) }
  }

  const handleReviewAll = async () => {
    if (!thesis || reviewRunning) return
    const payload = thesisPayload(); if (!payload) return
    const filled = payload.chapters.filter(ch => ch.content && ch.wordCount > 100)
    if (filled.length === 0) { setReviewResults([]); return }
    setReviewRunning(true); setReviewResults([]); setReviewAvgScore(null); setReviewExpanded({})
    try {
      const res = await fetch('/api/automation/pipeline', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'review-all', thesis: payload }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setReviewResults(data.results || []); setReviewAvgScore(data.averageScore || null)
    } catch (err: any) {
      setReviewResults([{ chapterId: 'error', chapterNumber: 0, chapterTitle: 'Erreur', success: false, remarks: [], error: err.message }])
    } finally { setReviewRunning(false) }
  }

  // ─── Multi-Agent Orchestration ───
  const handleOrchestrate = async (workflow: 'full' | 'review-only' | 'write-only') => {
    if (!thesis || orchRunning) return
    const payload = thesisPayload(); if (!payload) return
    setOrchRunning(true); setOrchRun(null); setSelectedTaskId(null)
    try {
      const res = await fetch('/api/automation/agents/execute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ thesis: payload, workflow }) })
      const data: OrchestrationRun = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur orchestration')
      setOrchRun(data)
    } catch (err: any) {
      setOrchRun({ id: 'err', createdAt: new Date().toISOString(), status: 'error', tasks: [], agents: [], summary: err.message })
    } finally { setOrchRunning(false) }
  }

  const severityColor = (s: string) => s === 'error' ? 'text-red-400 bg-red-500/10 border-red-500/20' : s === 'warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-sky-400 bg-sky-500/10 border-sky-500/20'
  const scoreColor = (s?: number) => s === undefined ? 'text-slate-400' : s >= 7 ? 'text-emerald-400' : s >= 5 ? 'text-amber-400' : 'text-red-400'
  const selectedTask = orchRun?.tasks.find(t => t.id === selectedTaskId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto bg-slate-950 border-slate-800 p-0">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Zap className="h-5 w-5 text-amber-400" />
            Automatisation & Orchestration
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 pb-6">
          {/* Stats summary */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <Card className="bg-slate-900/60 border-slate-800"><CardContent className="p-3 text-center"><div className="text-lg font-bold text-emerald-400">{totalWords.toLocaleString()}</div><div className="text-[10px] text-slate-500">Mots / 80 000</div></CardContent></Card>
            <Card className="bg-slate-900/60 border-slate-800"><CardContent className="p-3 text-center"><div className="text-lg font-bold text-sky-400">{filledChapters}/{totalChapters}</div><div className="text-[10px] text-slate-500">Chapitres r\u00e9dig\u00e9s</div></CardContent></Card>
            <Card className="bg-slate-900/60 border-slate-800"><CardContent className="p-3 text-center"><div className="text-lg font-bold text-amber-400">{completionPct}%</div><div className="text-[10px] text-slate-500">Compl\u00e9tion</div></CardContent></Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3 mb-4 bg-slate-900">
              <TabsTrigger value="exports" className="text-[11px] data-[state=active]:bg-slate-800">
                <Download className="h-3.5 w-3.5 mr-1" />Exports
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="text-[11px] data-[state=active]:bg-slate-800">
                <Play className="h-3.5 w-3.5 mr-1" />Pipeline
              </TabsTrigger>
              <TabsTrigger value="team" className="text-[11px] data-[state=active]:bg-slate-800">
                <Users className="h-3.5 w-3.5 mr-1" />\u00c9quipe IA
              </TabsTrigger>
            </TabsList>

            {/* ═══════════ TAB: EXPORTS ═══════════ */}
            <TabsContent value="exports" className="space-y-4">
              {exportError && <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300"><X className="h-4 w-4 shrink-0 mt-0.5" /><span>{exportError}</span></div>}
              {exportSuccess && <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /><span>{exportSuccess}</span></div>}

              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center gap-2"><Zap className="h-5 w-5 text-amber-400" /><CardTitle className="text-sm text-white">Export Lot Complet</CardTitle></div>
                  <CardDescription className="text-[11px] text-slate-400">Word + PowerPoint + Tableur de suivi en un clic</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400"><FileText className="h-3 w-3 text-blue-400" />Word</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400"><Presentation className="h-3 w-3 text-orange-400" />PowerPoint</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400"><FileSpreadsheet className="h-3 w-3 text-emerald-400" />Excel</div>
                  </div>
                  <Button onClick={handleBatchExport} disabled={exporting === 'batch' || filledChapters === 0} size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs">
                    {exporting === 'batch' ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1.5" />}Exporter les 3 fichiers
                  </Button>
                </CardContent>
              </Card>

              <Separator className="bg-slate-800" />

              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Exports individuels</h3>
                {[
                  { key: 'docx' as const, icon: FileText, label: 'Document Word (.docx)', desc: 'Page de titre + chapitres. Times New Roman.', color: 'blue', handler: handleExportDocx },
                  { key: 'pptx' as const, icon: Presentation, label: 'Pr\u00e9sentation Soutenance (.pptx)', desc: 'Diaporama automatique par chapitre.', color: 'orange', handler: handleExportPptx },
                  { key: 'xlsx' as const, icon: FileSpreadsheet, label: 'Tableur de Suivi (.xlsx)', desc: 'Progression par chapitre + calendrier.', color: 'emerald', handler: handleExportXlsx },
                ].map(exp => (
                  <Card key={exp.key} className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="pb-2 pt-3 px-4"><div className="flex items-center gap-2"><exp.icon className={`h-4 w-4 text-${exp.color}-400`} /><CardTitle className="text-xs text-white">{exp.label}</CardTitle></div><CardDescription className="text-[10px] text-slate-500">{exp.desc}</CardDescription></CardHeader>
                    <CardContent className="px-4 pb-3">
                      <Button onClick={exp.handler} disabled={exporting === exp.key || (exp.key !== 'xlsx' && filledChapters === 0)} variant="outline" size="sm" className={`w-full text-xs border-${exp.color}-500/30 text-${exp.color}-300 hover:bg-${exp.color}-500/10`}>
                        {exporting === exp.key ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1.5" />}{exp.key === 'docx' ? 'Exporter .docx' : exp.key === 'pptx' ? 'G\u00e9n\u00e9rer .pptx' : 'G\u00e9n\u00e9rer .xlsx'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ═══════════ TAB: PIPELINE (simple) ═══════════ */}
            <TabsContent value="pipeline" className="space-y-4">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Target className="h-4 w-4 text-violet-400" /><CardTitle className="text-sm text-white">G\u00e9n\u00e9rer les brouillons</CardTitle></div>
                    <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-300">{thesis?.chapters.filter(c => !c.content || c.wordCount < 50).length || 0} vides</Badge></div>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <Button onClick={handleGenerateDrafts} disabled={pipelineRunning} size="sm" className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs">
                    {pipelineRunning ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Play className="h-3.5 w-3.5 mr-1.5" />}{pipelineRunning ? 'Pipeline en cours...' : 'Lancer la g\u00e9n\u00e9ration'}
                  </Button>
                  {pipelineSteps.length > 0 && (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {pipelineSteps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px]">
                          {step.status === 'running' ? <Loader2 className="h-3.5 w-3.5 text-violet-400 animate-spin mt-0.5 shrink-0" /> : step.status === 'done' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" /> : step.status === 'error' ? <X className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600 mt-0.5 shrink-0" />}
                          <div className="min-w-0"><span className={step.status === 'done' ? 'text-slate-300' : step.status === 'error' ? 'text-red-300' : 'text-slate-500'}>{step.label}</span>{step.detail && <div className="text-[10px] text-slate-600 truncate">{step.detail}</div>}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {pipelineMessage && <p className={`text-[11px] ${pipelineMessage.includes('succ') || pipelineMessage.includes('g\u00e9n\u00e9r\u00e9') ? 'text-emerald-400' : 'text-slate-400'}`}>{pipelineMessage}</p>}
                </CardContent>
              </Card>

              <Separator className="bg-slate-800" />

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2"><RefreshCw className="h-4 w-4 text-cyan-400" /><CardTitle className="text-sm text-white">R\u00e9vision automatique</CardTitle></div>
                    {reviewAvgScore !== null && <Badge variant="outline" className={`text-[10px] ${reviewAvgScore >= 7 ? 'border-emerald-500/30 text-emerald-300' : 'border-amber-500/30 text-amber-300'}`}>Note : {reviewAvgScore}/10</Badge>}</div>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <Button onClick={handleReviewAll} disabled={reviewRunning} size="sm" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs">
                    {reviewRunning ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <BarChart3 className="h-3.5 w-3.5 mr-1.5" />}{reviewRunning ? 'Analyse en cours...' : 'Lancer la r\u00e9vision'}
                  </Button>
                  {reviewResults.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {reviewResults.map((r) => (
                        <div key={r.chapterId} className="rounded-lg bg-slate-800/50 border border-slate-700/50 overflow-hidden">
                          <button onClick={() => setReviewExpanded(prev => ({ ...prev, [r.chapterId]: !prev[r.chapterId] }))} className="w-full flex items-center justify-between p-2.5 text-left hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-2 min-w-0">{r.success ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />}<span className="text-[11px] text-slate-200 font-medium truncate">Ch.{r.chapterNumber} : {r.chapterTitle}</span></div>
                            <div className="flex items-center gap-2 shrink-0">{r.score !== undefined && <span className={`text-xs font-bold ${scoreColor(r.score)}`}>{r.score}/10</span>}{reviewExpanded[r.chapterId] ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}</div>
                          </button>
                          {reviewExpanded[r.chapterId] && (
                            <div className="px-2.5 pb-2.5 space-y-1.5">
                              {r.error ? <p className="text-[11px] text-red-400">{r.error}</p> : r.remarks.map((rem, ri) => (<div key={ri} className={`text-[11px] p-2 rounded border ${severityColor(rem.severity)}`}><span className="font-medium uppercase tracking-wider text-[9px] opacity-70">{rem.type}</span><p className="mt-0.5">{rem.text}</p></div>))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Progress visualization */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2 pt-4 px-4"><div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-400" /><CardTitle className="text-sm text-white">Progression globale</CardTitle></div></CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div><div className="flex justify-between text-[10px] mb-1"><span className="text-slate-400">Mots r\u00e9dig\u00e9s</span><span className="text-emerald-400 font-medium">{totalWords.toLocaleString()} / 80 000</span></div><Progress value={wordPct} className="h-2" /></div>
                  <div><div className="flex justify-between text-[10px] mb-1"><span className="text-slate-400">Chapitres compl\u00e9t\u00e9s</span><span className="text-sky-400 font-medium">{filledChapters} / {totalChapters}</span></div><Progress value={completionPct} className="h-2" /></div>
                  <div className="space-y-1">
                    {thesis?.chapters.map(ch => { const pct = Math.min(100, Math.round((ch.wordCount / (80000 / totalChapters)) * 100)); return (<div key={ch.id} className="flex items-center gap-2 text-[10px]"><span className="w-5 text-right text-slate-500 shrink-0">{ch.number}</span><span className="w-28 truncate text-slate-400 shrink-0" title={ch.title}>{ch.title}</span><div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-emerald-500' : pct > 0 ? 'bg-sky-500' : 'bg-slate-700'}`} style={{ width: `${pct}%` }} /></div><span className="w-12 text-right text-slate-500 shrink-0">{ch.wordCount.toLocaleString()}</span></div>) })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ═══════════ TAB: EQUIPE IA (multi-agent orchestration) ═══════════ */}
            <TabsContent value="team" className="space-y-4">
              {/* Agent Cards */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />Agents</h3>
                <div className="grid grid-cols-3 gap-2">
                  {THESIS_AGENTS.map(agent => {
                    const runAgent = orchRun?.agents.find(a => a.role === agent.role)
                    const status = runAgent?.status || 'idle'
                    const IconComp = AGENT_ICONS[agent.role]
                    return (
                      <Card key={agent.role} className={`bg-slate-900/60 border-l-2 ${agent.role === 'redacteur' ? 'border-l-violet-500' : agent.role === 'directeur' ? 'border-l-amber-500' : 'border-l-cyan-500'}`}>
                        <CardContent className="p-3 text-center space-y-1.5">
                          <IconComp className={`h-5 w-5 mx-auto ${agent.role === 'redacteur' ? 'text-violet-400' : agent.role === 'directeur' ? 'text-amber-400' : 'text-cyan-400'}`} />
                          <div className="text-[11px] font-medium text-slate-200">{agent.name}</div>
                          <Badge variant="outline" className={`text-[9px] ${STATUS_BADGE[status]}`}>
                            {status === 'working' && <Loader2 className="h-2.5 w-2.5 mr-0.5 animate-spin" />}
                            {status === 'idle' ? 'En attente' : status === 'working' ? 'Travaille' : status === 'done' ? 'Termin\u00e9' : 'Erreur'}
                          </Badge>
                          {runAgent && <div className="text-[9px] text-slate-500">{runAgent.tasksCompleted} t\u00e2che(s)</div>}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Workflow selector + Launch */}
              <Card className="bg-gradient-to-br from-violet-500/10 to-cyan-500/5 border-violet-500/20">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center gap-2"><ArrowRight className="h-5 w-5 text-violet-400" /><CardTitle className="text-sm text-white">Lancer l'\u00e9quipe</CardTitle></div>
                  <CardDescription className="text-[11px] text-slate-400">
                    Les 3 agents travaillent en s\u00e9quence : R\u00e9dacteur \u2192 Directeur \u2192 Chercheur
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Button size="sm" variant="outline" disabled={orchRunning} className={`text-[11px] ${!orchRun ? 'border-violet-500/40 text-violet-300 bg-violet-500/10 hover:bg-violet-500/20' : ''}`} onClick={() => handleOrchestrate('full')}>
                      {orchRunning ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Play className="h-3 w-3 mr-1" />}Complet
                    </Button>
                    <Button size="sm" variant="outline" disabled={orchRunning} onClick={() => handleOrchestrate('write-only')} className="text-[11px]">
                      {orchRunning ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <PenLine className="h-3 w-3 mr-1" />}R\u00e9diger
                    </Button>
                    <Button size="sm" variant="outline" disabled={orchRunning} onClick={() => handleOrchestrate('review-only')} className="text-[11px]">
                      {orchRunning ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Eye className="h-3 w-3 mr-1" />}R\u00e9viser
                    </Button>
                  </div>
                  {orchRunning && <div className="flex items-center gap-2 text-[11px] text-violet-300"><Loader2 className="h-3.5 w-3.5 animate-spin" />Orchestration en cours...</div>}
                </CardContent>
              </Card>

              {/* Kanban Board */}
              {orchRun && orchRun.tasks.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tableau Kanban</h3>
                    {orchRun.summary && <span className="text-[10px] text-slate-500">{orchRun.summary}</span>}
                  </div>
                  <div className="space-y-3">
                    {KANBAN_COLUMNS.filter(col => orchRun.tasks.some(t => t.status === col.key)).map(col => {
                      const colTasks = orchRun.tasks.filter(t => t.status === col.key)
                      return (
                        <div key={col.key}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <CircleDot className={`h-3 w-3 text-${col.color}-400`} />
                            <span className="text-[11px] font-medium text-slate-300">{col.label}</span>
                            <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-500">{colTasks.length}</Badge>
                          </div>
                          <div className="space-y-1.5 ml-1">
                            {colTasks.map(task => (
                              <button
                                key={task.id}
                                onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
                                className={`w-full text-left rounded-lg bg-slate-900/80 border-l-2 ${TASK_STATUS_STYLES[task.status] || 'border-l-slate-600'} p-2.5 hover:bg-slate-800/80 transition-colors ${selectedTaskId === task.id ? 'ring-1 ring-slate-600' : ''}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-medium text-slate-200 truncate">{task.title}</span>
                                  {task.score !== undefined && <span className={`text-[10px] font-bold shrink-0 ml-2 ${scoreColor(task.score)}`}>{task.score}/10</span>}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className={`text-[9px] ${AGENT_COLORS[task.assignedAgent] === 'violet' ? 'border-violet-500/30 text-violet-300' : AGENT_COLORS[task.assignedAgent] === 'amber' ? 'border-amber-500/30 text-amber-300' : 'border-cyan-500/30 text-cyan-300'}`}>
                                    {AGENT_LABELS[task.assignedAgent]}
                                  </Badge>
                                  {task.error && <span className="text-[9px] text-red-400">{task.error.slice(0, 30)}</span>}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Task Detail Panel */}
                  {selectedTask && (
                    <Card className="bg-slate-900/70 border-slate-700/50">
                      <CardHeader className="pb-2 pt-3 px-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xs text-white">{selectedTask.title}</CardTitle>
                          <Badge variant="outline" className={`text-[9px] border-slate-600 ${selectedTask.status === 'completed' ? 'text-emerald-300' : selectedTask.status === 'needs_fix' ? 'text-red-300' : 'text-slate-400'}`}>{TASK_STATUS_LABELS[selectedTask.status]}</Badge>
                        </div>
                        <CardDescription className="text-[10px] text-slate-500">{selectedTask.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 pb-3 space-y-2">
                        {selectedTask.score !== undefined && (
                          <div className="flex items-center gap-2"><Star className={`h-3.5 w-3.5 ${scoreColor(selectedTask.score)}`} /><span className={`text-sm font-bold ${scoreColor(selectedTask.score)}`}>{selectedTask.score}/10</span></div>
                        )}
                        {selectedTask.remarks && selectedTask.remarks.length > 0 && (
                          <div className="space-y-1">
                            {selectedTask.remarks.map((r, i) => (
                              <div key={i} className={`text-[10px] p-2 rounded border ${severityColor(r.severity)}`}>
                                <span className="font-medium uppercase text-[8px] opacity-70">{r.type}</span><p className="mt-0.5">{r.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {selectedTask.output && (
                          <details className="group">
                            <summary className="text-[10px] text-slate-400 cursor-pointer hover:text-slate-300 flex items-center gap-1">
                              <ChevronRight className="h-3 w-3 group-open:rotate-90 transition-transform" />Sortie de l'agent
                            </summary>
                            <pre className="mt-1.5 text-[10px] text-slate-500 bg-slate-800/50 rounded p-2 max-h-40 overflow-y-auto whitespace-pre-wrap">{selectedTask.output.slice(0, 1000)}{selectedTask.output.length > 1000 ? '...' : ''}</pre>
                          </details>
                        )}
                        {selectedTask.error && <p className="text-[11px] text-red-400">{selectedTask.error}</p>}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* Empty state */}
              {!orchRun && !orchRunning && (
                <div className="text-center py-8">
                  <Users className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-xs text-slate-500">Lancez l'\u00e9quipe IA pour voir le tableau Kanban se remplir.</p>
                  <p className="text-[10px] text-slate-600 mt-1">Les agents travaillent en s\u00e9quence : R\u00e9dacteur \u2192 Directeur \u2192 Chercheur.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
