'use client'

import { GraduationCap, Settings, Trash2, Check, Brain, Zap, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ProviderSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  aiProvider: string
  setAiProvider: (v: string) => void
  aiApiKey: string
  setAiApiKey: (v: string) => void
  aiBaseUrl: string
  setAiBaseUrl: (v: string) => void
  aiModel: string
  setAiModel: (v: string) => void
  s2ApiKey: string
  setS2ApiKey: (v: string) => void
  consensusApiKey: string
  setConsensusApiKey: (v: string) => void
  onSave: () => void
  onClear: () => void
}

export default function ProviderSettingsDialog({
  open, onOpenChange, aiProvider, setAiProvider, aiApiKey, setAiApiKey, aiBaseUrl, setAiBaseUrl,
  aiModel, setAiModel, s2ApiKey, setS2ApiKey, consensusApiKey, setConsensusApiKey, onSave, onClear,
}: ProviderSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              else if (v === 'freellmapi') { setAiBaseUrl('http://localhost:3456/v1'); setAiModel('fusion') }
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
                <SelectItem value="freellmapi">FreeLLMAPI (28 fournisseurs gratuits)</SelectItem>
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

          {aiProvider === 'freellmapi' && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 space-y-2">
              <p className="text-xs text-amber-800">
                <Zap className="h-3 w-3 inline-block mr-1" />
                <strong>FreeLLMAPI</strong> agrège 28 fournisseurs LLM gratuits (~4 milliards de tokens/mois) derrière un seul endpoint OpenAI-compatible.
              </p>
              <p className="text-[10px] text-amber-700 leading-snug">
                Par défaut, le modèle <code className="bg-amber-100 px-1 rounded">fusion</code> envoie votre prompt à plusieurs modèles en parallèle et synthétise une réponse.
                Vous pouvez aussi choisir un modèle spécifique (ex: <code className="bg-amber-100 px-1 rounded">gpt-4o-mini</code>, <code className="bg-amber-100 px-1 rounded">claude-haiku</code>, <code className="bg-amber-100 px-1 rounded">llama-4-maverick</code>).
              </p>
              <p className="text-[10px] text-amber-700">
                Installation : <code className="bg-amber-100 px-1 rounded">curl -fsSL https://freellmapi.co/install.sh | bash</code>{' '}
                ou voir{' '}
                <a href="https://github.com/tashfeenahmed/freellmapi" target="_blank" rel="noopener" className="underline font-medium flex items-center gap-0.5 inline-flex">
                  GitHub <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </p>
            </div>
          )}

          <Separator className="my-1" />

          {/* Semantic Scholar API Key */}
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1.5">
              <GraduationCap className="h-3 w-3 text-sky-600" />
              Clé API Semantic Scholar
              <span className="text-slate-400 font-normal">(optionnel)</span>
            </Label>
            <Input
              type="password"
              value={s2ApiKey}
              onChange={e => setS2ApiKey(e.target.value)}
              placeholder="Clé S2 (1 req/s garanti)"
              className="h-9 text-sm"
            />
            <p className="text-[10px] text-slate-400 leading-snug">
              Sans clé : partage du rate limit global (souvent 429). Avec clé : 1 req/s garanti. Gratuit sur{' '}
              <a href="https://www.semanticscholar.org/product/api#api-key" target="_blank" rel="noopener" className="text-sky-600 underline">semanticscholar.org/product/api</a>
            </p>
          </div>

          <Separator className="my-1" />

          {/* Consensus AI API Key */}
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1.5">
              <Brain className="h-3 w-3 text-violet-600" />
              Clé API Consensus AI
              <span className="text-slate-400 font-normal">(requis pour l'onglet Consensus)</span>
            </Label>
            <Input
              type="password"
              value={consensusApiKey}
              onChange={e => setConsensusApiKey(e.target.value)}
              placeholder="Clé API Consensus"
              className="h-9 text-sm"
            />
            <p className="text-[10px] text-slate-400 leading-snug">
              Analyse IA de 220M+ papiers avec réponses synthétiques basées sur les preuves. Obtenez une clé gratuite sur{' '}
              <a href="https://consensus.app" target="_blank" rel="noopener" className="text-violet-600 underline">consensus.app</a>
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={onClear}>
              <Trash2 className="h-3 w-3 mr-1" />Réinitialiser
            </Button>
            <Button size="sm" className="text-xs" onClick={onSave}>
              <Check className="h-3 w-3 mr-1" />Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
