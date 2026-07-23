'use client'

import { createElement, useState, useCallback, useEffect, useRef } from 'react'
import {
  GraduationCap, BookOpen, FlaskConical, BarChart3, MessageSquare,
  FileText, GraduationCap as CapIcon, ChevronRight, ChevronDown,
  BookMarked, Download, Save, Check, Loader2, X, Menu, Sparkles,
  ShieldCheck, Send, RotateCcw, AlertTriangle, RefreshCw, PanelRightOpen, PanelRightClose,
  Library, ClipboardList, ListChecks, Lightbulb, Settings, Trash2, Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useIsMobile } from '@/hooks/use-mobile'
import { CHAPTERS, CHAPTER_COLORS, type ChapterStructure } from '@/data/chapters-structure'
import ReferencesTab from '@/components/thesis/references-tab'
import ExportPdfContent from '@/components/thesis/export-pdf-tab'
import ArticlesGuideContent from '@/components/thesis/articles-tab'
import LiteratureSearch from '@/components/thesis/literature-search'

// ─── Types ──────────────────────────────────────────────────────
interface ChapterData {
  id: string
  thesisId: string
  order: number
  number: string
  title: string
  content: string
  wordCount: number
  status: string
  directorFeedback: string | null
  directorFeedbackAt: string | null
}

interface ThesisData {
  id: string
  title: string
  subtitle: string | null
  author: string
  field: string
  university: string
  status: string
  chapters: ChapterData[]
}

interface ChatMsg { role: 'user' | 'assistant'; content: string }

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, BookOpen, FlaskConical, BarChart3, MessageSquare, GraduationCap,
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-400',
  in_progress: 'bg-amber-400',
  submitted: 'bg-sky-400',
  revised: 'bg-emerald-400',
}

// ─── Component ─────────────────────────────────────────────────
export default function Home() {
  const [thesis, setThesis] = useState<ThesisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeChapterId, setActiveChapterId] = useState<string>('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(true)
  const [helpTab, setHelpTab] = useState('guide')
  const [refsOpen, setRefsOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [literatureOpen, setLiteratureOpen] = useState(false)
  const isMobile = useIsMobile()

  // AI chat state (in help panel)
  const [aiMessages, setAiMessages] = useState<ChatMsg[]>([])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiMode, setAiMode] = useState('scientific-writing')

  // AI provider state
  const [providerSettingsOpen, setProviderSettingsOpen] = useState(false)
  const [aiProvider, setAiProvider] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('tf_provider') || 'z-ai'
    return 'z-ai'
  })
  const [aiApiKey, setAiApiKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('tf_apiKey') || ''
    return ''
  })
  const [aiBaseUrl, setAiBaseUrl] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('tf_baseUrl') || ''
    return ''
  })
  const [aiModel, setAiModel] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('tf_model') || ''
    return ''
  })

  const saveProviderSettings = useCallback(() => {
    localStorage.setItem('tf_provider', aiProvider)
    localStorage.setItem('tf_apiKey', aiApiKey)
    localStorage.setItem('tf_baseUrl', aiBaseUrl)
    localStorage.setItem('tf_model', aiModel)
    setProviderSettingsOpen(false)
  }, [aiProvider, aiApiKey, aiBaseUrl, aiModel])

  const clearProviderSettings = useCallback(() => {
    localStorage.removeItem('tf_provider')
    localStorage.removeItem('tf_apiKey')
    localStorage.removeItem('tf_baseUrl')
    localStorage.removeItem('tf_model')
    setAiProvider('z-ai')
    setAiApiKey('')
    setAiBaseUrl('')
    setAiModel('')
  }, [])

  // Director state
  const [directorLoading, setDirectorLoading] = useState(false)
  const [directorFeedback, setDirectorFeedback] = useState('')

  // Auto-save
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const localContent = useRef<string>('')

  // Load thesis on mount
  useEffect(() => {
    async function load() {
      try {
        // Seed ensures thesis exists
        await fetch('/api/thesis/seed', { method: 'POST' })
        const res = await fetch('/api/thesis')
        const data = await res.json()
        const thesisData = data.thesis || data
        if (thesisData?.id) {
          setThesis(thesisData)
          if (thesisData.chapters?.length > 0) {
            setActiveChapterId(thesisData.chapters[0].id)
          }
        }
      } catch (err) {
        console.error('Failed to load thesis:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const activeChapter = thesis?.chapters.find(c => c.id === activeChapterId)
  const chapterMeta = CHAPTERS.find(c => c.order === activeChapter?.order)
  const colors = chapterMeta ? CHAPTER_COLORS[chapterMeta.color] : CHAPTER_COLORS.emerald

  // Total word count
  const totalWords = thesis?.chapters.reduce((sum, c) => sum + c.wordCount, 0) || 0

  // ─── Auto-save handler ───────────────────────────────────
  const handleContentChange = useCallback((content: string) => {
    if (!activeChapter) return
    localContent.current = content

    // Optimistic update
    setThesis(prev => prev ? {
      ...prev,
      chapters: prev.chapters.map(c =>
        c.id === activeChapterId ? { ...c, content } : c
      ),
    } : null)

    // Debounced save
    setSaveStatus('idle')
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
 setSaveStatus('saving')
      try {
        const wordCount = content.split(/\s+/).filter(w => w.length > 0).length
        const res = await fetch(`/api/thesis/chapters/${activeChapterId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, wordCount, status: wordCount > 0 ? 'in_progress' : 'draft' }),
        })
        if (res.ok) {
          const data = await res.json()
          const updated = data.chapter || data
          setThesis(prev => prev ? {
            ...prev,
            chapters: prev.chapters.map(c => c.id === updated.id ? { ...c, ...updated } : c),
          } : null)
          setSaveStatus('saved')
          setTimeout(() => setSaveStatus('idle'), 2000)
        } else {
          setSaveStatus('error')
        }
      } catch {
        setSaveStatus('error')
      }
    }, 2000)
  }, [activeChapter, activeChapterId])

  // ─── Director submit ─────────────────────────────────────
  const handleDirectorSubmit = useCallback(async () => {
    if (!activeChapter || !chapterMeta) return
    setDirectorLoading(true)
    setDirectorFeedback('')
    try {
      const res = await fetch('/api/directeur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapitreTitre: `${chapterMeta.number}. ${chapterMeta.title}`,
          chapitreContenu: activeChapter.content,
          probleme: { quoi: 'Contenu du chapitre soumis', comment: 'Évaluation qualitative', pourquoi: 'Validation avant passage au chapitre suivant' },
          hypothese: { texte: 'Chapitre soumis pour évaluation', observation: true, verifiable: true, coherente: true },
          sousDomaineLabel: thesis?.field || 'Non précisé',
          contraintesMethodologiques: '',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDirectorFeedback(data.response)
      // Update chapter status
      await fetch(`/api/thesis/chapters/${activeChapterId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'submitted', directorFeedback: data.response }),
      })
    } catch (err) {
      setDirectorFeedback(err instanceof Error ? err.message : 'Erreur lors de la soumission.')
    } finally {
      setDirectorLoading(false)
    }
  }, [activeChapter, chapterMeta, thesis, activeChapterId])

  // ─── AI chat ────────────────────────────────────────────
  const handleAiSend = useCallback(async () => {
    if (!aiInput.trim() || aiLoading) return
    const msg = aiInput.trim()
    setAiInput('')
    const newMessages: ChatMsg[] = [...aiMessages, { role: 'user', content: msg }]
    setAiMessages(newMessages)
    setAiLoading(true)
    try {
      const reqBody: Record<string, unknown> = { mode: aiMode, message: msg, temperature: 0.7, maxTokens: 2048, thinking: 'disabled' }
      if (aiProvider !== 'z-ai') {
        reqBody.provider = aiProvider
        reqBody.apiKey = aiApiKey
        reqBody.baseUrl = aiBaseUrl
        reqBody.model = aiModel
      }
      const res = await fetch('/api/ai-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: `Erreur : ${err instanceof Error ? err.message : 'inconnue'}` }])
    } finally {
      setAiLoading(false)
    }
  }, [aiInput, aiLoading, aiMessages, aiMode])

  // ─── Render ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Chargement de votre thèse...</p>
        </div>
      </div>
    )
  }

  if (!thesis) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
          <p className="text-sm text-muted-foreground">Impossible de charger la thèse.</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm"><RefreshCw className="h-3 w-3 mr-1" />Réessayer</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 min-h-0">
        {/* ═══ LEFT SIDEBAR ═══ */}
        <aside className={cn(
          'bg-slate-900 border-r border-slate-800 flex flex-col z-40 shrink-0 transition-all duration-300 shadow-2xl',
          'w-64',
          isMobile && !sidebarOpen && 'fixed -translate-x-full',
          isMobile && sidebarOpen && 'fixed translate-x-0',
          !isMobile && 'relative',
        )}>
          {/* Brand */}
          <div className="flex items-center gap-3 px-3 py-4 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-[0_0_16px_rgba(16,185,129,0.3)] shrink-0">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm text-white tracking-tight leading-tight">ThesisFrame</h1>
              <p className="text-[10px] text-emerald-400 font-medium">{thesis.title}</p>
            </div>
            {isMobile && (
              <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-white p-1"><X className="h-4 w-4" /></button>
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
          <nav className="flex-1 overflow-y-auto space-y-0.5 px-2">
            {thesis.chapters.map((ch) => {
              const meta = CHAPTERS.find(m => m.order === ch.order)
              const isActive = ch.id === activeChapterId
              const Icon = (meta?.icon && ICON_MAP[meta.icon]) || FileText
              const chColors = meta ? CHAPTER_COLORS[meta.color] : CHAPTER_COLORS.emerald
              return (
                <button
                  key={ch.id}
                  onClick={() => { setActiveChapterId(ch.id); setSidebarOpen(false) }}
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

          {/* Tools */}
          <div className="px-3 pt-2 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Outils</span>
          </div>
          <div className="px-2 pb-3 space-y-0.5">
            <button onClick={() => setRefsOpen(true)} className="w-full p-2 flex items-center gap-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-xs">
              <Library className="h-3.5 w-3.5" /><span>Références biblio.</span>
            </button>
            <button onClick={() => setResourcesOpen(true)} className="w-full p-2 flex items-center gap-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-xs">
              <BookOpen className="h-3.5 w-3.5" /><span>Guide rédaction</span>
            </button>
            <button onClick={() => setExportOpen(true)} className="w-full p-2 flex items-center gap-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-xs">
              <Download className="h-3.5 w-3.5" /><span>Export PDF</span>
            </button>
            <button onClick={() => setLiteratureOpen(true)} className="w-full p-2 flex items-center gap-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-xs">
              <Search className="h-3.5 w-3.5" /><span>Recherche litt.</span>
            </button>
          </div>

          {/* User */}
          <div className="p-3 border-t border-slate-800">
            <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-[10px] ring-2 ring-emerald-500/30 shrink-0">DR</div>
              <div className="overflow-hidden flex-1">
                <div className="text-[10px] font-medium text-slate-200 truncate">{thesis.author}</div>
                <div className="text-[9px] text-slate-500 truncate">{thesis.university}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ═══ MAIN AREA ═══ */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chapter header bar */}
          <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center gap-3 shrink-0 z-20">
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                <Menu className="h-4 w-4" />
              </button>
            )}
            {chapterMeta && (
              <>
                <div className={cn('p-1.5 rounded-lg flex items-center justify-center', colors.light, colors.text)}>
                  {createElement(ICON_MAP[chapterMeta.icon] || FileText, { className: 'h-3.5 w-3.5' })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                      Chapitre {chapterMeta.number}. {chapterMeta.title}
                    </h2>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate">{chapterMeta.description}</p>
                </div>
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
              </>
            )}
            <button
              onClick={() => setHelpOpen(!helpOpen)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title={helpOpen ? 'Fermer le panneau' : 'Ouvrir l\'aide'}
            >
              {helpOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            </button>
          </header>

          {/* Editor + Help panel */}
          <div className="flex flex-1 min-h-0">
            {/* ── TEXT EDITOR ── */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 overflow-hidden bg-white">
                <textarea
                  value={activeChapter?.content || ''}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-full resize-none border-0 focus:outline-none p-6 sm:p-10 text-[15px] leading-[1.8] font-serif text-slate-800 bg-white placeholder:text-slate-300"
                  placeholder={`Commencez la rédaction du Chapitre ${chapterMeta?.number || 'I'}. ${chapterMeta?.title || ''}...\n\nCe que vous écrivez ici EST le texte de votre thèse.`}
                  spellCheck
                />
              </div>
            </div>

            {/* ── RIGHT HELP PANEL ── */}
            {helpOpen && !isMobile && (
              <aside className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden">
                <Tabs value={helpTab} onValueChange={setHelpTab} className="flex flex-col h-full">
                  <TabsList className="mx-3 mt-3 bg-slate-100 rounded-lg p-0.5 h-auto grid grid-cols-3">
                    <TabsTrigger value="guide" className="text-[10px] py-1.5 px-1 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm gap-0.5">
                      <ClipboardList className="h-3 w-3" /> Guide
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="text-[10px] py-1.5 px-1 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm gap-0.5">
                      <Sparkles className="h-3 w-3" /> IA
                    </TabsTrigger>
                    <TabsTrigger value="director" className="text-[10px] py-1.5 px-1 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm gap-0.5">
                      <ShieldCheck className="h-3 w-3" /> Dir.
                    </TabsTrigger>
                  </TabsList>

                  {/* ── GUIDE TAB ── */}
                  <TabsContent value="guide" className="flex-1 overflow-y-auto p-3 mt-2 space-y-4">
                    {chapterMeta && (
                      <>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                            <ListChecks className="h-3.5 w-3.5 text-emerald-600" />
                            Ce chapitre doit contenir
                          </h3>
                          <ul className="space-y-1.5">
                            {chapterMeta.expectations.map((exp, i) => (
                              <li key={i} className="text-[11px] text-slate-600 flex gap-1.5">
                                <span className="text-emerald-500 mt-0.5">•</span>
                                <span>{exp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                            Structure suggérée
                          </h3>
                          <ul className="space-y-1">
                            {chapterMeta.structure.map((s, i) => (
                              <li key={i} className="text-[11px] text-slate-500 font-mono bg-slate-50 rounded px-2 py-1">{s}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </TabsContent>

                  {/* ── AI TAB ── */}
                  <TabsContent value="ai" className="flex-1 flex flex-col min-h-0 mt-0">
                    <div className="px-3 pt-2 flex items-center gap-2">
                      <select
                        value={aiMode}
                        onChange={e => setAiMode(e.target.value)}
                        className="flex-1 text-[11px] border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                      >
                        <option value="scientific-writing">Rédaction scientifique</option>
                        <option value="literature-review">Revue de littérature</option>
                        <option value="paraphrase">Paraphrase</option>
                        <option value="peer-review">Relecture critique</option>
                        <option value="abstract">Résumé & Abstract</option>
                        <option value="hypothesis">Génération d'hypothèses</option>
                        <option value="methodo-positioning">Positionnement méthodo.</option>
                        <option value="theory-building">Construction théorique</option>
                        <option value="supervision-document">Doc. de supervision</option>
                        <option value="conference-presentation">Présentation conf.</option>
                      </select>
                      <button
                        onClick={() => setProviderSettingsOpen(true)}
                        className={cn(
                          'p-1.5 rounded-lg border transition-colors shrink-0',
                          aiProvider === 'z-ai'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100'
                        )}
                        title="Configurer le fournisseur IA"
                      >
                        <Settings className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="px-3 pt-1">
                      <Badge variant="outline" className={cn('text-[9px]', aiProvider === 'z-ai' ? 'border-emerald-300 text-emerald-700' : 'border-violet-300 text-violet-700')}>
                        {aiProvider === 'z-ai' ? 'Z.ai (par défaut)' : aiProvider.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                      {aiMessages.length === 0 && (
                        <div className="text-center py-8">
                          <Sparkles className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                          <p className="text-[11px] text-muted-foreground">Posez une question à l&apos;IA pour ce chapitre</p>
                        </div>
                      )}
                      {aiMessages.map((msg, i) => (
                        <div key={i} className={cn('text-[11px] rounded-lg p-2.5',
                          msg.role === 'user' ? 'bg-primary text-primary-foreground ml-6' : 'bg-slate-50 text-slate-700 mr-6',
                        )}>
                          <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                        </div>
                      ))}
                      {aiLoading && <Loader2 className="h-4 w-4 text-emerald-500 animate-spin mx-auto" />}
                    </div>
                    <div className="p-2 border-t">
                      <div className="flex gap-1">
                        <Textarea
                          value={aiInput}
                          onChange={e => setAiInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAiSend() } }}
                          placeholder="Votre question..."
                          className="min-h-[36px] max-h-[80px] text-[11px] resize-none"
                          rows={1}
                        />
                        <Button onClick={handleAiSend} disabled={!aiInput.trim() || aiLoading} size="icon" className="h-9 w-9 shrink-0">
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* ── DIRECTOR TAB ── */}
                  <TabsContent value="director" className="flex-1 overflow-y-auto p-3 mt-2 space-y-3">
                    <div className={cn('rounded-lg border p-3', colors.light, colors.border)}>
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className={cn('h-4 w-4', colors.text)} />
                        <span className="text-xs font-bold">Soumettre au directeur</span>
                      </div>
                      <p className="text-[10px] text-slate-600">
                        Le directeur évaluera le chapitre que vous avez rédigé et vous donnera un avis structuré.
                      </p>
                      <Button
                        onClick={handleDirectorSubmit}
                        disabled={directorLoading || !activeChapter?.content}
                        size="sm"
                        className="w-full mt-3 text-xs"
                      >
                        {directorLoading ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : <ShieldCheck className="h-3 w-3 mr-1.5" />}
                        {directorLoading ? 'Évaluation en cours...' : 'Soumettre ce chapitre'}
                      </Button>
                    </div>

                    {directorFeedback && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                          <span className="text-[11px] font-bold text-amber-800">Avis du directeur</span>
                        </div>
                        <div className="text-[11px] text-amber-900 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                          {directorFeedback}
                        </div>
                      </div>
                    )}

                    {activeChapter?.directorFeedback && !directorFeedback && (
                      <div className="rounded-lg border border-sky-200 bg-sky-50/50 p-3">
                        <span className="text-[10px] font-bold text-sky-700">Dernier avis :</span>
                        <div className="text-[11px] text-sky-900 whitespace-pre-wrap leading-relaxed mt-1 max-h-48 overflow-y-auto">
                          {activeChapter.directorFeedback}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </aside>
            )}
          </div>

          {/* Footer */}
          <footer className="border-t bg-white/80 backdrop-blur-sm px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
            <p>ThesisFrame © 2025 — {thesis.university}</p>
            <p>{thesis.field} · {(totalWords / 1000).toFixed(1)}k mots rédigés</p>
          </footer>
        </div>
      </div>

      {/* ═══ DIALOGS ═══ */}
      <Dialog open={refsOpen} onOpenChange={setRefsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base"><Library className="h-4 w-4 text-emerald-600" />Références bibliographiques</DialogTitle>
          </DialogHeader>
          <ReferencesTab />
        </DialogContent>
      </Dialog>

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base"><Download className="h-4 w-4 text-emerald-600" />Export PDF</DialogTitle>
          </DialogHeader>
          <ExportPdfContent />
        </DialogContent>
      </Dialog>

      <Dialog open={resourcesOpen} onOpenChange={setResourcesOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base"><BookOpen className="h-4 w-4 text-emerald-600" />Guide de rédaction scientifique</DialogTitle>
          </DialogHeader>
          <ArticlesGuideContent />
        </DialogContent>
      </Dialog>

      {/* ═══ LITERATURE SEARCH DIALOG ═══ */}
      <Dialog open={literatureOpen} onOpenChange={setLiteratureOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base"><Search className="h-4 w-4 text-emerald-600" />Recherche de littérature scientifique</DialogTitle>
          </DialogHeader>
          <LiteratureSearch />
        </DialogContent>
      </Dialog>

      {/* ═══ AI PROVIDER SETTINGS DIALOG ═══ */}
      <Dialog open={providerSettingsOpen} onOpenChange={setProviderSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4 text-violet-600" />
              Fournisseur IA
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Fournisseur</Label>
              <Select value={aiProvider} onValueChange={v => {
                setAiProvider(v)
                if (v === 'mistral') { setAiBaseUrl('https://api.mistral.ai/v1'); setAiModel('mistral-large-latest') }
                else if (v === 'openai') { setAiBaseUrl('https://api.openai.com/v1'); setAiModel('gpt-4o') }
                else if (v === 'anthropic') { setAiBaseUrl('https://api.anthropic.com/v1'); setAiModel('claude-sonnet-4-20250514') }
                else if (v === 'groq') { setAiBaseUrl('https://api.groq.com/openai/v1'); setAiModel('llama-3.3-70b-versatile') }
                else if (v === 'ollama') { setAiBaseUrl('http://localhost:11434/v1'); setAiModel('llama3') }
                else if (v === 'custom') { setAiBaseUrl(''); setAiModel('') }
              }}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="z-ai">Z.ai (intégré, recommandé)</SelectItem>
                  <SelectItem value="mistral">Mistral AI</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                  <SelectItem value="groq">Groq</SelectItem>
                  <SelectItem value="ollama">Ollama (local)</SelectItem>
                  <SelectItem value="custom">Personnalisé (OpenAI-compat.)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {aiProvider !== 'z-ai' && (
              <>
                <div className="rounded-lg bg-violet-50 border border-violet-200 p-3">
                  <p className="text-xs text-violet-800">
                    <strong>Configuration requise.</strong> Votre clé API est stockée uniquement dans votre navigateur (localStorage) et n'est jamais envoyée à nos serveurs — elle transite directement vers le fournisseur choisi.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Clé API *</Label>
                  <Input
                    type="password"
                    value={aiApiKey}
                    onChange={e => setAiApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">URL de base *</Label>
                  <Input
                    value={aiBaseUrl}
                    onChange={e => setAiBaseUrl(e.target.value)}
                    placeholder="https://api.example.com/v1"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Modèle *</Label>
                  <Input
                    value={aiModel}
                    onChange={e => setAiModel(e.target.value)}
                    placeholder="gpt-4o, mistral-large-latest, ..."
                    className="h-9 text-sm"
                  />
                </div>
              </>
            )}

            {aiProvider === 'z-ai' && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                <p className="text-xs text-emerald-800">
                  Le fournisseur <strong>Z.ai</strong> est utilisé par défaut. Aucune configuration supplémentaire n'est nécessaire.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={clearProviderSettings}>
                <Trash2 className="h-3 w-3 mr-1" />Réinitialiser
              </Button>
              <Button size="sm" className="text-xs" onClick={saveProviderSettings}>
                <Check className="h-3 w-3 mr-1" />Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
