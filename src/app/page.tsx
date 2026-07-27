'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Loader2, AlertTriangle, RefreshCw, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { CHAPTERS, CHAPTER_COLORS } from '@/data/chapters-structure'
import { isDesktop } from '@/lib/tauri'
import type { ThesisData, ChatMsg } from '@/types/thesis'

import SidebarNav from '@/components/thesis/workspace/sidebar-nav'
import ChapterHeader from '@/components/thesis/workspace/chapter-header'
import ChapterEditor from '@/components/thesis/workspace/chapter-editor'
import HelpPanel from '@/components/thesis/workspace/help-panel'
import ProviderSettingsDialog from '@/components/thesis/workspace/provider-settings-dialog'
import FeatureDialogs from '@/components/thesis/workspace/feature-dialogs'

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
  const [balanceOpen, setBalanceOpen] = useState(false)
  const [cloudDriveOpen, setCloudDriveOpen] = useState(false)
  const [journalFinderOpen, setJournalFinderOpen] = useState(false)
  const isMobile = useIsMobile()
  const [desktopMode, setDesktopMode] = useState(false)
  const desktopBadge = desktopMode ? (
    <span className="inline-flex items-center gap-0.5 ml-1.5 px-1 py-0 rounded bg-emerald-100 text-emerald-700 font-medium">
      <Monitor className="h-2.5 w-2.5" />Desktop
    </span>
  ) : null

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

  // Semantic Scholar API key (1 req/s guaranteed with key)
  const [s2ApiKey, setS2ApiKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('tf_s2ApiKey') || ''
    return ''
  })

  // Consensus AI API key
  const [consensusApiKey, setConsensusApiKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('tf_consensusApiKey') || ''
    return ''
  })

  const saveProviderSettings = useCallback(() => {
    localStorage.setItem('tf_provider', aiProvider)
    localStorage.setItem('tf_apiKey', aiApiKey)
    localStorage.setItem('tf_baseUrl', aiBaseUrl)
    localStorage.setItem('tf_model', aiModel)
    localStorage.setItem('tf_s2ApiKey', s2ApiKey)
    localStorage.setItem('tf_consensusApiKey', consensusApiKey)
    setProviderSettingsOpen(false)
  }, [aiProvider, aiApiKey, aiBaseUrl, aiModel, s2ApiKey, consensusApiKey])

  const clearProviderSettings = useCallback(() => {
    localStorage.removeItem('tf_provider')
    localStorage.removeItem('tf_apiKey')
    localStorage.removeItem('tf_baseUrl')
    localStorage.removeItem('tf_model')
    localStorage.removeItem('tf_s2ApiKey')
    localStorage.removeItem('tf_consensusApiKey')
    setAiProvider('z-ai')
    setAiApiKey('')
    setAiBaseUrl('')
    setAiModel('')
    setS2ApiKey('')
    setConsensusApiKey('')
  }, [])

  // Director state
  const [directorLoading, setDirectorLoading] = useState(false)
  const [directorFeedback, setDirectorFeedback] = useState('')

  // Auto-save
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const localContent = useRef<string>('')

  // Detect Tauri desktop environment
  useEffect(() => { setDesktopMode(isDesktop()) }, [])

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

  // ─── Chapter management ──────────────────────────────────
  const refreshThesis = useCallback(async () => {
    try {
      const res = await fetch('/api/thesis')
      const data = await res.json()
      const thesisData = data.thesis || data
      if (thesisData?.id) {
        setThesis(thesisData)
      }
    } catch (err) {
      console.error('Failed to refresh thesis:', err)
    }
  }, [])

  const handleAddChapter = useCallback(async (insertAfterOrder: number) => {
    try {
      const res = await fetch('/api/thesis/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Nouveau chapitre', insertAfterOrder }),
      })
      if (res.ok) {
        const chapter = await res.json()
        // Refresh thesis to get updated chapters list
        const thesisRes = await fetch('/api/thesis')
        const thesisData = (await thesisRes.json()).thesis || (await thesisRes.json())
        if (thesisData?.id) {
          setThesis(thesisData)
          setActiveChapterId(chapter.id)
        }
      }
    } catch (err) {
      console.error('Failed to add chapter:', err)
    }
  }, [])

  const handleDeleteChapter = useCallback(async (chapterId: string) => {
    try {
      const res = await fetch(`/api/thesis/chapters/${chapterId}`, { method: 'DELETE' })
      if (res.ok) {
        const thesisData = await res.json()
        setThesis(thesisData)
        // If deleted chapter was active, select first remaining
        if (activeChapterId === chapterId) {
          const remaining = thesisData.chapters
          setActiveChapterId(remaining.length > 0 ? remaining[0].id : '')
        }
      }
    } catch (err) {
      console.error('Failed to delete chapter:', err)
    }
  }, [activeChapterId])

  const handleReorderChapter = useCallback(async (chapterId: string, direction: 'up' | 'down') => {
    try {
      const res = await fetch('/api/thesis/chapters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId, direction }),
      })
      if (res.ok) {
        const thesisData = await res.json()
        setThesis(thesisData)
      }
    } catch (err) {
      console.error('Failed to reorder chapter:', err)
    }
  }, [])

  const handleRenameChapter = useCallback(async (chapterId: string, newTitle: string) => {
    try {
      const res = await fetch(`/api/thesis/chapters/${chapterId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      })
      if (res.ok) {
        const updated = await res.json()
        setThesis(prev => prev ? {
          ...prev,
          chapters: prev.chapters.map(c => c.id === updated.id ? { ...c, ...updated } : c),
        } : null)
      }
    } catch (err) {
      console.error('Failed to rename chapter:', err)
    }
  }, [])

  // ─── Director submit ─────────────────────────────────────
  const handleDirectorSubmit = useCallback(async () => {
    if (!activeChapter) return
    setDirectorLoading(true)
    setDirectorFeedback('')
    try {
      const res = await fetch('/api/directeur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapitreTitre: chapterMeta ? `${chapterMeta.number}. ${chapterMeta.title}` : `${activeChapter.number}. ${activeChapter.title}`,
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
  }, [aiInput, aiLoading, aiMessages, aiMode, aiProvider, aiApiKey, aiBaseUrl, aiModel])

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
        <SidebarNav
          thesis={thesis}
          activeChapterId={activeChapterId}
          onSelectChapter={setActiveChapterId}
          sidebarOpen={sidebarOpen}
          onCloseSidebar={() => setSidebarOpen(false)}
          isMobile={isMobile}
          totalWords={totalWords}
          onOpenRefs={() => setRefsOpen(true)}
          onOpenResources={() => setResourcesOpen(true)}
          onOpenExport={() => setExportOpen(true)}
          onOpenLiterature={() => setLiteratureOpen(true)}
          onOpenBalance={() => setBalanceOpen(true)}
          onOpenCloudDrive={() => setCloudDriveOpen(true)}
          onOpenJournalFinder={() => setJournalFinderOpen(true)}
          onAddChapter={handleAddChapter}
          onDeleteChapter={handleDeleteChapter}
          onReorderChapter={handleReorderChapter}
          onRenameChapter={handleRenameChapter}
        />

        {/* ═══ MAIN AREA ═══ */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChapterHeader
            isMobile={isMobile}
            onOpenSidebar={() => setSidebarOpen(true)}
            chapterMeta={chapterMeta}
            colors={colors}
            activeChapter={activeChapter}
            saveStatus={saveStatus}
            helpOpen={helpOpen}
            onToggleHelp={() => setHelpOpen(!helpOpen)}
          />

          {/* Editor + Help panel */}
          <div className="flex flex-1 min-h-0">
            <ChapterEditor
              content={activeChapter?.content || ''}
              onChange={handleContentChange}
              chapterNumber={chapterMeta?.number || activeChapter?.number || ''}
              chapterTitle={chapterMeta?.title || activeChapter?.title || ''}
            />

            {helpOpen && !isMobile && (
              <HelpPanel
                helpTab={helpTab}
                onHelpTabChange={setHelpTab}
                chapterMeta={chapterMeta}
                colors={colors}
                thesis={thesis}
                activeChapter={activeChapter}
                aiMode={aiMode}
                onAiModeChange={setAiMode}
                aiProvider={aiProvider}
                onOpenProviderSettings={() => setProviderSettingsOpen(true)}
                aiMessages={aiMessages}
                aiLoading={aiLoading}
                aiInput={aiInput}
                onAiInputChange={setAiInput}
                onAiSend={handleAiSend}
                onDirectorSubmit={handleDirectorSubmit}
                directorLoading={directorLoading}
                directorFeedback={directorFeedback}
              />
            )}
          </div>

          {/* Footer */}
          <footer className="border-t bg-white/80 backdrop-blur-sm px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
            <p>ThesisFrame © 2025 — {thesis.university}{desktopBadge}</p>
            <p>{thesis.field} · {(totalWords / 1000).toFixed(1)}k mots rédigés</p>
          </footer>
        </div>
      </div>

      <FeatureDialogs
        thesis={thesis}
        refsOpen={refsOpen}
        setRefsOpen={setRefsOpen}
        exportOpen={exportOpen}
        setExportOpen={setExportOpen}
        resourcesOpen={resourcesOpen}
        setResourcesOpen={setResourcesOpen}
        cloudDriveOpen={cloudDriveOpen}
        setCloudDriveOpen={setCloudDriveOpen}
        balanceOpen={balanceOpen}
        setBalanceOpen={setBalanceOpen}
        literatureOpen={literatureOpen}
        setLiteratureOpen={setLiteratureOpen}
        journalFinderOpen={journalFinderOpen}
        setJournalFinderOpen={setJournalFinderOpen}
        s2ApiKey={s2ApiKey}
        consensusApiKey={consensusApiKey}
      />

      <ProviderSettingsDialog
        open={providerSettingsOpen}
        onOpenChange={setProviderSettingsOpen}
        aiProvider={aiProvider}
        setAiProvider={setAiProvider}
        aiApiKey={aiApiKey}
        setAiApiKey={setAiApiKey}
        aiBaseUrl={aiBaseUrl}
        setAiBaseUrl={setAiBaseUrl}
        aiModel={aiModel}
        setAiModel={setAiModel}
        s2ApiKey={s2ApiKey}
        setS2ApiKey={setS2ApiKey}
        consensusApiKey={consensusApiKey}
        setConsensusApiKey={setConsensusApiKey}
        onSave={saveProviderSettings}
        onClear={clearProviderSettings}
      />
    </div>
  )
}
