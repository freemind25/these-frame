'use client'

import { useState, useCallback } from 'react'
import {
  Zap, FileText, Presentation, FileSpreadsheet, Download, Loader2,
  CheckCircle2, X, AlertTriangle, Play, BarChart3, RefreshCw, Copy,
  ChevronDown, ChevronRight, Clock, Target, TrendingUp,
} from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ThesisData } from '@/types/thesis'

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
  const [pipelineResults, setPipelineResults] = useState<any[]>([])

  // Review states
  const [reviewRunning, setReviewRunning] = useState(false)
  const [reviewResults, setReviewResults] = useState<ReviewResult[]>([])
  const [reviewAvgScore, setReviewAvgScore] = useState<number | null>(null)
  const [reviewExpanded, setReviewExpanded] = useState<Record<string, boolean>>({})

  const resetMessages = useCallback(() => {
    setExportError(null)
    setExportSuccess(null)
  }, [])

  // ─── Export helpers ───
  const downloadBlob = useCallback(async (url: string, filename: string, payload: any) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur réseau' }))
      throw new Error(err.error || 'Erreur inconnue')
    }
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
  }, [])

  const thesisPayload = useCallback(() => {
    if (!thesis) return null
    return {
      title: thesis.title,
      author: thesis.author,
      university: thesis.university,
      field: thesis.field,
      chapters: thesis.chapters.map(c => ({
        id: c.id,
        number: c.number,
        title: c.title,
        content: c.content,
        order: c.order,
        wordCount: c.wordCount,
        status: c.status,
      })),
    }
  }, [thesis])

  const slug = (name: string) => (name || 'these').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)

  const handleExportDocx = async () => {
    const payload = thesisPayload()
    if (!payload) return
    setExporting('docx'); resetMessages()
    try {
      await downloadBlob('/api/office/export-docx', `these-${slug(payload.title)}.docx`, payload)
      setExportSuccess('Document Word exporté ✓')
    } catch (err: any) { setExportError(err.message) }
    finally { setExporting(null) }
  }

  const handleExportPptx = async () => {
    const payload = thesisPayload()
    if (!payload) return
    setExporting('pptx'); resetMessages()
    try {
      await downloadBlob('/api/office/export-pptx', `soutenance-${slug(payload.title)}.pptx`, payload)
      setExportSuccess('Présentation PowerPoint générée ✓')
    } catch (err: any) { setExportError(err.message) }
    finally { setExporting(null) }
  }

  const handleExportXlsx = async () => {
    const payload = thesisPayload()
    if (!payload) return
    setExporting('xlsx'); resetMessages()
    try {
      await downloadBlob('/api/office/export-xlsx', `suivi-${slug(payload.title)}.xlsx`, payload)
      setExportSuccess('Tableur de suivi généré ✓')
    } catch (err: any) { setExportError(err.message) }
    finally { setExporting(null) }
  }

  const handleBatchExport = async () => {
    const payload = thesisPayload()
    if (!payload) return
    setExporting('batch'); resetMessages()
    const errors: string[] = []
    try { await downloadBlob('/api/office/export-docx', `these-${slug(payload.title)}.docx`, payload) } catch (e: any) { errors.push('Word: ' + e.message) }
    try { await downloadBlob('/api/office/export-pptx', `soutenance-${slug(payload.title)}.pptx`, payload) } catch (e: any) { errors.push('PPT: ' + e.message) }
    try { await downloadBlob('/api/office/export-xlsx', `suivi-${slug(payload.title)}.xlsx`, payload) } catch (e: any) { errors.push('Excel: ' + e.message) }
    setExporting(null)
    if (errors.length === 0) setExportSuccess('3 fichiers exportés avec succès ✓')
    else if (errors.length < 3) setExportSuccess(`${3 - errors.length}/3 export(s) réussi(s). Échecs : ${errors.join(', ')}`)
    else setExportError('Tous les exports ont échoué.')
  }

  // ─── AI Pipeline ───
  const handleGenerateDrafts = async () => {
    if (!thesis || pipelineRunning) return
    const payload = thesisPayload()
    if (!payload) return

    const emptyChapters = payload.chapters.filter(ch => !ch.content || ch.wordCount < 50)
    if (emptyChapters.length === 0) {
      setPipelineMessage('Tous les chapitres ont déjà du contenu.')
      return
    }

    setPipelineRunning(true)
    setPipelineResults([])
    setPipelineMessage('')
    setPipelineSteps([
      { label: 'Analyse des chapitres vides', status: 'running' },
      ...emptyChapters.map(ch => ({ label: `Ch.${ch.number} : ${ch.title}`, status: 'pending' as const })),
      { label: 'Finalisation', status: 'pending' as const },
    ])

    try {
      // Step 1: done
      setPipelineSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'done' as const, detail: `${emptyChapters.length} chapitre(s) à rédiger` } : s))

      const res = await fetch('/api/automation/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate-drafts', thesis: payload }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erreur pipeline')

      // Update step statuses
      data.results.forEach((r: any, i: number) => {
        const stepIdx = i + 1
        setPipelineSteps(prev => prev.map((s, j) => j === stepIdx
          ? { ...s, status: r.success ? 'done' as const : 'error' as const, detail: r.success ? `${r.draftLength} car. générés` : r.error }
          : s
        ))
      })

      // Final step
      setPipelineSteps(prev => prev.map((s, i) => i === prev.length - 1 ? { ...s, status: 'done' as const } : s))
      setPipelineResults(data.results)
      setPipelineMessage(data.message)
    } catch (err: any) {
      setPipelineSteps(prev => prev.map(s => s.status === 'running' ? { ...s, status: 'error' as const, detail: err.message } : s))
      setPipelineMessage(err.message)
    } finally {
      setPipelineRunning(false)
    }
  }

  const handleReviewAll = async () => {
    if (!thesis || reviewRunning) return
    const payload = thesisPayload()
    if (!payload) return

    const filledChapters = payload.chapters.filter(ch => ch.content && ch.wordCount > 100)
    if (filledChapters.length === 0) {
      setReviewResults([])
      return
    }

    setReviewRunning(true)
    setReviewResults([])
    setReviewAvgScore(null)
    setReviewExpanded({})

    try {
      const res = await fetch('/api/automation/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'review-all', thesis: payload }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erreur révision')

      setReviewResults(data.results || [])
      setReviewAvgScore(data.averageScore || null)
    } catch (err: any) {
      setReviewResults([{ chapterId: 'error', chapterNumber: 0, chapterTitle: 'Erreur', success: false, remarks: [], error: err.message }])
    } finally {
      setReviewRunning(false)
    }
  }

  // ─── Computed stats ───
  const totalWords = thesis?.chapters.reduce((s, c) => s + c.wordCount, 0) || 0
  const filledChapters = thesis?.chapters.filter(c => c.wordCount > 0).length || 0
  const totalChapters = thesis?.chapters.length || 0
  const completionPct = totalChapters > 0 ? Math.round((filledChapters / totalChapters) * 100) : 0
  const wordPct = Math.min(100, Math.round((totalWords / 80000) * 100))

  const severityColor = (s: string) =>
    s === 'error' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
    s === 'warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
    'text-sky-400 bg-sky-500/10 border-sky-500/20'

  const scoreColor = (s?: number) =>
    s === undefined ? 'text-slate-400' :
    s >= 7 ? 'text-emerald-400' : s >= 5 ? 'text-amber-400' : 'text-red-400'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto bg-slate-950 border-slate-800 p-0">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Zap className="h-5 w-5 text-amber-400" />
            Automatisation & Pipeline
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 pb-6">
          {/* Stats summary */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <Card className="bg-slate-900/60 border-slate-800">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-emerald-400">{totalWords.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">Mots / 80 000</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/60 border-slate-800">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-sky-400">{filledChapters}/{totalChapters}</div>
                <div className="text-[10px] text-slate-500">Chapitres rédigés</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/60 border-slate-800">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-amber-400">{completionPct}%</div>
                <div className="text-[10px] text-slate-500">Complétion</div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 mb-4 bg-slate-900">
              <TabsTrigger value="exports" className="text-xs data-[state=active]:bg-slate-800">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Exports
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="text-xs data-[state=active]:bg-slate-800">
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Pipeline IA
              </TabsTrigger>
            </TabsList>

            {/* ═══════════ TAB: EXPORTS ═══════════ */}
            <TabsContent value="exports" className="space-y-4">
              {/* Messages */}
              {exportError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                  <X className="h-4 w-4 shrink-0 mt-0.5" /><span>{exportError}</span>
                </div>
              )}
              {exportSuccess && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /><span>{exportSuccess}</span>
                </div>
              )}

              {/* Batch export hero card */}
              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-400" />
                    <CardTitle className="text-sm text-white">Export Lot Complet</CardTitle>
                  </div>
                  <CardDescription className="text-[11px] text-slate-400">
                    Exportez les 3 fichiers en un clic : Word (.docx), PowerPoint (.pptx) et Tableur de suivi (.xlsx)
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <FileText className="h-3 w-3 text-blue-400" />Word
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Presentation className="h-3 w-3 text-orange-400" />PowerPoint
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <FileSpreadsheet className="h-3 w-3 text-emerald-400" />Excel
                    </div>
                  </div>
                  <Button
                    onClick={handleBatchExport}
                    disabled={exporting === 'batch' || filledChapters === 0}
                    size="sm"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs"
                  >
                    {exporting === 'batch' ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1.5" />}
                    Exporter les 3 fichiers
                  </Button>
                </CardContent>
              </Card>

              <Separator className="bg-slate-800" />

              {/* Individual exports */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Exports individuels</h3>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <CardTitle className="text-xs text-white">Document Word (.docx)</CardTitle>
                    </div>
                    <CardDescription className="text-[10px] text-slate-500">
                      Page de titre + tous les chapitres rédigés. Format Times New Roman.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-3">
                    <Button
                      onClick={handleExportDocx}
                      disabled={exporting === 'docx' || filledChapters === 0}
                      variant="outline" size="sm"
                      className="w-full text-xs border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                    >
                      {exporting === 'docx' ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1.5" />}
                      Exporter .docx
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <div className="flex items-center gap-2">
                      <Presentation className="h-4 w-4 text-orange-400" />
                      <CardTitle className="text-xs text-white">Présentation Soutenance (.pptx)</CardTitle>
                    </div>
                    <CardDescription className="text-[10px] text-slate-500">
                      Diaporama automatique : titre, plan, diapositives par chapitre, conclusion.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-3">
                    <Button
                      onClick={handleExportPptx}
                      disabled={exporting === 'pptx' || filledChapters === 0}
                      variant="outline" size="sm"
                      className="w-full text-xs border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
                    >
                      {exporting === 'pptx' ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1.5" />}
                      Générer .pptx
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                      <CardTitle className="text-xs text-white">Tableur de Suivi (.xlsx)</CardTitle>
                    </div>
                    <CardDescription className="text-[10px] text-slate-500">
                      Suivi de progression par chapitre + calendrier estimatif. Mis à jour en temps réel.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-3">
                    <Button
                      onClick={handleExportXlsx}
                      disabled={exporting === 'xlsx'}
                      variant="outline" size="sm"
                      className="w-full text-xs border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                    >
                      {exporting === 'xlsx' ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1.5" />}
                      Générer .xlsx
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ═══════════ TAB: PIPELINE IA ═══════════ */}
            <TabsContent value="pipeline" className="space-y-4">
              {/* Generate Drafts */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-violet-400" />
                      <CardTitle className="text-sm text-white">Générer les brouillons</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-300">
                      {thesis?.chapters.filter(c => !c.content || c.wordCount < 50).length || 0} chapitres vides
                    </Badge>
                  </div>
                  <CardDescription className="text-[11px] text-slate-400">
                    L'IA rédige un brouillon initial pour chaque chapitre vide, en tenant compte du contexte global.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <Button
                    onClick={handleGenerateDrafts}
                    disabled={pipelineRunning}
                    size="sm"
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs"
                  >
                    {pipelineRunning ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Play className="h-3.5 w-3.5 mr-1.5" />}
                    {pipelineRunning ? 'Pipeline en cours...' : 'Lancer la génération'}
                  </Button>

                  {/* Pipeline steps */}
                  {pipelineSteps.length > 0 && (
                    <div className="space-y-1.5 max-h-64 overflow-y-auto">
                      {pipelineSteps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px]">
                          {step.status === 'running' && <Loader2 className="h-3.5 w-3.5 text-violet-400 animate-spin mt-0.5 shrink-0" />}
                          {step.status === 'done' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />}
                          {step.status === 'error' && <X className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />}
                          {step.status === 'pending' && <div className="w-3.5 h-3.5 rounded-full border border-slate-600 mt-0.5 shrink-0" />}
                          <div className="min-w-0">
                            <span className={step.status === 'done' ? 'text-slate-300' : step.status === 'error' ? 'text-red-300' : 'text-slate-500'}>
                              {step.label}
                            </span>
                            {step.detail && <div className="text-[10px] text-slate-600 truncate">{step.detail}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {pipelineMessage && (
                    <p className={`text-[11px] ${pipelineMessage.includes('succès') || pipelineMessage.includes('généré') ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {pipelineMessage}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Separator className="bg-slate-800" />

              {/* Auto Review */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-cyan-400" />
                      <CardTitle className="text-sm text-white">Révision automatique</CardTitle>
                    </div>
                    {reviewAvgScore !== null && (
                      <Badge variant="outline" className={`text-[10px] ${reviewAvgScore >= 7 ? 'border-emerald-500/30 text-emerald-300' : reviewAvgScore >= 5 ? 'border-amber-500/30 text-amber-300' : 'border-red-500/30 text-red-300'}`}>
                        Note moyenne : {reviewAvgScore}/10
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-[11px] text-slate-400">
                    L'IA analyse chaque chapitre rédigé et fournit un retour structuré (score + remarques).
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <Button
                    onClick={handleReviewAll}
                    disabled={reviewRunning || (thesis?.chapters.filter(c => c.wordCount > 100).length || 0) === 0}
                    size="sm"
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs"
                  >
                    {reviewRunning ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <BarChart3 className="h-3.5 w-3.5 mr-1.5" />}
                    {reviewRunning ? 'Analyse en cours...' : 'Lancer la révision'}
                  </Button>

                  {/* Review results */}
                  {reviewResults.length > 0 && (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {reviewResults.map((r) => (
                        <div key={r.chapterId} className="rounded-lg bg-slate-800/50 border border-slate-700/50 overflow-hidden">
                          <button
                            onClick={() => setReviewExpanded(prev => ({ ...prev, [r.chapterId]: !prev[r.chapterId] }))}
                            className="w-full flex items-center justify-between p-2.5 text-left hover:bg-slate-800 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {r.success ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                              )}
                              <span className="text-[11px] text-slate-200 font-medium truncate">
                                Ch.{r.chapterNumber} : {r.chapterTitle}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {r.score !== undefined && (
                                <span className={`text-xs font-bold ${scoreColor(r.score)}`}>{r.score}/10</span>
                              )}
                              {reviewExpanded[r.chapterId] ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                            </div>
                          </button>

                          {reviewExpanded[r.chapterId] && (
                            <div className="px-2.5 pb-2.5 space-y-1.5">
                              {r.error ? (
                                <p className="text-[11px] text-red-400">{r.error}</p>
                              ) : (
                                r.remarks.map((rem, ri) => (
                                  <div key={ri} className={`text-[11px] p-2 rounded border ${severityColor(rem.severity)}`}>
                                    <span className="font-medium uppercase tracking-wider text-[9px] opacity-70">{rem.type}</span>
                                    <p className="mt-0.5">{rem.text}</p>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Global progress visualization */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <CardTitle className="text-sm text-white">Progression globale</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-400">Mots rédigés</span>
                      <span className="text-emerald-400 font-medium">{totalWords.toLocaleString()} / 80 000</span>
                    </div>
                    <Progress value={wordPct} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-400">Chapitres complétés</span>
                      <span className="text-sky-400 font-medium">{filledChapters} / {totalChapters}</span>
                    </div>
                    <Progress value={completionPct} className="h-2" />
                  </div>

                  {/* Chapter breakdown */}
                  <div className="space-y-1">
                    {thesis?.chapters.map(ch => {
                      const chPct = Math.min(100, Math.round((ch.wordCount / (80000 / totalChapters)) * 100))
                      return (
                        <div key={ch.id} className="flex items-center gap-2 text-[10px]">
                          <span className="w-5 text-right text-slate-500 shrink-0">{ch.number}</span>
                          <span className="w-28 truncate text-slate-400 shrink-0" title={ch.title}>{ch.title}</span>
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${chPct >= 100 ? 'bg-emerald-500' : chPct > 0 ? 'bg-sky-500' : 'bg-slate-700'}`}
                              style={{ width: `${chPct}%` }}
                            />
                          </div>
                          <span className="w-12 text-right text-slate-500 shrink-0">{ch.wordCount.toLocaleString()}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
