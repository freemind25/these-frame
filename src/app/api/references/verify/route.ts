import { NextRequest, NextResponse } from 'next/server'
import { searchCache, fetchWithRetry } from '@/lib/search-cache'

const UA = { 'User-Agent': 'ThesisFrame/1.0 (mailto:thesisframe@example.com)' }

interface RefInput {
  id: string
  title: string
  authors: string
  year: string | null
  doi: string | null
  journal: string | null
}

interface VerifyResult {
  referenceId: string
  doi: string | null
  status: 'valid' | 'not_found' | 'mismatch' | 'no_doi' | 'error'
  issues: string[]
  verifiedTitle?: string
  verifiedAuthors?: string
  verifiedYear?: string
  verifiedJournal?: string
  verifiedDoi?: string
  source?: string
}

// Verify a single DOI against Crossref
async function verifyDoi(doi: string): Promise<{
  found: boolean
  title?: string
  authors?: string
  year?: string
  journal?: string
}> {
  // Check cache first
  const cached = searchCache.getByDoi(doi)
  if (cached) {
    return {
      found: true,
      title: cached.title,
      authors: cached.authors,
      year: cached.year || undefined,
      journal: cached.journal || undefined,
    }
  }

  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`
  const res = await fetchWithRetry(url, { headers: UA }, 1, 1000)
  if (!res.ok) return { found: false }

  const data = await res.json()
  const msg = data?.message as Record<string, unknown> | undefined
  if (!msg) return { found: false }

  const title = ((msg.title as string[]) || [''])[0]
  const authors = ((msg.author as Record<string, unknown>[]) || []).map(
    a => `${a.given || ''} ${a.family || ''}`.trim()
  ).join(', ')
  const year = ((msg['published-print'] as Record<string, unknown>)?.date_parts as number[][])?.[0]?.[0]
    || ((msg['published-online'] as Record<string, unknown>)?.date_parts as number[][])?.[0]?.[0]
    || ((msg.created as Record<string, unknown>)?.date_parts as number[][])?.[0]?.[0]
  const journal = ((msg['container-title'] as string[]) || [''])[0]

  // Cache it
  searchCache.setByDoi({
    title, authors, year: String(year || ''), source: 'Crossref',
    doi, url: `https://doi.org/${doi}`, journal,
  })

  return { found: true, title, authors, year: year ? String(year) : undefined, journal }
}

// Fuzzy title comparison
function titlesMatch(a: string, b: string): boolean {
  const normalize = (s: string) => s
    .toLowerCase()
    .replace(/[^a-z0-9àâäéèêëïîôùûüÿçœæ\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const na = normalize(a)
  const nb = normalize(b)
  if (na === nb) return true
  if (na.includes(nb) || nb.includes(na)) return true

  const wordsA = new Set(na.split(' ').filter(w => w.length > 3))
  const wordsB = new Set(nb.split(' ').filter(w => w.length > 3))
  if (wordsA.size === 0 || wordsB.size === 0) return false

  let overlap = 0
  for (const w of wordsA) { if (wordsB.has(w)) overlap++ }
  return overlap / Math.max(wordsA.size, wordsB.size) >= 0.7
}

async function verifyReferences(refs: RefInput[]): Promise<{ results: VerifyResult[]; summary: Record<string, number> }> {
  const results: VerifyResult[] = []

  // Process DOIs in batches of 3
  const batchSize = 3
  for (let i = 0; i < refs.length; i += batchSize) {
    const batch = refs.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(
      batch.map(async (ref): Promise<VerifyResult> => {
        if (!ref.doi) {
          return { referenceId: ref.id, doi: null, status: 'no_doi', issues: ['Aucun DOI — vérification impossible'] }
        }

        try {
          const verified = await verifyDoi(ref.doi)

          if (!verified.found) {
            return { referenceId: ref.id, doi: ref.doi, status: 'not_found', issues: [`DOI non trouvé dans Crossref : ${ref.doi}`] }
          }

          const issues: string[] = []
          if (verified.title && !titlesMatch(ref.title, verified.title)) {
            issues.push(`Titre : « ${ref.title.slice(0, 50)}… » ≠ « ${verified.title.slice(0, 50)}… »`)
          }
          if (verified.year && ref.year && verified.year !== ref.year) {
            issues.push(`Année : ${ref.year} vs ${verified.year}`)
          }
          if (verified.authors && ref.authors) {
            const last = (s: string) => s.split(/[,;]/)[0].trim().split(/\s+/).pop()?.toLowerCase() || ''
            const la = last(ref.authors)
            const lv = last(verified.authors)
            if (la && lv && la !== lv && !lv.includes(la) && !la.includes(lv)) {
              issues.push(`Premier auteur : ${la} vs ${lv}`)
            }
          }

          if (issues.length > 0) {
            return {
              referenceId: ref.id, doi: ref.doi, status: 'mismatch', issues,
              verifiedTitle: verified.title, verifiedAuthors: verified.authors,
              verifiedYear: verified.year, verifiedJournal: verified.journal, source: 'Crossref',
            }
          }
          return { referenceId: ref.id, doi: ref.doi, status: 'valid', issues: [], verifiedTitle: verified.title, source: 'Crossref' }
        } catch (err) {
          return { referenceId: ref.id, doi: ref.doi, status: 'error', issues: [`Erreur : ${err instanceof Error ? err.message : 'inconnue'}`] }
        }
      })
    )
    for (const r of batchResults) { if (r.status === 'fulfilled') results.push(r.value) }
  }

  const summary = {
    total: results.length,
    valid: results.filter(r => r.status === 'valid').length,
    notFound: results.filter(r => r.status === 'not_found').length,
    mismatch: results.filter(r => r.status === 'mismatch').length,
    noDoi: results.filter(r => r.status === 'no_doi').length,
    error: results.filter(r => r.status === 'error').length,
  }

  return { results, summary }
}

// POST: verify a list of references (sent from frontend)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Two modes: verify or auto-fix
    if (body.referenceId && body.verifiedTitle) {
      // Auto-fix mode
      const { referenceId, verifiedTitle, verifiedAuthors, verifiedYear, verifiedJournal, verifiedDoi } = body
      const updates: Record<string, string> = {}
      if (verifiedTitle) updates.title = verifiedTitle
      if (verifiedAuthors) updates.authors = verifiedAuthors
      if (verifiedYear) updates.year = verifiedYear
      if (verifiedJournal) updates.journal = verifiedJournal
      if (verifiedDoi) updates.doi = verifiedDoi

      const res = await fetch(`/api/references?id=${referenceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) return NextResponse.json({ error: 'Failed to update reference' }, { status: 502 })
      return NextResponse.json({ success: true, updated: Object.keys(updates) })
    }

    // Verify mode: expect { references: [...] }
    const refs: RefInput[] = body.references || []
    if (refs.length === 0) {
      return NextResponse.json({ results: [], summary: { total: 0, valid: 0, notFound: 0, mismatch: 0, noDoi: 0, error: 0 } })
    }

    const { results, summary } = await verifyReferences(refs)
    return NextResponse.json({ results, summary })
  } catch (error) {
    console.error('[POST /api/references/verify] Error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
