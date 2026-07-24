'use client'

import { useState, useCallback } from 'react'
import {
  Search, Loader2, ExternalLink, BookOpen, Quote, Copy, Check,
  GraduationCap, Globe, Database, FileText, Atom, Heart, Plus, CheckCheck, GitBranch,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

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
}

const SOURCE_OPTIONS = [
  { id: 'semantic_scholar', label: 'Semantic Scholar', icon: GraduationCap, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'openalex', label: 'OpenAlex', icon: Globe, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'crossref', label: 'Crossref', icon: Database, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'arxiv', label: 'arXiv', icon: Atom, color: 'bg-violet-50 text-violet-700 border-violet-200' },
  { id: 'pubmed', label: 'PubMed', icon: Heart, color: 'bg-rose-50 text-rose-700 border-rose-200' },
]

export default function LiteratureSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSources, setSelectedSources] = useState<string[]>(['openalex', 'crossref', 'arxiv'])
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const [sourceErrors, setSourceErrors] = useState<string[]>([])

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
    } catch (err) {
      setResults([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }, [query, selectedSources, loading])

  const copyBibTeX = useCallback(async (r: SearchResult, idx: number) => {
    const key = (r.authors?.split(',')[0]?.trim()?.split(' ')?.pop()?.toLowerCase() || 'author') + r.year
    const bibtex = `@article{${key},
  title={${r.title}},
  author={${r.authors}},
  year={${r.year}},
  journal={${r.journal || ''}},
  doi={${r.doi || ''}}
}`
    await navigator.clipboard.writeText(bibtex)
    setCopiedIdx(idx)
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
    if (!r.doi || addedDois.has(r.doi) || addingDois[r.doi]) return
    setAddingDois(prev => ({ ...prev, [r.doi]: true }))
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
        setAddedDois(prev => new Set(prev).add(r.doi!))
      }
    } catch {
      // silently fail
    } finally {
      setAddingDois(prev => ({ ...prev, [r.doi!]: false }))
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

  const renderResult = (r: SearchResult, idx: number, isRelated = false) => (
    <div key={`${r.doi || r.title}-${idx}`} className={`rounded-xl border bg-white p-3.5 hover:shadow-md transition-shadow ${isRelated ? 'border-slate-100 bg-slate-50/50 ml-4 mr-1' : 'border-slate-200'}`}>
      <div className="flex items-start gap-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {sourceBadge(r.source)}
            {r.year && <span className="text-[10px] text-slate-400">{r.year}</span>}
            {r.citationCount !== undefined && r.citationCount > 0 && (
              <span className="text-[10px] text-slate-400">· {r.citationCount} citations</span>
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
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="Voir le résumé"
          >
            <BookOpen className="h-3.5 w-3.5" />
          </button>
          {/* Related papers button — only for non-related results with DOI */}
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
          {/* Add to references button */}
          {r.doi && (
            <button
              onClick={() => addToReferences(r)}
              disabled={addedDois.has(r.doi) || !!addingDois[r.doi]}
              className={`p-1.5 rounded-md transition-colors ${
                addedDois.has(r.doi)
                  ? 'text-emerald-500'
                  : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-50'
              }`}
              title={addedDois.has(r.doi) ? 'Déjà ajouté' : 'Ajouter aux références'}
            >
              {addingDois[r.doi] ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : addedDois.has(r.doi) ? (
                <CheckCheck className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
            </button>
          )}
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

      {/* Related papers for this result */}
      {!isRelated && r.doi && relatedDois[r.doi] && relatedDois[r.doi].length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-[10px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            Papiers similaires ({relatedDois[r.doi].length})
          </p>
          <div className="space-y-2">
            {relatedDois[r.doi].map((related, ri) =>
              renderResult(related, `related-${idx}-${ri}` as unknown as number, true)
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
        <Search className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        <p className="text-[11px] text-emerald-700 leading-snug">
          Recherche multi-sources sans limite · 4 APIs académiques gratuites + PubMed · Résultats dédupliqués par DOI
        </p>
      </div>

      {/* Source selector */}
      <div>
        <p className="text-xs font-semibold text-slate-700 mb-2">Sources académiques</p>
        <div className="flex flex-wrap gap-1.5">
          {SOURCE_OPTIONS.map(s => {
            const active = selectedSources.includes(s.id)
            return (
              <button
                key={s.id}
                onClick={() => toggleSource(s.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                  active ? s.color + ' shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                <s.icon className="h-3 w-3 inline mr-1 -mt-0.5" />
                {s.label}
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
            placeholder="Rechercher des articles, auteurs, mots-clés..."
            className="pl-9 h-10 text-sm"
          />
        </div>
        <Button onClick={handleSearch} disabled={!query.trim() || selectedSources.length === 0 || loading} className="h-10 px-4">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="ml-1.5 text-sm">Chercher</span>
        </Button>
      </div>

      {/* Results */}
      {totalResults > 0 && (
        <p className="text-xs text-slate-500">{totalResults} résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}</p>
      )}
      {sourceErrors.length > 0 && (
        <p className="text-xs text-amber-600">⚠ {sourceErrors.length} source{sourceErrors.length > 1 ? 's' : ''} indisponible{sourceErrors.length > 1 ? 's' : ''} ({sourceErrors.join(', ')})</p>
      )}

      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {results.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-3" />
            <p className="text-xs text-slate-500">Entrez un sujet pour rechercher dans les bases académiques</p>
          </div>
        )}

        {results.map((r, i) => renderResult(r, i))}
      </div>
    </div>
  )
}