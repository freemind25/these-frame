'use client'

import { createElement, useCallback, useEffect, useState } from 'react'
import {
  BookOpen,
  FileText,
  GraduationCap,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  BookMarked,
  ClipboardList,
  Database,
  Send,
  FlaskConical,
  BarChart3,
  MessageSquare,
  Layout,
  Type,
  ArrowRight,
  XCircle,
  ShieldCheck,
  Download,
  FileCode2,
  Link2,
  ExternalLink,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Unplug,
  Upload,
  Library,
  Copy,
  Eye,
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DEFAULT_THESIS_DATA, type ThesisData } from '@/data/latex-template'
import {
  writingSteps,
  sectionGuides,
  referenceArticles,
  submissionChecklist,
  commonMistakes,
} from '@/data/articles-guide'
import {
  researchCycle,
  researchTypes,
  reasoningApproaches,
  disciplinarities,
  problematiqueGuide,
  problematiqueConseils,
  operationalisationConcept,
  operationalisationExample,
  hypothesesConditions,
  hypothesesVerification,
  collectTools,
  documentTypes,
  databases,
  catalogs,
  webResources,
  introductionStructure,
  titreConseils,
} from '@/data/methodology-guide'

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

// ─── Reference type ──────────────────────────────────────────────
interface RefItem {
  id: string
  type: string
  citationKey: string | null
  title: string
  authors: string
  year: string | null
  journal: string | null
  volume: string | null
  number: string | null
  pages: string | null
  doi: string | null
  abstract: string | null
  tags: string | null
  notes: string | null
  source: string
  mendeleyId: string | null
  createdAt: string
}

// ─── MendeleyConnectionCard ──────────────────────────────────────
function MendeleyConnectionCard({
  connected,
  onRefresh,
  onDisconnect,
  onConfigure,
  onConnectOAuth,
  hasClientId,
}: {
  connected: boolean
  onRefresh: () => void
  onDisconnect: () => void
  onConfigure: (clientId: string, clientSecret: string, accessToken?: string) => void
  onConnectOAuth: () => void
  hasClientId: boolean
}) {
  const [showConfig, setShowConfig] = useState(false)
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [manualToken, setManualToken] = useState('')
  const [useManualToken, setUseManualToken] = useState(false)

  if (connected) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-100 shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <CardTitle className="text-base">Mendeley connecté</CardTitle>
                <CardDescription className="text-sm">
                  Votre bibliothèque Mendeley est synchronisée
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onRefresh} className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                Rafraîchir
              </Button>
              <Button variant="outline" size="sm" onClick={onDisconnect} className="gap-1.5 text-red-600 hover:text-red-700">
                <Unplug className="h-3.5 w-3.5" />
                Déconnecter
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-amber-200 bg-amber-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-amber-100 shrink-0">
            <Link2 className="h-5 w-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Connexion Mendeley</CardTitle>
            <CardDescription className="text-sm">
              Connectez votre compte pour importer vos références bibliographiques
            </CardDescription>
          </div>
          {!showConfig && (
            <Button size="sm" onClick={() => setShowConfig(true)} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Configurer
            </Button>
          )}
        </div>
      </CardHeader>
      {showConfig && (
        <CardContent className="space-y-4 border-t pt-4">
          <div className="flex items-center gap-2 p-2 rounded-md bg-sky-50 border border-sky-200 text-sm text-sky-800">
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span>
              Créez votre app sur{' '}
              <a href="https://dev.mendeley.com/myapps.html" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                dev.mendeley.com/myapps
              </a>{' '}
              pour obtenir un Client ID et Secret.
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="clientId" className="text-xs">Client ID</Label>
              <Input id="clientId" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" value={clientId} onChange={e => setClientId(e.target.value)} className="text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="clientSecret" className="text-xs">Client Secret</Label>
              <Input id="clientSecret" type="password" placeholder="Votre client secret" value={clientSecret} onChange={e => setClientSecret(e.target.value)} className="text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="manualTokenCheck"
              checked={useManualToken}
              onCheckedChange={(v) => setUseManualToken(v === true)}
            />
            <Label htmlFor="manualTokenCheck" className="text-xs text-muted-foreground">
              Utiliser un token d&apos;accès manuel (si vous avez déjà un Access Token)
            </Label>
          </div>

          {useManualToken && (
            <div className="grid gap-1.5">
              <Label htmlFor="manualToken" className="text-xs">Access Token Mendeley</Label>
              <Input id="manualToken" placeholder="Bearer token..." value={manualToken} onChange={e => setManualToken(e.target.value)} className="text-sm" />
            </div>
          )}

          <div className="flex items-center gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowConfig(false)}>Annuler</Button>
            {useManualToken ? (
              <Button size="sm" onClick={() => {
                onConfigure(clientId, clientSecret, manualToken)
                setShowConfig(false)
              }} disabled={!manualToken} className="gap-1.5">
                <Link2 className="h-3.5 w-3.5" />
                Connecter avec token
              </Button>
            ) : (
              <Button size="sm" onClick={() => {
                onConfigure(clientId, clientSecret)
                if (clientId) onConnectOAuth()
              }} disabled={!clientId || !clientSecret} className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                Autoriser via Mendeley
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// ─── AddReferenceDialog ──────────────────────────────────────────
function AddReferenceDialog({ onAdd }: { onAdd: (data: Record<string, string>) => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    type: 'article',
    title: '',
    authors: '',
    year: '',
    journal: '',
    volume: '',
    number: '',
    pages: '',
    doi: '',
    tags: '',
    notes: '',
  })

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = () => {
    if (!form.title.trim()) return
    onAdd(form)
    setOpen(false)
    setForm({ type: 'article', title: '', authors: '', year: '', journal: '', volume: '', number: '', pages: '', doi: '', tags: '', notes: '' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter une référence
          </DialogTitle>
          <DialogDescription>Entrez les métadonnées de la référence bibliographique.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-xs">Type</Label>
              <Select value={form.type} onValueChange={v => update('type', v)}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="book">Livre</SelectItem>
                  <SelectItem value="inproceedings">Conférence</SelectItem>
                  <SelectItem value="thesis">Thèse</SelectItem>
                  <SelectItem value="incollection">Chapitre d&apos;ouvrage</SelectItem>
                  <SelectItem value="web">Site web</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Année</Label>
              <Input placeholder="2025" value={form.year} onChange={e => update('year', e.target.value)} className="text-sm" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Titre *</Label>
            <Input placeholder="Titre de la publication" value={form.title} onChange={e => update('title', e.target.value)} className="text-sm" />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Auteurs (séparés par ; )</Label>
            <Input placeholder="Nom Prénom; Nom2 Prénom2" value={form.authors} onChange={e => update('authors', e.target.value)} className="text-sm" />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">
              {form.type === 'book' ? 'Éditeur' : form.type === 'thesis' ? 'Établissement' : form.type === 'web' ? 'URL / Site' : 'Journal / Revue'}
            </Label>
            <Input placeholder={form.type === 'book' ? 'Éditeur' : form.type === 'thesis' ? 'Université...' : 'Nom du journal'} value={form.journal} onChange={e => update('journal', e.target.value)} className="text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-xs">Volume</Label>
              <Input placeholder="Vol." value={form.volume} onChange={e => update('volume', e.target.value)} className="text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Numéro</Label>
              <Input placeholder="N°" value={form.number} onChange={e => update('number', e.target.value)} className="text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Pages</Label>
              <Input placeholder="1-15" value={form.pages} onChange={e => update('pages', e.target.value)} className="text-sm" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">DOI / URL</Label>
            <Input placeholder="10.xxxx/xxxxx" value={form.doi} onChange={e => update('doi', e.target.value)} className="text-sm" />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Tags (séparés par , )</Label>
            <Input placeholder="architecture, urbanisme, réhabilitation" value={form.tags} onChange={e => update('tags', e.target.value)} className="text-sm" />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Notes</Label>
            <Textarea placeholder="Remarques, contexte..." value={form.notes} onChange={e => update('notes', e.target.value)} className="text-sm" rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={!form.title.trim()} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── ReferenceRow ────────────────────────────────────────────────
function ReferenceRow({ item, onDelete }: { item: RefItem; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyBib = () => {
    const key = item.citationKey || `ref_${item.id.slice(0, 6)}`
    const authorList = item.authors ? item.authors.split(';').map(a => a.trim()).join(' and ') : 'Unknown'
    let bib = ''
    if (item.type === 'book') {
      bib = `@book{${key},\n  author = {${authorList}},\n  title = {${item.title}},\n  year = {${item.year || ''}},\n  publisher = {${item.journal || ''}}\n}`
    } else {
      bib = `@article{${key},\n  author = {${authorList}},\n  title = {${item.title}},\n  journal = {${item.journal || ''}},\n  year = {${item.year || ''}},\n  volume = {${item.volume || ''}},\n  pages = {${item.pages || ''}},\n  doi = {${item.doi || ''}}\n}`
    }
    navigator.clipboard.writeText(bib)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const typeLabels: Record<string, string> = {
    article: 'Article',
    book: 'Livre',
    inproceedings: 'Conférence',
    thesis: 'Thèse',
    incollection: 'Chapitre',
    web: 'Web',
  }

  return (
    <div className="rounded-lg border hover:bg-muted/30 transition-colors">
      <div
        className="flex items-start gap-3 p-3 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronRight className={`h-4 w-4 text-muted-foreground shrink-0 mt-1 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium truncate">{item.title}</span>
            <Badge variant="secondary" className="text-xs shrink-0">{typeLabels[item.type] || item.type}</Badge>
            {item.source === 'mendeley' && (
              <Badge variant="outline" className="text-xs shrink-0 text-amber-600 border-amber-300 bg-amber-50">Mendeley</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.authors} ({item.year || '—'})</p>
          {item.journal && <p className="text-xs text-muted-foreground truncate">{item.journal}{item.volume ? `, ${item.volume}` : ''}{item.pages ? `, pp. ${item.pages}` : ''}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); copyBib() }} title="Copier BibTeX">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(item.id) }} title="Supprimer">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="px-3 pb-3 pl-10 space-y-2 border-t pt-2 ml-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div><span className="text-muted-foreground">Clé :</span> <span className="font-mono">{item.citationKey || '—'}</span></div>
            <div><span className="text-muted-foreground">DOI :</span> {item.doi || '—'}</div>
            <div><span className="text-muted-foreground">Volume :</span> {item.volume || '—'}</div>
            <div><span className="text-muted-foreground">N° :</span> {item.number || '—'}</div>
          </div>
          {item.abstract && (
            <div>
              <span className="text-xs font-semibold text-muted-foreground">Résumé</span>
              <p className="text-xs text-muted-foreground mt-1 bg-muted/50 rounded p-2 max-h-32 overflow-y-auto">{item.abstract}</p>
            </div>
          )}
          {item.notes && (
            <div>
              <span className="text-xs font-semibold text-muted-foreground">Notes</span>
              <p className="text-xs mt-1 italic">{item.notes}</p>
            </div>
          )}
          {item.tags && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {item.tags.split(',').map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">{tag.trim()}</Badge>
              ))}
            </div>
          )}
          {copied && (
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> BibTeX copié dans le presse-papier
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── MendeleyImportPanel ─────────────────────────────────────────
function MendeleyImportPanel({ connected, onImport }: { connected: boolean; onImport: (docs: unknown[]) => void }) {
  const [documents, setDocuments] = useState<unknown[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  const fetchDocs = useCallback(async () => {
    if (!connected) return
    setLoading(true)
    try {
      const res = await fetch('/api/mendeley/documents?limit=50')
      if (res.ok) {
        const data = await res.json()
        setDocuments(Array.isArray(data) ? data : [])
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [connected])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (connected) { fetchDocs(); } }, [connected, fetchDocs])

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selected.size === documents.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set((documents as { id: string }[]).map(d => d.id)))
    }
  }

  const filtered = search
    ? documents.filter((d: Record<string, unknown>) =>
        String(d.title || '').toLowerCase().includes(search.toLowerCase()) ||
        String((d.authors as Array<Record<string, string>> || []).map(a => `${a.first_name || ''} ${a.last_name || ''}`).join(' ')).toLowerCase().includes(search.toLowerCase())
      )
    : documents

  if (!connected) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Library className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Connectez votre compte Mendeley pour voir vos documents</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Bibliothèque Mendeley</CardTitle>
            <CardDescription className="text-sm">
              {documents.length} document{documents.length !== 1 ? 's' : ''} trouvé{documents.length !== 1 ? 's' : ''}
              {selected.size > 0 && ` · ${selected.size} sélectionné${selected.size > 1 ? 's' : ''}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchDocs} disabled={loading} className="gap-1.5">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Rafraîchir
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const toImport = documents.filter(d => selected.has((d as { id: string }).id))
                onImport(toImport)
                setSelected(new Set())
              }}
              disabled={selected.size === 0}
              className="gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Importer ({selected.size})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Chercher dans vos documents Mendeley..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" onClick={selectAll} className="shrink-0 text-xs">
            {selected.size === documents.length ? 'Tout désélectionner' : 'Tout sélectionner'}
          </Button>
        </div>
        <ScrollArea className="max-h-64">
          <div className="space-y-1.5 pr-2">
            {loading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Chargement des documents…</div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Aucun document trouvé</div>
            ) : (
              filtered.map((doc: Record<string, unknown>) => {
                const id = doc.id as string
                const title = String(doc.title || 'Sans titre')
                const authors = (doc.authors as Array<Record<string, string>> || []).map(a => `${a.last_name || ''} ${a.first_name || ''}`).join(', ')
                const year = doc.year || ''
                const source = (doc.source as string) || (doc.journal as string) || ''
                const isSelected = selected.has(id)
                return (
                  <div
                    key={id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-md border cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50 border-emerald-300' : 'hover:bg-muted/50'}`}
                    onClick={() => toggleSelect(id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{title}</p>
                      <p className="text-xs text-muted-foreground truncate">{authors} ({year}){source ? ` — ${source}` : ''}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// ─── ReferencesTab ───────────────────────────────────────────────
function ReferencesTab() {
  const [references, setReferences] = useState<RefItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mendeleyConnected, setMendeleyConnected] = useState(false)
  const [mendeleyHasClientId, setMendeleyHasClientId] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null)

  // Load references + Mendeley status
  const loadReferences = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (filterType !== 'all') params.set('type', filterType)
      const res = await fetch(`/api/references?${params}`)
      if (res.ok) setReferences(await res.json())
    } catch { /* ignore */ }
    setLoading(false)
  }, [searchQuery, filterType])

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (filterType !== 'all') params.set('type', filterType)
    fetch(`/api/references?${params}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (!cancelled) setReferences(data) })
      .catch(() => { if (!cancelled) setLoading(false) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [searchQuery, filterType])

  useEffect(() => {
    // Check Mendeley status
    fetch('/api/mendeley/auth')
      .then(r => r.json())
      .then(data => {
        setMendeleyConnected(data.connected || false)
        setMendeleyHasClientId(data.hasClientId || false)
      })
      .catch(() => {})
  }, [])

  const handleConfigure = async (clientId: string, clientSecret: string, accessToken?: string) => {
    await fetch('/api/mendeley/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret, accessToken }),
    })
    setMendeleyHasClientId(!!clientId)
    if (accessToken) {
      setMendeleyConnected(true)
    }
  }

  const handleConnectOAuth = async () => {
    try {
      const res = await fetch('/api/mendeley/auth')
      const data = await res.json()
      if (data.authUrl) {
        window.location.href = data.authUrl
      }
    } catch { /* ignore */ }
  }

  const handleDisconnect = async () => {
    await fetch('/api/mendeley/disconnect', { method: 'POST' })
    setMendeleyConnected(false)
  }

  const handleAddReference = async (data: Record<string, string>) => {
    await fetch('/api/references', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    loadReferences()
  }

  const handleDeleteReference = async (id: string) => {
    await fetch(`/api/references?id=${id}`, { method: 'DELETE' })
    loadReferences()
  }

  const handleImport = async (docs: unknown[]) => {
    try {
      const res = await fetch('/api/references/import-bibtex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: docs }),
      })
      if (res.ok) {
        const result = await res.json()
        setImportResult(result)
        setTimeout(() => setImportResult(null), 5000)
        loadReferences()
      }
    } catch { /* ignore */ }
  }

  const handleExportBib = () => {
    fetch('/api/references/bibtex')
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'references.bib'
        a.click()
        URL.revokeObjectURL(url)
      })
  }

  const uniqueTypes = ['all', ...Array.from(new Set(references.map(r => r.type)))]

  return (
    <div className="space-y-6">
      {/* Mendeley Connection */}
      <MendeleyConnectionCard
        connected={mendeleyConnected}
        onRefresh={loadReferences}
        onDisconnect={handleDisconnect}
        onConfigure={handleConfigure}
        onConnectOAuth={handleConnectOAuth}
        hasClientId={mendeleyHasClientId}
      />

      {/* Import result toast */}
      {importResult && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{importResult.imported} référence{importResult.imported > 1 ? 's' : ''} importée{importResult.imported > 1 ? 's' : ''} depuis Mendeley</span>
          {importResult.skipped > 0 && (
            <span className="text-muted-foreground">({importResult.skipped} déjà présente{importResult.skipped > 1 ? 's' : ''})</span>
          )}
        </div>
      )}

      {/* Mendeley Import Panel */}
      <MendeleyImportPanel connected={mendeleyConnected} onImport={handleImport} />

      <Separator />

      {/* Local References */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Library className="h-5 w-5" />
                Mes références
                <Badge variant="secondary" className="text-xs">{references.length}</Badge>
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Gérez vos références et exportez-les en BibTeX pour LaTeX
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <AddReferenceDialog onAdd={handleAddReference} />
              <Button variant="outline" size="sm" onClick={handleExportBib} disabled={references.length === 0} className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                Exporter .bib
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre, auteur, journal…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40 text-sm">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {uniqueTypes.map(t => (
                  <SelectItem key={t} value={t}>
                    {t === 'all' ? 'Tous les types' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reference list */}
          <ScrollArea className="max-h-96">
            <div className="space-y-2 pr-2">
              {loading ? (
                <div className="py-12 text-center text-sm text-muted-foreground">Chargement…</div>
              ) : references.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <BookMarked className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Aucune référence pour le moment</p>
                  <p className="text-xs text-muted-foreground">
                    Ajoutez-en manuellement ou importez depuis Mendeley
                  </p>
                </div>
              ) : (
                references.map(item => (
                  <ReferenceRow key={item.id} item={item} onDelete={handleDeleteReference} />
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* BibTeX preview info */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <FileCode2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Intégration LaTeX</p>
              <p className="text-xs text-muted-foreground mt-1">
                Exportez vos références en fichier <code className="bg-muted px-1 rounded text-xs">.bib</code> et
                placez-le à côté de votre fichier <code className="bg-muted px-1 rounded text-xs">.tex</code>.
                Le template LaTeX généré utilise déjà <code className="bg-muted px-1 rounded text-xs">\\addbibresource{references.bib}</code> pour
                inclure automatiquement ces références.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
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

      <LatexExportSection chapters={chapters} />
    </div>
  )
}

// ─── LatexExportSection ───────────────────────────────────────────
function LatexExportSection({ chapters }: { chapters: { id: string; title: string; words: number; pages: number; notes: string }[] }) {
  const [open, setOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [meta, setMeta] = useState<ThesisData>(DEFAULT_THESIS_DATA)
  const [exportDone, setExportDone] = useState(false)

  function handleExport() {
    setGenerating(true)
    const payload: ThesisData = {
      ...meta,
      chapters: chapters.map(ch => ({
        title: ch.title,
        content: `\\TODO{Rédiger ${ch.title}}`,
      })),
    }

    fetch('/api/generate-latex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'these.tex'
        a.click()
        URL.revokeObjectURL(url)
        setExportDone(true)
        setTimeout(() => setExportDone(false), 3000)
      })
      .catch(() => alert('Erreur lors de la génération du fichier LaTeX.'))
      .finally(() => setGenerating(false))
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-100 shrink-0">
              <FileCode2 className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <CardTitle className="text-base">Exporter en LaTeX</CardTitle>
              <CardDescription className="text-sm">
                Générez un fichier .tex prêt à compiler (Overleaf, Texmaker…)
              </CardDescription>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0 gap-2">
                {exportDone ? <CheckCircle2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                {exportDone ? 'Téléchargé !' : 'Générer .tex'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileCode2 className="h-5 w-5 text-emerald-600" />
                  Métadonnées de la thèse
                </DialogTitle>
                <DialogDescription>
                  Ces informations apparaîtront sur la page de garde et dans les métadonnées PDF.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Titre de la thèse</Label>
                  <Input id="title" value={meta.title} onChange={e => setMeta(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="author">Nom du doctorant</Label>
                    <Input id="author" value={meta.author} onChange={e => setMeta(p => ({ ...p, author: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Année de soutenance</Label>
                    <Input id="date" value={meta.date} onChange={e => setMeta(p => ({ ...p, date: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="supervisor">Directeur de thèse</Label>
                    <Input id="supervisor" value={meta.supervisor} onChange={e => setMeta(p => ({ ...p, supervisor: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="coSupervisor">Co-directeur (optionnel)</Label>
                    <Input id="coSupervisor" value={meta.coSupervisor || ''} onChange={e => setMeta(p => ({ ...p, coSupervisor: e.target.value }))} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="speciality">Spécialité</Label>
                  <Input id="speciality" value={meta.speciality} onChange={e => setMeta(p => ({ ...p, speciality: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="laboratory">Laboratoire de recherche</Label>
                  <Input id="laboratory" value={meta.laboratory} onChange={e => setMeta(p => ({ ...p, laboratory: e.target.value }))} />
                </div>
                <Separator />
                <div className="grid gap-2">
                  <Label htmlFor="abstractFr">Résumé (français)</Label>
                  <Textarea id="abstractFr" rows={4} value={meta.abstractFr} onChange={e => setMeta(p => ({ ...p, abstractFr: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="keywordsFr">Mots-clés (français, séparés par des virgules)</Label>
                  <Input id="keywordsFr" value={meta.keywordsFr} onChange={e => setMeta(p => ({ ...p, keywordsFr: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="abstractEn">Abstract (anglais)</Label>
                  <Textarea id="abstractEn" rows={4} value={meta.abstractEn} onChange={e => setMeta(p => ({ ...p, abstractEn: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="keywordsEn">Keywords (anglais, séparés par des virgules)</Label>
                  <Input id="keywordsEn" value={meta.keywordsEn} onChange={e => setMeta(p => ({ ...p, keywordsEn: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dedication">Dédicace (optionnel)</Label>
                  <Textarea id="dedication" rows={2} value={meta.dedication || ''} onChange={e => setMeta(p => ({ ...p, dedication: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ack">Remerciements</Label>
                  <Textarea id="ack" rows={3} value={meta.acknowledgements || ''} onChange={e => setMeta(p => ({ ...p, acknowledgements: e.target.value }))} />
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button onClick={handleExport} disabled={generating} className="gap-2">
                  {generating ? 'Génération…' : <><Download className="h-4 w-4" /> Télécharger these.tex</>}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">
          Le fichier généré inclut : page de garde, table des matières, chapitres structurés (IMRaD),
          zones TODO rouges à compléter, bibliographie BibLaTeX, et annexes.
          Compilez avec <strong>xelatex → biber → xelatex × 2</strong>.
        </p>
      </CardContent>
    </Card>
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
              <h3 className="font-semibold text-emerald-900">Guide de rédaction d&apos;articles scientifiques</h3>
              <p className="text-sm text-emerald-700 mt-1">
                Ce guide est basé sur les articles de référence fournis, notamment le guide pas-à-pas
                d&apos;Ecarnot et al. (2015). Il est conçu pour les doctorants en architecture et urbanisme
                de l&apos;Université Constantine 3.
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

// ─── MethodologyTab ──────────────────────────────────────────────
function MethodologyTab() {
  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <Card className="border-sky-200 bg-sky-50/50">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-sky-100 shrink-0">
              <FlaskConical className="h-5 w-5 text-sky-700" />
            </div>
            <div>
              <h3 className="font-semibold text-sky-900">Guide de méthodologie de la recherche</h3>
              <p className="text-sm text-sky-700 mt-1">
                Basé sur le cours de Gestion des Techniques Urbaines — IGTU-Cne3, Université Constantine 3.
                Ce guide couvre la démarche scientifique, la problématique, les outils de collecte et la recherche documentaire.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="demarche" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="demarche" className="text-xs sm:text-sm">Démarche</TabsTrigger>
          <TabsTrigger value="problematique" className="text-xs sm:text-sm">Problématique</TabsTrigger>
          <TabsTrigger value="outils" className="text-xs sm:text-sm">Outils de collecte</TabsTrigger>
          <TabsTrigger value="documentation" className="text-xs sm:text-sm">Documentation</TabsTrigger>
        </TabsList>

        {/* ── Démarche ── */}
        <TabsContent value="demarche" className="mt-4">
          <div className="space-y-6">
            {/* Cycle de recherche */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layout className="h-5 w-5 text-sky-600" />
                  Cycle de la recherche scientifique
                </CardTitle>
                <CardDescription>Les 8 étapes du processus de recherche, de la question à la publication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-sky-200" />
                  <div className="space-y-4">
                    {researchCycle.map((step, i) => (
                      <div key={step.id} className="flex gap-4 relative">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-sky-100 text-sky-700 shrink-0 z-10 text-sm font-bold">
                          {i + 1}
                        </div>
                        <div className="flex-1 pb-2">
                          <h4 className="text-sm font-semibold">{step.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                          <ul className="mt-2 space-y-1">
                            {step.details.map((d, j) => (
                              <li key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <CheckCircle2 className="h-3 w-3 text-sky-500 shrink-0 mt-0.5" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Types de recherche */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Types de recherche</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {researchTypes.map(rt => (
                    <div key={rt.id} className={`rounded-lg border p-4 space-y-2 ${rt.color === 'sky' ? 'border-sky-200 bg-sky-50/50' : rt.color === 'amber' ? 'border-amber-200 bg-amber-50/50' : 'border-emerald-200 bg-emerald-50/50'}`}>
                      <Badge variant="secondary" className="text-xs">{rt.title}</Badge>
                      <p className="text-xs text-muted-foreground">{rt.description}</p>
                      <ul className="space-y-1">
                        {rt.characteristics.map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <ArrowRight className={`h-3 w-3 shrink-0 mt-0.5 ${rt.color === 'sky' ? 'text-sky-500' : rt.color === 'amber' ? 'text-amber-500' : 'text-emerald-500'}`} />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Induction / Déduction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-sky-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{reasoningApproaches.inductive.title}</CardTitle>
                  <CardDescription className="text-xs">{reasoningApproaches.inductive.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">{reasoningApproaches.inductive.description}</p>
                  <div className="bg-sky-50 rounded p-2">
                    <p className="text-xs italic text-sky-800">Ex : {reasoningApproaches.inductive.example}</p>
                  </div>
                  <ol className="space-y-1">
                    {reasoningApproaches.inductive.steps.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-sky-100 text-sky-700 text-xs font-medium shrink-0">{i + 1}</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
              <Card className="border-emerald-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{reasoningApproaches.deductive.title}</CardTitle>
                  <CardDescription className="text-xs">{reasoningApproaches.deductive.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">{reasoningApproaches.deductive.description}</p>
                  <div className="bg-emerald-50 rounded p-2">
                    <p className="text-xs italic text-emerald-800">Ex : {reasoningApproaches.deductive.example}</p>
                  </div>
                  <ol className="space-y-1">
                    {reasoningApproaches.deductive.steps.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium shrink-0">{i + 1}</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Disciplinarités */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Types de disciplinarité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {disciplinarities.map(d => (
                    <div key={d.term} className={`rounded-lg border p-3 ${d.color === 'emerald' ? 'border-emerald-200 bg-emerald-50/50' : d.color === 'sky' ? 'border-sky-200 bg-sky-50/50' : 'border-border'}`}>
                      <p className="text-sm font-medium">{d.term}</p>
                      <p className="text-xs text-muted-foreground mt-1">{d.definition}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Problématique ── */}
        <TabsContent value="problematique" className="mt-4">
          <div className="space-y-6">
            {/* QUOI / COMMENT / POURQUOI */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-amber-600" />
                  La problématique — Trois questions essentielles
                </CardTitle>
                <CardDescription>La problématique est la question de recherche, incluse dans l&apos;introduction. Elle doit déterminer un cadre spatial et/ou temporel.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {problematiqueGuide.map((p, i) => (
                    <div key={p.id} className="rounded-lg border p-4 space-y-2">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 shrink-0 text-sm font-bold">
                        {p.question}
                      </div>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                      <div className="bg-amber-50 rounded p-2">
                        <p className="text-xs italic text-amber-800">{p.example}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conseils problématique */}
            <Card className="border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Conseils pour une bonne problématique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {problematiqueConseils.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Opérationnalisation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{operationalisationConcept.title}</CardTitle>
                <CardDescription>{operationalisationConcept.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground italic">« Le cadre opératoire forme un élément central du travail de recherche dans la mesure où il spécifie ce que nous allons analyser précisément pour vérifier notre hypothèse. » — Gordon MACE</p>
                <div className="relative">
                  <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-sky-200" />
                  <div className="space-y-3">
                    {operationalisationConcept.steps.map((s, i) => (
                      <div key={i} className="flex gap-3 relative">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-sky-100 text-sky-700 shrink-0 z-10 text-xs font-bold">{i + 1}</div>
                        <p className="text-sm text-muted-foreground flex items-center">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exemple opérationnalisation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Exemple : {operationalisationExample.concept}</CardTitle>
                <CardDescription>Concept → Dimensions → Indicateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {operationalisationExample.dimensions.map((dim, i) => (
                    <div key={i} className="rounded-lg border p-3">
                      <p className="text-sm font-medium">{dim.label}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {dim.indicateurs.map((ind, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">{ind}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hypothèses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-emerald-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Conditions d&apos;une hypothèse rigoureuse</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {hypothesesConditions.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-sky-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Vérification des hypothèses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {hypothesesVerification.map((v, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sky-500" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Structure de l'introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Structure de l&apos;introduction</CardTitle>
                <CardDescription>C&apos;est la porte d&apos;accès à votre travail — chaque sous-partie doit être présente sans intertitre.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-emerald-200" />
                  <div className="space-y-3">
                    {introductionStructure.map((s, i) => (
                      <div key={i} className="flex gap-3 relative">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 shrink-0 z-10 text-xs font-bold">{i + 1}</div>
                        <div>
                          <p className="text-sm font-medium">{s.step}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conseils titre */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Le titre de recherche</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {titreConseils.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Outils de collecte ── */}
        <TabsContent value="outils" className="mt-4">
          <div className="space-y-6">
            <ScrollArea className="max-h-[80vh]">
              <div className="space-y-4 pr-4">
                {collectTools.map(tool => (
                  <Card key={tool.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{tool.title}</CardTitle>
                      <CardDescription className="text-sm">{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Avantages</span>
                          <ul className="mt-2 space-y-1">
                            {tool.avantages.map((a, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{a}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-red-600">Limites</span>
                          <ul className="mt-2 space-y-1">
                            {tool.limites.map((l, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <XCircle className="h-3 w-3 text-red-400 shrink-0 mt-0.5" />
                                <span>{l}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">Conseils pratiques</span>
                        <ul className="mt-2 space-y-1">
                          {tool.conseils.map((c, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                              <ArrowRight className="h-3 w-3 text-sky-500 shrink-0 mt-0.5" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* ── Documentation ── */}
        <TabsContent value="documentation" className="mt-4">
          <div className="space-y-6">
            {/* Types de documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Types de documents</CardTitle>
                <CardDescription>Il dépend du niveau et de la nature de l&apos;information recherchée.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {documentTypes.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50">
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sky-500" />
                      <div>
                        <p className="text-sm font-medium">{d.type}</p>
                        <p className="text-xs text-muted-foreground">{d.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bases de données */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-5 w-5 text-sky-600" />
                  Bases de données bibliographiques
                </CardTitle>
                <CardDescription>Ensembles structurés de références bibliographiques avec accès au texte intégral.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {databases.map(db => (
                    <div key={db.id} className="rounded-lg border p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{db.name}</p>
                        <Badge variant="outline" className="text-xs">{db.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{db.description}</p>
                      {db.url && (
                        <a href={db.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" /> Accéder
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Catalogues */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Catalogues de bibliothèques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {catalogs.map(c => (
                    <div key={c.id} className="rounded-lg border p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{c.name}</p>
                        <Badge variant="outline" className="text-xs">{c.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.description}</p>
                      {c.url && (
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" /> Accéder
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ressources web */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="h-5 w-5 text-amber-600" />
                  Ressources du Web
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {webResources.map(r => (
                    <div key={r.id} className="rounded-lg border p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{r.name}</p>
                        <Badge variant="outline" className="text-xs">{r.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{r.description}</p>
                      {r.url && (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" /> Accéder
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Corpus d'étude */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Le corpus d&apos;étude</CardTitle>
                <CardDescription className="text-xs">L&apos;ensemble fini de textes choisi comme base d&apos;une étude scientifique.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-2">Trois aspects à soigner :</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="text-xs">Choix du corpus</Badge>
                  <Badge className="text-xs">Constitution du corpus</Badge>
                  <Badge className="text-xs">Utilisation du corpus</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
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
            <TabsList className="w-full grid grid-cols-4 mb-6">
              <TabsTrigger value="methodology" className="text-xs sm:text-sm flex items-center gap-1.5 py-3">
                <FlaskConical className="h-4 w-4" />
                <span className="hidden sm:inline">Méthodologie</span>
                <span className="sm:hidden">Méthodo.</span>
              </TabsTrigger>
              <TabsTrigger value="articles" className="text-xs sm:text-sm flex items-center gap-1.5 py-3">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Articles scientifiques</span>
                <span className="sm:hidden">Articles</span>
              </TabsTrigger>
              <TabsTrigger value="references" className="text-xs sm:text-sm flex items-center gap-1.5 py-3">
                <Library className="h-4 w-4" />
                <span className="hidden sm:inline">Références biblio.</span>
                <span className="sm:hidden">Références</span>
              </TabsTrigger>
              <TabsTrigger value="thesis" className="text-xs sm:text-sm flex items-center gap-1.5 py-3">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Plan de thèse</span>
                <span className="sm:hidden">Thèse</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="methodology">
              <MethodologyTab />
            </TabsContent>

            <TabsContent value="articles">
              <ArticlesGuideTab />
            </TabsContent>

            <TabsContent value="references">
              <ReferencesTab />
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
            ThesisFrame © 2025 — Université Constantine 3, Faculté d&apos;Architecture et d&apos;Urbanisme
          </p>
          <p className="text-xs text-muted-foreground">
            Basé sur le squelette IMRaD • Guide Ecarnot et al. (2015)
          </p>
        </div>
      </footer>
    </div>
  )
}