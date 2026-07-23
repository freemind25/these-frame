'use client'

import { createElement, useState, useCallback } from 'react'
import {
  Sparkles,
  PenTool,
  BookOpenText,
  ScanSearch,
  Languages,
  ScrollText,
  Lightbulb,
  Loader2,
  RotateCcw,
  Send,
  CheckCircle2,
  Copy,
  AlertTriangle,
  ClipboardList,
  Layout,
  Type,
  BookOpen,
  FlaskConical,
  BarChart3,
  MessageSquare,
  GraduationCap,
  FileText,
  Settings2,
  Target,
  Mic,
  Presentation,
  Network,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
  PenTool,
  FileText,
  GraduationCap,
  BookOpenText,
  ScanSearch,
  Languages,
  ScrollText,
  Lightbulb,
  Sparkles,
  Loader2,
  RotateCcw,
  Target,
  Mic,
  Presentation,
  Network,
  Settings2,
}

// ─── AI Writing Modes ────────────────────────────────────────────
const WRITING_MODES = [
  { id: 'scientific-writing', label: 'Rédaction scientifique', description: 'Rédiger ou améliorer une section de thèse selon les normes IMRaD', icon: 'PenTool', color: 'emerald' },
  { id: 'literature-review', label: 'Revue de littérature', description: 'Synthétiser des travaux, identifier les lacunes et structurer une revue', icon: 'BookOpenText', color: 'sky' },
  { id: 'peer-review', label: 'Relecture critique', description: 'Évaluer la rigueur, la clarté et la cohérence de votre texte', icon: 'ScanSearch', color: 'amber' },
  { id: 'paraphrase', label: 'Paraphrase & Amélioration', description: 'Reformuler, enrichir le vocabulaire et corriger le style', icon: 'Languages', color: 'violet' },
  { id: 'abstract', label: 'Résumé & Abstract', description: 'Générer un résumé structuré ou un abstract en français/anglais', icon: 'ScrollText', color: 'rose' },
  { id: 'hypothesis', label: "Génération d'hypothèses", description: 'Formuler des hypothèses de recherche testables et pertinentes', icon: 'Lightbulb', color: 'orange' },
  { id: 'methodo-positioning', label: 'Positionnement méthodo.', description: 'Analyser les designs de recherche antérieurs et justifier vos choix', icon: 'Target', color: 'teal' },
  { id: 'theory-building', label: 'Construction théorique', description: 'Construire un cadre conceptuel et intégrer les théories', icon: 'Network', color: 'fuchsia' },
  { id: 'supervision-document', label: 'Plan de supervision', description: 'Générer un document de supervision personnalisé pour votre thèse', icon: 'ClipboardList', color: 'indigo' },
  { id: 'conference-presentation', label: 'Présentation & Soutenance', description: 'Préparer slides, script et gestion du jury', icon: 'Presentation', color: 'cyan' },
] as const

const MODE_COLORS: Record<string, string> = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  sky: 'border-sky-200 bg-sky-50 text-sky-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  violet: 'border-violet-200 bg-violet-50 text-violet-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700',
  orange: 'border-orange-200 bg-orange-50 text-orange-700',
  teal: 'border-teal-200 bg-teal-50 text-teal-700',
  fuchsia: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  cyan: 'border-cyan-200 bg-cyan-50 text-cyan-700',
}

const MODE_ACCENT: Record<string, string> = {
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
  orange: 'bg-orange-500',
  teal: 'bg-teal-500',
  fuchsia: 'bg-fuchsia-500',
  indigo: 'bg-indigo-500',
  cyan: 'bg-cyan-500',
}

const MODE_TEXT_ACCENT: Record<string, string> = {
  emerald: 'text-emerald-600',
  sky: 'text-sky-600',
  amber: 'text-amber-600',
  violet: 'text-violet-600',
  rose: 'text-rose-600',
  orange: 'text-orange-600',
  teal: 'text-teal-600',
  fuchsia: 'text-fuchsia-600',
  indigo: 'text-indigo-600',
  cyan: 'text-cyan-600',
}

const MODE_BG_LIGHT: Record<string, string> = {
  emerald: 'bg-emerald-100',
  sky: 'bg-sky-100',
  amber: 'bg-amber-100',
  violet: 'bg-violet-100',
  rose: 'bg-rose-100',
  orange: 'bg-orange-100',
  teal: 'bg-teal-100',
  fuchsia: 'bg-fuchsia-100',
  indigo: 'bg-indigo-100',
  cyan: 'bg-cyan-100',
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// ─── AIWritingTab ───────────────────────────────────────────────
export default function AIWritingTab() {
  const [selectedMode, setSelectedMode] = useState<string>('scientific-writing')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [error, setError] = useState('')

  // AI Config state
  const [showConfig, setShowConfig] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(4096)
  const [thinkingEnabled, setThinkingEnabled] = useState(false)

  const chatEndRef = useCallback((node: HTMLDivElement | null) => {
    if (node) node.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const activeMode = WRITING_MODES.find(m => m.id === selectedMode)

  async function handleSend() {
    if (!input.trim() || isLoading) return
    setError('')
    const userMsg = input.trim()
    setInput('')

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: selectedMode,
          message: userMsg,
          sessionId: sessionId || undefined,
          temperature,
          maxTokens,
          thinking: thinkingEnabled ? 'enabled' : 'disabled',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur serveur')
      if (data.sessionId && !sessionId) setSessionId(data.sessionId)
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleClear() {
    if (sessionId) {
      await fetch(`/api/ai-writing?sessionId=${sessionId}`, { method: 'DELETE' })
    }
    setMessages([])
    setSessionId('')
    setError('')
  }

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Assistant IA de rédaction
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {WRITING_MODES.length} modes disponibles — Thèse Architecture & Urbanisme
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfig(true)}
          className="gap-1.5"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Configuration IA
        </Button>
      </div>

      {/* ── AI Configuration Dialog (modal) ── */}
      <Dialog open={showConfig} onOpenChange={setShowConfig}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Settings2 className="h-4 w-4 text-emerald-600" />
              Configuration de l&apos;IA
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ajustez les paramètres de génération pour l&apos;assistant IA.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {/* Model info */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Modèle IA</Label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border bg-muted/30 text-sm">
                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium">LLM (z-ai-web-dev-sdk)</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Modèle par défaut. Le prompt système s&apos;adapte au mode sélectionné.</p>
            </div>
            <Separator />
            {/* Temperature */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Température : <span className="font-bold text-emerald-700">{temperature.toFixed(1)}</span>
              </Label>
              <Slider
                value={[temperature]}
                onValueChange={([v]) => setTemperature(v)}
                min={0}
                max={1.5}
                step={0.1}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Précis (0)</span>
                <span>Créatif (1.5)</span>
              </div>
            </div>
            {/* Max tokens */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Max tokens</Label>
              <Select value={String(maxTokens)} onValueChange={v => setMaxTokens(Number(v))}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024">1 024 (court)</SelectItem>
                  <SelectItem value="2048">2 048 (moyen)</SelectItem>
                  <SelectItem value="4096">4 096 (long)</SelectItem>
                  <SelectItem value="8192">8 192 (très long)</SelectItem>
                  <SelectItem value="16384">16 384 (maximum)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Thinking mode */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-xs font-medium">Mode réflexif (Thinking)</Label>
                <p className="text-[10px] text-muted-foreground">L&apos;IA réfléchit avant de répondre</p>
              </div>
              <Switch checked={thinkingEnabled} onCheckedChange={setThinkingEnabled} />
            </div>
            {/* Active mode info */}
            {activeMode && (
              <>
                <Separator />
                <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${MODE_ACCENT[activeMode.color]}`}>
                    {createElement(iconMap[activeMode.icon] || PenTool, { className: 'h-4 w-4 text-white' })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Mode actuel : {activeMode.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{activeMode.description}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Mode selector - 2 rows of 5 */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Modes de rédaction</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {WRITING_MODES.map(mode => {
            const isActive = selectedMode === mode.id
            return (
              <button
                key={mode.id}
                onClick={() => { setSelectedMode(mode.id); setError('') }}
                className={`rounded-lg border p-2.5 text-left transition-all hover:shadow-sm ${
                  isActive
                    ? `${MODE_COLORS[mode.color]} ring-2 ring-offset-1 ring-current`
                    : 'border-border bg-background hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`h-5 w-5 rounded-md flex items-center justify-center ${isActive ? MODE_ACCENT[mode.color] : 'bg-muted'}`}>
                    {createElement(iconMap[mode.icon] || PenTool, { className: 'h-3 w-3 text-white' })}
                  </div>
                  <span className={`text-[11px] font-semibold leading-tight ${isActive ? '' : 'text-foreground'}`}>{mode.label}</span>
                </div>
                <p className={`text-[10px] leading-tight ${isActive ? 'text-current/80' : 'text-muted-foreground'}`}>{mode.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active mode description */}
      {activeMode && (
        <Card className="border-dashed">
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${MODE_ACCENT[activeMode.color]}`}>
              {createElement(iconMap[activeMode.icon] || PenTool, { className: 'h-4 w-4 text-white' })}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{activeMode.label}</p>
              <p className="text-xs text-muted-foreground truncate">{activeMode.description}</p>
            </div>
            <Badge variant="secondary" className="text-xs shrink-0">Mode actif</Badge>
          </CardContent>
        </Card>
      )}

      {/* Chat area */}
      <Card className="flex flex-col" style={{ minHeight: '400px', maxHeight: '65vh' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: '300px' }}>
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className={`h-16 w-16 rounded-2xl ${MODE_BG_LIGHT[activeMode?.color || 'emerald']} flex items-center justify-center mb-4`}>
                {createElement(iconMap[activeMode?.icon || 'PenTool'] || PenTool, { className: `h-8 w-8 ${MODE_TEXT_ACCENT[activeMode?.color || 'emerald']}` })}
              </div>
              <h3 className="text-lg font-semibold">{activeMode?.label}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                {activeMode?.description}. Collez votre texte ou décrivez ce que vous souhaitez rédiger.
              </p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <Badge variant="outline" className="text-xs">Entrée + Envoyer</Badge>
                <Badge variant="outline" className="text-xs">Shift+Entrée = nouvelle ligne</Badge>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${MODE_ACCENT[activeMode?.color || 'emerald']}`}>
                  {createElement(iconMap[activeMode?.icon || 'PenTool'] || PenTool, { className: 'h-4 w-4 text-white' })}
                </div>
              )}
              <div className={`relative max-w-[85%] rounded-xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="absolute top-2 right-2 p-1 rounded-md hover:bg-background/80 transition-colors"
                    title="Copier"
                  >
                    {copiedIdx === idx ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${MODE_ACCENT[activeMode?.color || 'emerald']}`}>
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              </div>
              <div className="bg-muted rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Génération en cours...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 pb-2">
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t p-3">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Décrivez votre demande en ${activeMode?.label.toLowerCase() || 'rédaction'}...`}
              className="min-h-[60px] max-h-[160px] resize-none text-sm"
              disabled={isLoading}
              rows={2}
            />
            <div className="flex flex-col gap-1 shrink-0">
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-9 w-9"
                title="Envoyer"
              >
                <Send className="h-4 w-4" />
              </Button>
              {messages.length > 0 && (
                <Button
                  onClick={handleClear}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  title="Nouvelle conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            L&apos;IA peut générer du contenu inexact. Vérifiez toujours les informations et adaptez le texte à votre contexte.
          </p>
        </div>
      </Card>
    </div>
  )
}
