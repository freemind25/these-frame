'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { CHAPTERS, CHAPTER_COLORS } from '@/data/chapters-structure'
import type { ThesisData, ChatMsg } from '@/types/thesis'

import ToolsSidebar from '@/components/thesis/workspace/tools-sidebar'
import HorizontalChapterTabs from '@/components/thesis/workspace/horizontal-chapter-tabs'
import ChapterHeader from '@/components/thesis/workspace/chapter-header'
import TiptapEditor from '@/components/thesis/tiptap-editor'
import HelpPanel from '@/components/thesis/workspace/help-panel'
import ProviderSettingsDialog from '@/components/thesis/workspace/provider-settings-dialog'
import FeatureDialogs from '@/components/thesis/workspace/feature-dialogs'
import TemplateDialog from '@/components/thesis/workspace/template-dialog'
import ThesisAssistantChat from '@/components/thesis/thesis-assistant-chat'
import DirecteurChat from '@/components/thesis/directeur-chat'
import CadragePanel from '@/components/thesis/cadrage-panel'
import OfficeExportTab from '@/components/thesis/office-export-tab'
import AutomationPanel from '@/components/thesis/automation-panel'
import IthyResearchPanel from '@/components/thesis/ithy-research'
import AgileRoadmapPanel from '@/components/thesis/agile-roadmap'
import WritingUnblockPanel from '@/components/thesis/writing-unblock-panel'
import ResourcesPanel from '@/components/thesis/resources-panel'
import ResearchResourcesPanel from '@/components/thesis/research-resources-panel'
import ResearchFieldAnalysisPanel from '@/components/thesis/research-field-analysis-panel'
import ApaResultsComposer from '@/components/thesis/apa-results-composer'
import SlrProtocolPanel from '@/components/thesis/slr-protocol-panel'
import DoctoralToolkitPanel from '@/components/thesis/doctoral-toolkit-panel'
import BoxDrivePanel from '@/components/thesis/box-drive-panel'
import UsageGuidePanel from '@/components/thesis/usage-guide-panel'
import BookSkillsPanel from '@/components/thesis/book-skills-panel'
import LicenseAdminPanel from '@/components/thesis/license-admin-panel'
import AuthProviderPanel from '@/components/thesis/auth-provider-panel'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { KeyRound, Shield } from 'lucide-react'

// ─── Shared constants ───
const ROMAN_NUMERALS = ['I','II','III','IV','V','VI','VII','VIII','IX','X']

// ─── Client-side mock thesis (instant rendering, no API needed) ───
function createLocalThesis(): ThesisData {
  return {
    id: 'local-thesis-001',
    title: 'Ma thèse de doctorat',
    subtitle: 'Sous-titre de la thèse',
    author: 'Doctorant',
    field: 'Sciences',
    university: 'Université de démonstration',
    status: 'draft' as const,
    structureMode: 'chapters',
    chapters: CHAPTERS.map((ch, i) => ({
      id: `local-ch-${ch.order}`,
      thesisId: 'local-thesis-001',
      partId: null,
      order: ch.order,
      number: ch.number,
      title: ch.title,
      content: i === 0
        ? `# ${ch.title}\n\n${ch.description}\n\n## 1.1 Contexte général du domaine\n\nCommencez à rédiger ici...`
        : '',
      wordCount: i === 0 ? 42 : 0,
      status: i === 0 ? 'in_progress' : 'draft',
      directorFeedback: null,
      directorFeedbackAt: null,
    })),
    parts: [],
  }
}

// ─── Component ─────────────────────────────────────────────────
export default function Home() {
  // Initialize with local mock data IMMEDIATELY — no loading state needed
  const localThesis = useRef<ThesisData>(createLocalThesis())
  const [thesis, setThesis] = useState<ThesisData>(localThesis.current)
  const [activeChapterId, setActiveChapterId] = useState<string>(localThesis.current.chapters[0]?.id || '')
  const [loading, setLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected'>('unknown')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

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
  const [templateOpen, setTemplateOpen] = useState(false)
  const [excalidrawOpen, setExcalidrawOpen] = useState(false)
  const [grammarOpen, setGrammarOpen] = useState(false)
  const [harperOpen, setHarperOpen] = useState(false)
  const [autoEditionOpen, setAutoEditionOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [directeurOpen, setDirecteurOpen] = useState(false)
  const [cadrageOpen, setCadrageOpen] = useState(false)
  const [officeOpen, setOfficeOpen] = useState(false)
  const [automationOpen, setAutomationOpen] = useState(false)
  const [ithyResearchOpen, setIthyResearchOpen] = useState(false)
  const [agileRoadmapOpen, setAgileRoadmapOpen] = useState(false)
  const [writingUnblockOpen, setWritingUnblockOpen] = useState(false)
  const [bookSkillsOpen, setBookSkillsOpen] = useState(false)
  const [researchResourcesOpen, setResearchResourcesOpen] = useState(false)
  const [fieldAnalysisOpen, setFieldAnalysisOpen] = useState(false)
  const [apaComposerOpen, setApaComposerOpen] = useState(false)
  const [slrProtocolOpen, setSlrProtocolOpen] = useState(false)
  const [doctoralToolkitOpen, setDoctoralToolkitOpen] = useState(false)
  const [boxDriveOpen, setBoxDriveOpen] = useState(false)
  const [usageGuideOpen, setUsageGuideOpen] = useState(false)
  const [licenseAdminOpen, setLicenseAdminOpen] = useState(false)
  const [authProvidersOpen, setAuthProvidersOpen] = useState(false)
  const [activeBookIds, setActiveBookIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tf_activeBookIds')
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  const toggleActiveBook = useCallback((bookId: string) => {
    setActiveBookIds(prev => {
      const next = prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : prev.length >= 3 ? prev : [...prev, bookId]
      localStorage.setItem('tf_activeBookIds', JSON.stringify(next))
      return next
    })
  }, [])

  const [editorMode, setEditorMode] = useState<'rich' | 'plain'>('rich')
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

  // Semantic Scholar API key
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


  // Try to load thesis from API (non-blocking — page already shows local data)
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000) // 5s timeout

        await fetch('/api/thesis/seed', { method: 'POST', signal: controller.signal })
        const res = await fetch('/api/thesis', { signal: controller.signal })
        clearTimeout(timeout)

        if (cancelled) return
        const data = await res.json()
        const thesisData = data.thesis || data
        if (thesisData?.id) {
          setThesis(thesisData)
          if (thesisData.chapters?.length > 0) {
            setActiveChapterId(thesisData.chapters[0].id)
          }
          setApiStatus('connected')
        }
      } catch {
        // API unavailable — silently use local data
        if (!cancelled) setApiStatus('unknown')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const activeChapter = thesis?.chapters.find(c => c.id === activeChapterId)
  const activePart = activeChapter?.partId
    ? thesis?.parts.find(p => p.id === activeChapter.partId) ?? null
    : null
  const chapterMeta = CHAPTERS.find(c => c.order === activeChapter?.order)
  const colors = chapterMeta ? CHAPTER_COLORS[chapterMeta.color] : CHAPTER_COLORS.emerald

  // Total word count
  const totalWords = thesis?.chapters.reduce((sum, c) => sum + c.wordCount, 0) || 0

  // ─── Auto-save handler ───────────────────────────────────
  const activeChapterIdRef = useRef(activeChapterId)
  activeChapterIdRef.current = activeChapterId

  const handleContentChange = useCallback((content: string) => {
    if (!activeChapter) return
    localContent.current = content

    // Optimistic update
    setThesis(prev => prev ? {
      ...prev,
      chapters: prev.chapters.map(c =>
        c.id === activeChapterId ? { ...c, content } : c
      ),
    } : prev)

    // Mark as having unsaved changes
    setHasUnsavedChanges(true)

    // Debounced save — capture chapterId at call time to avoid stale closure
    setSaveStatus('idle')
    if (saveTimer.current) clearTimeout(saveTimer.current)
    const chapterIdToSave = activeChapterId
    saveTimer.current = setTimeout(async () => {
      setSaveStatus('saving')
      try {
        const wordCount = content.split(/\s+/).filter(w => w.length > 0).length
        const res = await fetch(`/api/thesis/chapters/${chapterIdToSave}`, {
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
          } : prev)
          setSaveStatus('saved')
          setHasUnsavedChanges(false)
          setTimeout(() => setSaveStatus('idle'), 2000)
        } else {
          setSaveStatus('error')
        }
      } catch {
        setSaveStatus('error')
      }
    }, 2000)
  }, [activeChapter, activeChapterId])

  // ─── Dictation handler ───────────────────────────────
  const handleDictated = useCallback((text: string) => {
    if (!activeChapter) return
    const current = thesis?.chapters.find(c => c.id === activeChapter.id)
    const separator = current?.content && current.content.trim().length > 0 ? ' ' : ''
    handleContentChange((current?.content || '') + separator + text)
  }, [activeChapter, thesis, handleContentChange])

  // ─── Chapter management (with local fallback) ───────────
  const refreshThesis = useCallback(async () => {
    try {
      const res = await fetch('/api/thesis')
      const data = await res.json()
      const thesisData = data.thesis || data
      if (thesisData?.id) setThesis(thesisData)
    } catch (err) {
      console.error('Failed to refresh thesis:', err)
    }
  }, [])

  const handleAddChapter = useCallback(async (insertAfterOrder: number, partId?: string) => {
    try {
      const res = await fetch('/api/thesis/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Nouveau chapitre', insertAfterOrder, partId }),
      })
      if (res.ok) {
        const chapter = await res.json()
        const thesisRes = await fetch('/api/thesis')
        const thesisData = (await thesisRes.json()).thesis || (await thesisRes.json())
        if (thesisData?.id) {
          setThesis(thesisData)
          setActiveChapterId(chapter.id)
        }
        return
      }
    } catch (err) {
      console.error('Failed to add chapter via API, using local fallback:', err)
    }
    // Local fallback
    const newId = `local-ch-new-${Date.now()}`
    const newOrder = insertAfterOrder + 1
    setThesis(prev => ({
      ...prev,
      chapters: [
        ...prev.chapters.map(c => c.order > insertAfterOrder ? { ...c, order: c.order + 1 } : c),
        { id: newId, thesisId: prev.id, partId: partId || null, order: newOrder, number: `${newOrder}`, title: 'Nouveau chapitre', content: '', wordCount: 0, status: 'draft' as const, directorFeedback: null, directorFeedbackAt: null },
      ].sort((a, b) => a.order - b.order),
    }))
    setActiveChapterId(newId)
  }, [])

  const handleDeleteChapter = useCallback(async (chapterId: string) => {
    try {
      const res = await fetch(`/api/thesis/chapters/${chapterId}`, { method: 'DELETE' })
      if (res.ok) {
        const thesisData = await res.json()
        setThesis(thesisData)
        if (activeChapterId === chapterId) {
          const remaining = thesisData.chapters
          setActiveChapterId(remaining.length > 0 ? remaining[0].id : '')
        }
        return
      }
    } catch (err) {
      console.error('Failed to delete chapter via API, using local fallback:', err)
    }
    // Local fallback
    setThesis(prev => {
      const remaining = prev.chapters.filter(c => c.id !== chapterId)
      if (activeChapterId === chapterId && remaining.length > 0) {
        setActiveChapterId(remaining[0].id)
      } else if (activeChapterId === chapterId) {
        setActiveChapterId('')
      }
      return { ...prev, chapters: remaining }
    })
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
        return
      }
    } catch (err) {
      console.error('Failed to reorder chapter via API, using local fallback:', err)
    }
    // Local fallback
    setThesis(prev => {
      const chapters = [...prev.chapters].sort((a, b) => a.order - b.order)
      const idx = chapters.findIndex(c => c.id === chapterId)
      if (idx < 0) return prev
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= chapters.length) return prev
      const temp = chapters[idx].order
      chapters[idx] = { ...chapters[idx], order: chapters[swapIdx].order }
      chapters[swapIdx] = { ...chapters[swapIdx], order: temp }
      return { ...prev, chapters: chapters.sort((a, b) => a.order - b.order) }
    })
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
        } : prev)
        return
      }
    } catch (err) {
      console.error('Failed to rename chapter via API, using local fallback:', err)
    }
    // Local fallback
    setThesis(prev => prev ? {
      ...prev,
      chapters: prev.chapters.map(c => c.id === chapterId ? { ...c, title: newTitle } : c),
    } : prev)
  }, [])

  // ─── Part management (with local fallback) ──────────────
  const handleAddPart = useCallback(async () => {
    try {
      const partNum = (thesis?.parts?.length || 0) + 1
      const title = `Partie ${partNum <= 10 ? ROMAN_NUMERALS[partNum - 1] : partNum}`
      const res = await fetch('/api/thesis/parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (res.ok) {
        const thesisData = await res.json()
        if (thesisData?.id) { setThesis(thesisData); return }
      }
    } catch (err) {
      console.error('Failed to add part via API, using local fallback:', err)
    }
    // Local fallback
    const newPartId = `local-part-${Date.now()}`
    const partOrder = (thesis?.parts?.length || 0) + 1
    setThesis(prev => ({
      ...prev,
      parts: [...prev.parts, { id: newPartId, thesisId: prev.id, title: `Partie ${partOrder <= 10 ? ROMAN_NUMERALS[partOrder - 1] : partOrder}`, order: partOrder, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
    }))
  }, [thesis?.parts?.length])

  const handleDeletePart = useCallback(async (partId: string) => {
    try {
      const res = await fetch(`/api/thesis/parts/${partId}`, { method: 'DELETE' })
      if (res.ok) {
        const thesisData = await res.json()
        setThesis(thesisData)
        return
      }
    } catch (err) {
      console.error('Failed to delete part via API, using local fallback:', err)
    }
    setThesis(prev => ({ ...prev, parts: prev.parts.filter(p => p.id !== partId) }))
  }, [])

  const handleRenamePart = useCallback(async (partId: string, newTitle: string) => {
    try {
      await fetch('/api/thesis/parts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partId, title: newTitle }),
      })
    } catch (err) {
      console.error('Failed to rename part:', err)
    }
    setThesis(prev => prev ? {
      ...prev,
      parts: prev.parts.map(p => p.id === partId ? { ...p, title: newTitle } : p),
    } : prev)
  }, [])

  const handleReorderPart = useCallback(async (partId: string, direction: 'up' | 'down') => {
    try {
      const res = await fetch('/api/thesis/parts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partId, direction }),
      })
      if (res.ok) {
        const thesisData = await res.json()
        setThesis(thesisData)
        return
      }
    } catch (err) {
      console.error('Failed to reorder part via API, using local fallback:', err)
    }
    // Local fallback
    setThesis(prev => {
      const parts = [...prev.parts].sort((a, b) => a.order - b.order)
      const idx = parts.findIndex(p => p.id === partId)
      if (idx < 0) return prev
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= parts.length) return prev
      const temp = parts[idx].order
      parts[idx] = { ...parts[idx], order: parts[swapIdx].order }
      parts[swapIdx] = { ...parts[swapIdx], order: temp }
      return { ...prev, parts: parts.sort((a, b) => a.order - b.order) }
    })
  }, [])

  const handleSwitchMode = useCallback(async (mode: 'chapters' | 'parts') => {
    try {
      const res = await fetch('/api/thesis/switch-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      })
      if (res.ok) {
        const thesisData = await res.json()
        setThesis(thesisData)
        return
      }
    } catch (err) {
      console.error('Failed to switch mode via API, using local fallback:', err)
    }
    // Local fallback
    setThesis(prev => ({ ...prev, structureMode: mode }))
  }, [])

  // ─── Template management ──────────────────────────────
  const handleApplyTemplate = useCallback(async (templateId: string) => {
    try {
      const res = await fetch('/api/thesis/apply-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })
      if (res.ok) {
        const thesisData = await res.json()
        setThesis(thesisData)
        if (thesisData.chapters?.length > 0) {
          setActiveChapterId(thesisData.chapters[0].id)
        }
        return
      }
    } catch (err) {
      console.error('Failed to apply template:', err)
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

  // ─── Insert text into active chapter (shared by 3 panels) ───
  const handleInsertText = useCallback((text: string) => {
    const currentContent = activeChapter?.content || ''
    const newContent = currentContent ? currentContent + '\n\n' + text : text
    handleContentChange(newContent)
  }, [activeChapter?.content, handleContentChange])

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

  // ─── Keyboard shortcuts (only outside editor) ────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Skip if user is typing in an input/textarea/editor
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return

      const mod = e.ctrlKey || e.metaKey
      if (!mod) return

      // Ctrl/Cmd + S → trigger save (prevent browser dialog)
      if (e.key === 's' && !e.shiftKey) {
        e.preventDefault()
        // Force the debounced save to fire immediately
        if (saveTimer.current) {
          clearTimeout(saveTimer.current)
          saveTimer.current = null
        }
        const chapterIdToSave = activeChapterIdRef.current
        const currentContent = localContent.current
        if (chapterIdToSave && currentContent !== undefined) {
          handleContentChange(currentContent)
        }
        return
      }

      // Ctrl/Cmd + Shift + [ → previous chapter
      if (e.key === '[' && e.shiftKey) {
        e.preventDefault()
        setThesis(prev => {
          if (!prev) return prev
          const chapters = [...prev.chapters].sort((a, b) => a.order - b.order)
          const idx = chapters.findIndex(c => c.id === activeChapterId)
          if (idx > 0) setActiveChapterId(chapters[idx - 1].id)
          return prev
        })
        return
      }

      // Ctrl/Cmd + Shift + ] → next chapter
      if (e.key === ']' && e.shiftKey) {
        e.preventDefault()
        setThesis(prev => {
          if (!prev) return prev
          const chapters = [...prev.chapters].sort((a, b) => a.order - b.order)
          const idx = chapters.findIndex(c => c.id === activeChapterId)
          if (idx >= 0 && idx < chapters.length - 1) setActiveChapterId(chapters[idx + 1].id)
          return prev
        })
        return
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeChapterId, handleContentChange])

  // ─── Warn on unsaved changes ────────────────────────
  useEffect(() => {
    if (!hasUnsavedChanges) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasUnsavedChanges])

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      {/* ── API OFFLINE BANNER ── */}


      <div className="flex flex-1 min-h-0">
        {/* ═══ TOOLS SIDEBAR (left, tools only) ═══ */}
        <ToolsSidebar
          thesis={thesis}
          totalWords={totalWords}
          sidebarOpen={sidebarOpen}
          onCloseSidebar={() => setSidebarOpen(false)}
          isMobile={isMobile}
          editorMode={editorMode}
          onOpenAssistant={() => setAssistantOpen(true)}
          onOpenDirecteur={() => setDirecteurOpen(true)}
          onOpenRefs={() => setRefsOpen(true)}
          onOpenResources={() => setResourcesOpen(true)}
          onOpenExport={() => setExportOpen(true)}
          onOpenLiterature={() => setLiteratureOpen(true)}
          onOpenBalance={() => setBalanceOpen(true)}
          onOpenCloudDrive={() => setCloudDriveOpen(true)}
          onOpenJournalFinder={() => setJournalFinderOpen(true)}
          onOpenExcalidraw={() => setExcalidrawOpen(true)}
          onOpenGrammar={() => setGrammarOpen(true)}
          onOpenHarper={() => setHarperOpen(true)}
          onOpenAutoEdition={() => setAutoEditionOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenCadrage={() => setCadrageOpen(true)}
          onOpenOffice={() => setOfficeOpen(true)}
          onOpenAutomation={() => setAutomationOpen(true)}
          onOpenIthyResearch={() => setIthyResearchOpen(true)}
          onOpenAgileRoadmap={() => setAgileRoadmapOpen(true)}
          onOpenWritingUnblock={() => setWritingUnblockOpen(true)}
          onOpenBookSkills={() => setBookSkillsOpen(true)}
          onOpenResearchResources={() => setResearchResourcesOpen(true)}
          onOpenFieldAnalysis={() => setFieldAnalysisOpen(true)}
          onOpenApaComposer={() => setApaComposerOpen(true)}
          onOpenSlrProtocol={() => setSlrProtocolOpen(true)}
          onOpenDoctoralToolkit={() => setDoctoralToolkitOpen(true)}
          onOpenBoxDrive={() => setBoxDriveOpen(true)}
          onOpenUsageGuide={() => setUsageGuideOpen(true)}
          onOpenLicenseAdmin={() => setLicenseAdminOpen(true)}
          onOpenAuthProviders={() => setAuthProvidersOpen(true)}
          onToggleEditorMode={() => setEditorMode(m => m === 'rich' ? 'plain' : 'rich')}
          onSwitchMode={handleSwitchMode}
          onOpenTemplates={() => setTemplateOpen(true)}
        />

        {/* ═══ MAIN AREA ═══ */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChapterHeader
          isMobile={isMobile}
          onOpenSidebar={() => setSidebarOpen(true)}
          chapterMeta={chapterMeta}
          colors={colors}
          activeChapter={activeChapter}
          activePart={activePart}
          saveStatus={saveStatus}
          helpOpen={helpOpen}
          onToggleHelp={() => setHelpOpen(!helpOpen)}
          onDictated={handleDictated}
        />

          {/* ═══ HORIZONTAL CHAPTER TABS ═══ */}
          <HorizontalChapterTabs
            thesis={thesis}
            activeChapterId={activeChapterId}
            onSelectChapter={setActiveChapterId}
            onAddChapter={handleAddChapter}
            onDeleteChapter={handleDeleteChapter}
            onReorderChapter={handleReorderChapter}
            onRenameChapter={handleRenameChapter}
            onAddPart={handleAddPart}
            onDeletePart={handleDeletePart}
            onRenamePart={handleRenamePart}
          />

          {/* Editor + Help panel */}
          <div className="flex flex-1 min-h-0">
            {editorMode === 'rich' ? (
              <TiptapEditor
                content={activeChapter?.content || ''}
                onChange={handleContentChange}
                chapterNumber={chapterMeta?.number || activeChapter?.number || ''}
                chapterTitle={chapterMeta?.title || activeChapter?.title || ''}
                aiProvider={aiProvider}
              />
            ) : (
              <textarea
                value={activeChapter?.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
                className="flex-1 resize-none border-0 focus:outline-none p-6 sm:p-10 text-[15px] leading-[1.8] font-serif text-slate-800 bg-white placeholder:text-slate-300"
                placeholder={`Commencez la redaction du Chapitre ${chapterMeta?.number || 'I'}. ${chapterMeta?.title || ''}...`}
                spellCheck
              />
            )}

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
            <p>ThesisFrame © 2025 — {thesis.university}</p>
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
        cloudDriveOpen={cloudDriveOpen}
        setCloudDriveOpen={setCloudDriveOpen}
        balanceOpen={balanceOpen}
        setBalanceOpen={setBalanceOpen}
        literatureOpen={literatureOpen}
        setLiteratureOpen={setLiteratureOpen}
        journalFinderOpen={journalFinderOpen}
        setJournalFinderOpen={setJournalFinderOpen}
        excalidrawOpen={excalidrawOpen}
        setExcalidrawOpen={setExcalidrawOpen}
        grammarOpen={grammarOpen}
        setGrammarOpen={setGrammarOpen}
        harperOpen={harperOpen}
        setHarperOpen={setHarperOpen}
        autoEditionOpen={autoEditionOpen}
        setAutoEditionOpen={setAutoEditionOpen}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        officeOpen={officeOpen}
        setOfficeOpen={setOfficeOpen}
        activeChapter={activeChapter}
        onContentChange={handleContentChange}
        onSelectChapter={setActiveChapterId}
        editorMode={editorMode}
        onToggleEditorMode={() => setEditorMode(m => m === 'rich' ? 'plain' : 'rich')}
        s2ApiKey={s2ApiKey}
        consensusApiKey={consensusApiKey}
      />

      <TemplateDialog
        open={templateOpen}
        onOpenChange={setTemplateOpen}
        onApply={handleApplyTemplate}
      />

      <ThesisAssistantChat
        open={assistantOpen}
        onOpenChange={setAssistantOpen}
        chapterNumber={chapterMeta?.number || activeChapter?.number}
        chapterTitle={chapterMeta?.title || activeChapter?.title}
        chapterContent={activeChapter?.content}
        chapters={thesis?.chapters}
        thesisTitle={thesis?.title}
        thesisField={thesis?.field}
        onInsertText={handleInsertText}
      />

      <DirecteurChat
        open={directeurOpen}
        onOpenChange={setDirecteurOpen}
        chapterNumber={chapterMeta?.number || activeChapter?.number}
        chapterTitle={chapterMeta?.title || activeChapter?.title}
        chapterContent={activeChapter?.content}
        chapters={thesis?.chapters}
        thesisTitle={thesis?.title}
        thesisField={thesis?.field}
        activeBookIds={activeBookIds}
      />

      <CadragePanel
        open={cadrageOpen}
        onOpenChange={setCadrageOpen}
        thesisId={thesis?.id || 'local-thesis-001'}
      />

      <AutomationPanel
        open={automationOpen}
        onOpenChange={setAutomationOpen}
        thesis={thesis}
      />

      <IthyResearchPanel
        open={ithyResearchOpen}
        onOpenChange={setIthyResearchOpen}
        thesisTitle={thesis?.title}
        thesisField={thesis?.field}
        chapterTitle={chapterMeta?.title || activeChapter?.title}
        onInsertText={handleInsertText}
      />

      <AgileRoadmapPanel
        open={agileRoadmapOpen}
        onOpenChange={setAgileRoadmapOpen}
      />

      <WritingUnblockPanel
        open={writingUnblockOpen}
        onOpenChange={setWritingUnblockOpen}
        chapterTitle={chapterMeta?.title || activeChapter?.title}
        onInsertText={handleInsertText}
      />

      <ResourcesPanel
        open={resourcesOpen}
        onOpenChange={setResourcesOpen}
      />

      <BookSkillsPanel
        open={bookSkillsOpen}
        onOpenChange={setBookSkillsOpen}
        chapterNumber={chapterMeta?.number}
        activeBookIds={activeBookIds}
        onToggleBook={toggleActiveBook}
      />

      <ResearchResourcesPanel
        open={researchResourcesOpen}
        onOpenChange={setResearchResourcesOpen}
      />

      <ResearchFieldAnalysisPanel
        open={fieldAnalysisOpen}
        onOpenChange={setFieldAnalysisOpen}
      />

      <ApaResultsComposer
        open={apaComposerOpen}
        onOpenChange={setApaComposerOpen}
      />

      <SlrProtocolPanel
        open={slrProtocolOpen}
        onOpenChange={setSlrProtocolOpen}
      />

      <DoctoralToolkitPanel
        open={doctoralToolkitOpen}
        onOpenChange={setDoctoralToolkitOpen}
      />

      <BoxDrivePanel
        open={boxDriveOpen}
        onOpenChange={setBoxDriveOpen}
      />

      <UsageGuidePanel
        open={usageGuideOpen}
        onOpenChange={setUsageGuideOpen}
      />

      {/* ═══ LICENSE ADMIN DIALOG ═══ */}
      <Dialog open={licenseAdminOpen} onOpenChange={setLicenseAdminOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <KeyRound className="h-4 w-4" />
              Gestion des licences
            </DialogTitle>
          </DialogHeader>
          <LicenseAdminPanel />
        </DialogContent>
      </Dialog>

      {/* ═══ AUTH PROVIDERS DIALOG ═══ */}
      <Dialog open={authProvidersOpen} onOpenChange={setAuthProvidersOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Fournisseurs d'authentification
            </DialogTitle>
            <DialogDescription>
              Auth0 · Stytch · Warrant — Configuration et gestion des accès
            </DialogDescription>
          </DialogHeader>
          <AuthProviderPanel />
        </DialogContent>
      </Dialog>

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
