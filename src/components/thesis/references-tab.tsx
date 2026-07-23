'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  Link2,
  CheckCircle2,
  Plus,
  ExternalLink,
  RefreshCw,
  Unplug,
  ChevronRight,
  Copy,
  Trash2,
  Upload,
  Search,
  Library,
  BookMarked,
  Globe,
  FileCode2,
  Download,
  Database,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { thesisWebsites } from '@/data/methodology-guide'
import { academicDatabases } from '@/data/academic-databases'

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

// ─── AcademicDatabasesSection ────────────────────────────────────
function AcademicDatabasesSection() {
  const [dbSearchQuery, setDbSearchQuery] = useState('')

  function handleDbSearch() {
    // The links are dynamically generated with the query
    // Clicking a database card will open the search URL in a new tab
  }

  return (
    <Card className="border-violet-200 bg-violet-50/20">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Database className="h-5 w-5 text-violet-600" />
          Bases de données académiques
        </CardTitle>
        <CardDescription>
          Recherchez des livres, articles et ouvrages académiques en accès libre. Saisissez un terme et lancez la recherche sur la base de votre choix.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Titre, auteur, mot-clé…"
              value={dbSearchQuery}
              onChange={e => setDbSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleDbSearch() }}
              className="pl-8 text-sm"
            />
          </div>
          <Button onClick={handleDbSearch} disabled={!dbSearchQuery.trim()} className="gap-1.5 text-sm">
            <Search className="h-3.5 w-3.5" />
            Rechercher
          </Button>
        </div>

        {/* Database grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {academicDatabases.map(db => (
            <a
              key={db.id}
              href={db.searchUrl && dbSearchQuery.trim()
                ? db.searchUrl.replace('{query}', encodeURIComponent(dbSearchQuery.trim()))
                : db.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border p-3 space-y-2 hover:shadow-md transition-all group"
              style={{ borderLeftColor: db.color, borderLeftWidth: '3px' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: db.color + '15' }}
                  >
                    <Database className="h-4 w-4" style={{ color: db.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold group-hover:text-violet-700 transition-colors truncate">{db.label}</p>
                    <Badge variant="outline" className="text-[10px] mt-0.5">
                      {db.searchMethod === 'url' ? 'Recherche web' : 'API'}
                    </Badge>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{db.description}</p>
              {dbSearchQuery.trim() && db.searchUrl ? (
                <p className="text-[10px] text-violet-600 font-medium truncate">
                  → Rechercher « {dbSearchQuery.trim()} »
                </p>
              ) : (
                <p className="text-[10px] text-muted-foreground truncate">{db.url}</p>
              )}
            </a>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground">
          Cliquez sur une base pour y rechercher directement votre terme. Les résultats s&apos;ouvrent dans un nouvel onglet.
        </p>
      </CardContent>
    </Card>
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
export default function ReferencesTab() {
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
                Le template LaTeX généré utilise déjà <code className="bg-muted px-1 rounded text-xs">{'\\addbibresource{references.bib}'}</code> pour
                inclure automatiquement ces références.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bases de données académiques (Z-Library, Anna's Archive, Welib, LibGen…) */}
      <AcademicDatabasesSection />

      {/* Ressources en ligne pour thèses */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-5 w-5 text-amber-600" />
            15 sites gratuits pour télécharger des thèses
          </CardTitle>
          <CardDescription>Boostez votre recherche. Accédez à des milliers de thèses en accès libre.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {thesisWebsites.map((site) => (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border p-3 space-y-1 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium group-hover:text-sky-700 transition-colors">{site.name}</p>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground">{site.description}</p>
                <Badge variant="outline" className="text-[10px]">{site.type}</Badge>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
