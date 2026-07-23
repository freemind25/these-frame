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

// ─── Resolve paper ID for Semantic Scholar ──────────────────
async function resolvePaperId(opts: { doi?: string; arxivId?: string; paperId?: string }): Promise<string | null> {
  // If paperId is already given, use it directly
  if (opts.paperId) return opts.paperId

  // If DOI is given, resolve to Semantic Scholar paperId
  if (opts.doi) {
    const url = `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(opts.doi)}?fields=paperId`
    const res = await fetch(url, { headers: { 'User-Agent': 'ThesisFrame/1.0' } })
    if (!res.ok) return null
    const data = await res.json()
    return data.paperId || null
  }

  // If arXiv ID is given, resolve to Semantic Scholar paperId
  if (opts.arxivId) {
    const url = `https://api.semanticscholar.org/graph/v1/paper/ARXIV:${encodeURIComponent(opts.arxivId)}?fields=paperId`
    const res = await fetch(url, { headers: { 'User-Agent': 'ThesisFrame/1.0' } })
    if (!res.ok) return null
    const data = await res.json()
    return data.paperId || null
  }

  return null
}

// ─── Main Route ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { doi, arxivId, paperId, limit = 5 } = await request.json()

    if (!doi && !arxivId && !paperId) {
      return NextResponse.json({ error: 'At least one of doi, arxivId, or paperId is required' }, { status: 400 })
    }

    const safeLimit = Math.min(Math.max(limit, 1), 20)

    // Resolve to Semantic Scholar paperId
    const resolvedId = await resolvePaperId({ doi, arxivId, paperId })
    if (!resolvedId) {
      return NextResponse.json({ error: 'Could not resolve paper' }, { status: 404 })
    }

    // Fetch related papers
    const url = `https://api.semanticscholar.org/graph/v1/paper/${encodeURIComponent(resolvedId)}/related?fields=title,authors,year,abstract,citationCount,externalIds,journal&limit=${safeLimit}`
    const res = await fetch(url, { headers: { 'User-Agent': 'ThesisFrame/1.0' } })
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch related papers' }, { status: 502 })
    }
    const data = await res.json()

    const results: SearchResult[] = (data.data || []).map((p: Record<string, unknown>) => {
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

    return NextResponse.json({
      paperId: resolvedId,
      totalResults: results.length,
      results,
    })
  } catch (error) {
    console.error('[POST /api/literature-search/related] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch related papers' },
      { status: 500 },
    )
  }
}
