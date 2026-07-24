'use client'

import { useState, useCallback } from 'react'
import {
  Search, Loader2, ExternalLink, BookOpen, Quote, Copy, Check,
  GraduationCap, Globe, Database, FileText, Atom, Heart, Plus, CheckCheck, GitBranch,
  Link, Fingerprint, Building2, AlertCircle, Sparkles, Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SearchResult {
  title: string
  authors: string
  year: string
  abstract?: string
  source: string
  doi?: string
  url?: string
  citationCount?: number
  journal?: string
  isPreprint?: boolean
  fromCache?: boolean
}

const SOURCE_OPTIONS = [
  { id: 'semantic_scholar', label: 'Semantic Scholar', icon: GraduationCap, color: 'bg-sky-50 text-sky-700 border-sky-200', desc: '250M+ papiers, citations' },
  { id: 'openalex', label: 'OpenAlex', icon: Globe, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: '250M+ travaux, open data' },
  { id: 'crossref', label: 'Crossref', icon: Database, color: 'bg-amber-50 text-amber-700 border-amber-200', desc: '140M+ DOI, métadonnées' },
  { id: 'hal', label: 'HAL', icon: Building2, color: 'bg-orange-50 text-orange-700 border-orange-200', desc: 'Archive ouverte française' },
  { id: 'arxiv', label: 'arXiv', icon: Atom, color: 'bg-violet-50 text-violet-700 border-violet-200', desc: 'Preprints CS, physique, maths' },
  { id: 'pubmed', label: 'PubMed', icon: Heart, color: 'bg-rose-50 text-rose-700 border-rose-200', desc: '35M+ articles biomédicaux' },
]

export default function LiteratureSearch() {
  // Search state
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSources, setSelectedSources] = useState<string[]>(['crossref', 'hal', 'semantic_scholar'])
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const [sourceErrors, setSourceErrors] = useState<string[]>([])
  const [searchMode, setSearchMode] = useState<'search' | 'doi'>('search')

  // DOI lookup state
  const [doiInput, setDoiInput] = useState('')
  const [doiResult, setDoiResult] = useState<SearchResult | null>(null)
  const [doiLoading, setDoiLoading] = useState(false)
  const [doiError, setDoiError] = useState('')
  const [doiAdded, setDoiAdded] = useState(false)

  // Related papers state
  const [relatedDois, setRelatedDois] = useState<Record<string, SearchResult[]>>({})
  const [relatedLoading, setRelatedLoading] = useState<Record<string, boolean>>({})

  // Add to references state
  const [addedDois, setAddedDois] = useState<Set<string>>(new Set())
  const [addingDois, setAddingDois] = useState<Record<string, boolean>>({})

  const toggleSource = (id: string) => {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleSearch = useCallback(async () => {
    if (!query.trim() || selectedSources.length === 0 || loading) return
    setLoading(true)
    setResults([])
    setExpandedIdx(null)
    setRelatedDois({})
    setAddedDois(new Set())
    setSourceErrors([])
    try {
      const res = await fetch('/api/literature-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), sources: selectedSources, limit: 10 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.results || [])
      setTotalResults(data.totalResults || 0)
      if (data.errors?.length > 0) setSourceErrors(data.errors)
    } catch {
      setResults([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }, [query, selectedSources, loading])

  const handleDoiLookup = useCallback(async () => {
    const input = doiInput.trim()
    if (!input || doiLoading) return
    setDoiLoading(true)
    setDoiResult(null)
    setDoiError('')
    setDoiAdded(false)
    try {
      // Determine if it's a DOI, arXiv ID, or URL
      const body: Record<string, string> = {}
      if (input.match(/^10\.\d{4,}\//)) {
        body.doi = input
      } else if (input.match(/^\d{4}\.\d{4,5}$/)) {
        body.arxivId = input
      } else if (input.startsWith('http')) {
        body.url = input
      } else {
        // Try as DOI first
        body.doi = input.startsWith('10.') ? input : `10.${input}`
      }
      const res = await fetch('/api/literature-search/doi-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setDoiError(data.error || 'Papier non trouvé')
        return
      }
      setDoiResult(data)
    } catch {
      setDoiError('Erreur lors de la résolution')
    } finally {
      setDoiLoading(false)
    }
  }, [doiInput, doiLoading])

  const copyBibTeX = useCallback(async (r: SearchResult, idx: number | string) => {
    const firstAuthor = r.authors?.split(',')[0]?.trim()?.split(' ')?.pop()?.toLowerCase() || 'author'
    const key = `${firstAuthor}${r.year}`
    const bibtex = `@article{${key},
  title={${r.title}},
  author={${r.authors}},
  year={${r.year}},
  journal={${r.journal || ''}},
  doi={${r.doi || ''}}
}`
    await navigator.clipboard.writeText(bibtex)
    setCopiedIdx(idx as number)
    setTimeout(() => setCopiedIdx(null), 2000)
  }, [])

  const fetchRelatedPapers = useCallback(async (doi: string) => {
    if (!doi || relatedDois[doi] || relatedLoading[doi]) return
    setRelatedLoading(prev => ({ ...prev, [doi]: true }))
    try {
      const res = await fetch('/api/literature-search/related', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doi, limit: 5 }),
      })
      const data = await res.json()
      if (res.ok && data.results) {
        setRelatedDois(prev => ({ ...prev, [doi]: data.results }))
      }
    } catch {
      // silently fail
    } finally {
      setRelatedLoading(prev => ({ ...prev, [doi]: false }))
    }
  }, [relatedDois, relatedLoading])

  const addToReferences = useCallback(async (r: SearchResult) => {
    // Generate a unique key for tracking (DOI or title-based)
    const trackKey = r.doi || r.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30)
    if (addedDois.has(trackKey) || addingDois[trackKey]) return
    setAddingDois(prev => ({ ...prev, [trackKey]: true }))
    try {
      const res = await fetch('/api/references', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: r.title,
          authors: r.authors,
          year: r.year || undefined,
          journal: r.journal || undefined,
          doi: r.doi || undefined,
          abstract: r.abstract || undefined,
          source: 'literature-search',
          type: 'article',
        }),
      })
      if (res.ok) {
        setAddedDois(prev => new Set(prev).add(trackKey))
      }
    } catch {
      // silently fail
    } finally {
      setAddingDois(prev => ({ ...prev, [trackKey]: false }))
    }
  }, [addedDois, addingDois])

  const sourceIcon = (source: string) => {
    const opt = SOURCE_OPTIONS.find(s => s.label === source || s.id === source)
    if (!opt) return <FileText className="h-3 w-3" />
    const Icon = opt.icon
    return <Icon className="h-3 w-3" />
  }

  const sourceBadge = (source: string) => {
    const opt = SOURCE_OPTIONS.find(s => s.label === source)
    if (!opt) return <Badge variant="outline" className="text-[9px]">{source}</Badge>
    return <Badge variant="outline" className={`text-[9px] ${opt.color}`}>{opt.label}</Badge>
  }

  const isAdded = (r: SearchResult, idx?: number | string) => {
    const key = r.doi || r.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30)
    return addedDois.has(key)
  }

  const isAdding = (r: SearchResult) => {
    const key = r.doi || r.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30)
    return !!addingDois[key]
  }

  const renderResult = (r: SearchResult, idx: number | string, isRelated = false) => (
    <div key={`${r.doi || r.title}-${idx}`} className={`rounded-xl border bg-white p-3.5 hover:shadow-md transition-shadow ${isRelated ? 'border-slate-100 bg-slate-50/50 ml-4 mr-1' : 'border-slate-200'}`}>
      <div className="flex items-start gap-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            {sourceBadge(r.source)}
            {r.isPreprint && (
              <Badge variant="outline" className="text-[9px] bg-yellow-50 text-yellow-700 border-yellow-200">
                Preprint
              </Badge>
            )}
            {r.fromCache && (
              <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                <Sparkles className="h-2.5 w-2.5" /> cache
              </span>
            )}
            {r.year && <span className="text-[10px] text-slate-400">{r.year}</span>}
            {r.citationCount !== undefined && r.citationCount > 0 && (
              <span className="text-[10px] text-slate-400">· {r.citationCount} cit.{r.citationCount >= 100 ? '+' : ''}</span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-1 line-clamp-2">{r.title}</h4>
          <p className="text-[11px] text-slate-500 line-clamp-1">{r.authors}</p>
          {r.journal && <p className="text-[10px] text-slate-400 italic mt-0.5">{r.journal}</p>}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          {r.url && (
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button
            onClick={() => copyBibTeX(r, idx)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="Copier BibTeX"
          >
            {copiedIdx === idx ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Quote className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx as number)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="Voir le résumé"
          >
            <BookOpen className="h-3.5 w-3.5" />
          </button>
          {!isRelated && r.doi && (
            <button
              onClick={() => fetchRelatedPapers(r.doi!)}
              disabled={!!relatedLoading[r.doi]}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50"
              title="Papiers similaires"
            >
              {relatedLoading[r.doi] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <GitBranch className="h-3.5 w-3.5" />}
            </button>
          )}
          <button
            onClick={() => addToReferences(r)}
            disabled={isAdded(r, idx) || isAdding(r)}
            className={`p-1.5 rounded-md transition-colors ${
              isAdded(r, idx)
                ? 'text-emerald-500'
                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-50'
            }`}
            title={isAdded(r, idx) ? 'Déjà ajouté' : 'Ajouter aux références'}
          >
            {isAdding(r) ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isAdded(r, idx) ? (
              <CheckCheck className="h-3.5 w-3.5" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {expandedIdx === idx && r.abstract && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-[11px] text-slate-600 leading-relaxed">{r.abstract}</p>
          {r.doi && (
            <p className="text-[10px] text-slate-400 mt-2 font-mono">DOI: {r.doi}</p>
          )}
        </div>
      )}

      {!isRelated && r.doi && relatedDois[r.doi] && relatedDois[r.doi].length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-[10px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            Papiers similaires ({relatedDois[r.doi].length})
          </p>
          <div className="space-y-2">
            {relatedDois[r.doi].map((related, ri) =>
              renderResult(related, `related-${idx}-${ri}`, true)
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
        <Search className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] text-emerald-700 leading-snug font-medium">
            Recherche académique multi-sources
          </p>
          <p className="text-[10px] text-emerald-600 leading-snug mt-0.5">
            6 bases de données gratuites · Cache par DOI · Retry automatique sur rate limits · Abstracts PubMed
          </p>
        </div>
      </div>

      {/* Tab switch: Search vs DOI Lookup */}
      <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as 'search' | 'doi')}>
        <TabsList className="w-full h-9">
          <TabsTrigger value="search" className="flex-1 text-xs gap-1.5">
            <Search className="h-3.5 w-3.5" />
            Recherche
          </TabsTrigger>
          <TabsTrigger value="doi" className="flex-1 text-xs gap-1.5">
            <Fingerprint className="h-3.5 w-3.5" />
            DOI / URL
          </TabsTrigger>
        </TabsList>

        {/* ─── Search Tab ──────────────────────────── */}
        <TabsContent value="search" className="mt-3 space-y-3">
          {/* Source selector */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Sources académiques</p>
            <div className="grid grid-cols-3 gap-1.5">
              {SOURCE_OPTIONS.map(s => {
                const active = selectedSources.includes(s.id)
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSource(s.id)}
                    title={s.desc}
                    className={`px-2 py-2 rounded-lg text-left transition-all ${
                      active ? s.color + ' shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <s.icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-[11px] font-medium truncate">{s.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Search input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
                placeholder="Articles, auteurs, mots-clés..."
                className="pl-9 h-10 text-sm"
              />
            </div>
            <Button onClick={handleSearch} disabled={!query.trim() || selectedSources.length === 0 || loading} className="h-10 px-4">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-1.5 text-sm">Chercher</span>
            </Button>
          </div>

          {/* Results count & errors */}
          {totalResults > 0 && (
            <p className="text-xs text-slate-500">{totalResults} résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}</p>
          )}
          {sourceErrors.length > 0 && (
            <p className="text-xs text-amber-600">⚠ {sourceErrors.length} source{sourceErrors.length > 1 ? 's' : ''} indisponible{sourceErrors.length > 1 ? 's' : ''} ({sourceErrors.join(', ')})</p>
          )}

          {/* Results list */}
          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
            {results.length === 0 && !loading && (
              <div className="text-center py-12">
                <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <p className="text-xs text-slate-500">Entrez un sujet pour rechercher dans les bases académiques</p>
              </div>
            )}
            {results.map((r, i) => renderResult(r, i))}
          </div>
        </TabsContent>

        {/* ─── DOI Lookup Tab ──────────────────────── */}
        <TabsContent value="doi" className="mt-3 space-y-3">
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
            <Fingerprint className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-snug">
              Collez un DOI, un identifiant arXiv ou une URL pour retrouver les métadonnées complètes d&apos;un papier. Résolution via Crossref + OpenAlex + Semantic Scholar en parallèle.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={doiInput}
                onChange={e => setDoiInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleDoiLookup() }}
                placeholder="10.1234/example ou 2301.00001 ou https://doi.org/..."
                className="pl-9 h-10 text-sm font-mono"
              />
            </div>
            <Button onClick={handleDoiLookup} disabled={!doiInput.trim() || doiLoading} className="h-10 px-4">
              {doiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
              <span className="ml-1.5 text-sm">Résoudre</span>
            </Button>
          </div>

          {/* DOI Error */}
          {doiError && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{doiError}</p>
            </div>
          )}

          {/* DOI Result */}
          {doiResult && !doiError && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-700">Papier trouvé</p>
                {(doiResult as Record<string, unknown>).fromCache && (
                  <Badge variant="outline" className="text-[9px] bg-slate-50">
                    <Sparkles className="h-2.5 w-2.5 mr-1" /> depuis le cache
                  </Badge>
                )}
              </div>
              {renderResult(doiResult, 'doi-result')}
              <Button
                onClick={() => { addToReferences(doiResult); setDoiAdded(true) }}
                disabled={doiAdded || isAdding(doiResult)}
                variant="outline"
                className="w-full"
                size="sm"
              >
                {doiAdded ? (
                  <><CheckCheck className="h-3.5 w-3.5 mr-1.5" /> Ajouté aux références</>
                ) : isAdding(doiResult) ? (
                  <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Ajout...</>
                ) : (
                  <><Plus className="h-3.5 w-3.5 mr-1.5" /> Ajouter aux références</>
                )}
              </Button>
            </div>
          )}

          {!doiResult && !doiError && !doiLoading && (
            <div className="text-center py-8">
              <Fingerprint className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="text-xs text-slate-500">Entrez un DOI ou une URL pour résoudre un papier</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
