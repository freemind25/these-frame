import { NextRequest, NextResponse } from 'next/server'

// ─── Types ──────────────────────────────────────────────────
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

// ─── Semantic Scholar (no API key needed, generous limits) ──
async function searchSemanticScholar(query: string, limit: number): Promise<SearchResult[]> {
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=${limit}&fields=title,authors,year,abstract,citationCount,externalIds,journal`
  const res = await fetch(url, { headers: { 'User-Agent': 'ThesisFrame/1.0' } })
  if (!res.ok) return []
  const data = await res.json()
  return (data.data || []).map((p: Record<string, unknown>) => {
    const authors = ((p.authors as Record<string, string>[]) || []).map(a => a.name).join(', ')
    const extIds = (p.externalIds as Record<string, string>) || {}
    return {
      title: p.title || '',
      authors,
      year: String(p.year || ''),
      abstract: (p.abstract as string) || undefined,
      source: 'Semantic Scholar',
      doi: extIds.DOI || undefined,
      url: extIds.URL || undefined,
      citationCount: (p.citationCount as number) || 0,
      journal: ((p.journal as Record<string, string>) || {}).name || undefined,
    }
  })
}

// ─── OpenAlex (no API key needed, no rate limits) ────────────
async function searchOpenAlex(query: string, limit: number): Promise<SearchResult[]> {
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=${limit}&select=title,authorships,publication_year,cited_by_count,doi,primary_location`
  const res = await fetch(url, { headers: { 'User-Agent': 'ThesisFrame/1.0' } })
  if (!res.ok) return []
  const data = await res.json()
  return (data.results || []).map((r: Record<string, unknown>) => {
    const authorships = (r.authorships as Record<string, unknown>[]) || []
    const authors = authorships.map(a => (a.author as Record<string, string>).display_name).join(', ')
    const loc = (r.primary_location as Record<string, unknown>) || {}
    const source = (loc.source as Record<string, string>) || {}
    return {
      title: r.title || '',
      authors,
      year: String(r.publication_year || ''),
      source: 'OpenAlex',
      doi: (r.doi as string)?.replace('https://doi.org/', '') || undefined,
      url: (r.doi as string) || undefined,
      citationCount: (r.cited_by_count as number) || 0,
      journal: source.display_name || undefined,
    }
  })
}

// ─── Crossref (no API key needed) ────────────────────────────
async function searchCrossref(query: string, limit: number): Promise<SearchResult[]> {
  const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=${limit}&select=title,author,published-print,DOI,abstract,container-title`
  const res = await fetch(url, { headers: { 'User-Agent': 'ThesisFrame/1.0 (mailto:thesis@example.com)' } })
  if (!res.ok) return []
  const data = await res.json()
  const msg = data?.message as Record<string, unknown> | undefined
  const items = (msg?.items as Record<string, unknown>[]) || []
  return items.map(item => {
    const authors = ((item.author as Record<string, unknown>[]) || []).map(
      a => `${a.given || ''} ${a.family || ''}`.trim()
    ).join(', ')
    const year = ((item['published-print'] as Record<string, unknown>)?.date_parts as number[][])?.[0]?.[0]
    return {
      title: ((item.title as string[]) || [''])[0],
      authors,
      year: String(year || ''),
      abstract: (item.abstract as string)?.replace(/<[^>]*>/g, '') || undefined,
      source: 'Crossref',
      doi: (item.DOI as string) || undefined,
      url: (item.DOI as string) ? `https://doi.org/${item.DOI}` : undefined,
    }
  })
}

// ─── arXiv (no API key needed) ───────────────────────────────
async function searchArxiv(query: string, limit: number): Promise<SearchResult[]> {
  const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${limit}`
  const res = await fetch(url, { headers: { 'User-Agent': 'ThesisFrame/1.0' } })
  if (!res.ok) return []
  const text = await res.text()
  const results: SearchResult[] = []
  // Simple XML parsing with regex
  const entries = text.split('<entry>').slice(1)
  for (const entry of entries.slice(0, limit)) {
    const title = (entry.match(/<title>(.*?)<\/title>/s)?.[1] || '').replace(/\s+/g, ' ').trim()
    const authors = [...entry.matchAll(/<name>(.*?)<\/name>/g)].map(m => m[1].trim()).join(', ')
    const year = (entry.match(/<published>(\d{4})/)?.[1]) || ''
    const summary = (entry.match(/<summary>(.*?)<\/summary>/s)?.[1] || '').replace(/\s+/g, ' ').trim()
    const id = (entry.match(/<id>(.*?)<\/id>/)?.[1]) || ''
    const doi = (entry.match(/<doi>(.*?)<\/doi>/)?.[1]) || undefined
    results.push({
      title,
      authors,
      year,
      abstract: summary || undefined,
      source: 'arXiv',
      doi,
      url: id || undefined,
    })
  }
  return results
}

// ─── PubMed E-utils (no API key needed, 3 req/sec) ──────────
async function searchPubmed(query: string, limit: number): Promise<SearchResult[]> {
  try {
    // Step 1: Search for PMIDs
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=${limit}&term=${encodeURIComponent(query)}`
    const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': 'ThesisFrame/1.0' } })
    if (!searchRes.ok) return []
    const searchData = await searchRes.json()
    const idList: string[] = searchData?.esearchresult?.idlist || []
    if (idList.length === 0) return []

    // Step 2: Fetch summaries
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${idList.join(',')}`
    const summaryRes = await fetch(summaryUrl, { headers: { 'User-Agent': 'ThesisFrame/1.0' } })
    if (!summaryRes.ok) return []
    const summaryData = await summaryRes.json()
    const uidMap = summaryData?.result?.uids || []

    const results: SearchResult[] = []
    for (const uid of uidMap) {
      const item = summaryData?.result?.[uid] as Record<string, unknown> | undefined
      if (!item || !item.title) continue

      const authorsList = (item.authors as Record<string, string>[]) || []
      const authorNames = authorsList.map(a => a.name).join(', ')

      // Extract year from pubdate or sortpubdate
      const pubdate = (item.pubdate as string) || (item.sortpubdate as string) || ''
      const yearMatch = pubdate.match(/\d{4}/)
      const year = yearMatch ? yearMatch[0] : ''

      // Extract DOI from articleids array
      const articleIds = (item.articleids as Record<string, string>[]) || []
      const doiEntry = articleIds.find(a => a.idtype === 'doi')
      const doi = doiEntry?.value || undefined

      // Get PMC link for full text
      const pmcEntry = articleIds.find(a => a.idtype === 'pmc')
      const url = pmcEntry ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcEntry.value}/` : undefined

      // Extract journal from source or fulljournalname
      const journal = (item.fulljournalname as string) || (item.source as string) || undefined

      results.push({
        title: (item.title as string) || '',
        authors: authorNames,
        year,
        abstract: undefined, // PubMed esummary doesn't return abstracts
        source: 'PubMed',
        doi,
        url,
        journal,
      })
    }
    return results
  } catch {
    return []
  }
}

// ─── Deduplication helpers ──────────────────────────────────
function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function resultScore(r: SearchResult): number {
  let score = 0
  if (r.abstract) score += 10
  if (r.citationCount !== undefined && r.citationCount > 0) score += 5
  if (r.doi) score += 3
  if (r.journal) score += 2
  if (r.authors) score += 1
  return score
}

function deduplicateResults(results: SearchResult[]): SearchResult[] {
  const seen: Map<string, SearchResult> = new Map()
  const titleSeen: Map<string, SearchResult> = new Map()

  for (const r of results) {
    if (r.doi) {
      const key = r.doi.toLowerCase()
      const existing = seen.get(key)
      if (!existing || resultScore(r) > resultScore(existing)) {
        seen.set(key, r)
      }
    } else {
      // No DOI — deduplicate by normalized title
      const normalized = normalizeTitle(r.title)
      if (!normalized) continue
      const existing = titleSeen.get(normalized)
      if (!existing || resultScore(r) > resultScore(existing)) {
        titleSeen.set(normalized, r)
      }
    }
  }

  return [...seen.values(), ...titleSeen.values()]
}

// ─── Main Route ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { query, sources = ['semantic_scholar', 'openalex'], limit = 10 } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const safeLimit = Math.min(Math.max(limit, 1), 20)

    // Launch all searches in parallel
    const searches: Promise<SearchResult[]>[] = []

    if (sources.includes('semantic_scholar')) {
      searches.push(searchSemanticScholar(query, safeLimit))
    }
    if (sources.includes('openalex')) {
      searches.push(searchOpenAlex(query, safeLimit))
    }
    if (sources.includes('crossref')) {
      searches.push(searchCrossref(query, safeLimit))
    }
    if (sources.includes('arxiv')) {
      searches.push(searchArxiv(query, safeLimit))
    }
    if (sources.includes('pubmed')) {
      searches.push(searchPubmed(query, safeLimit))
    }

    const rawResults = (await Promise.allSettled(searches)).flatMap(r =>
      r.status === 'fulfilled' ? r.value : []
    )

    const results = deduplicateResults(rawResults)

    return NextResponse.json({
      query,
      totalResults: results.length,
      results,
    })
  } catch (error) {
    console.error('[POST /api/literature-search] Error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 },
    )
  }
}
