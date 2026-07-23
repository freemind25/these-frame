import { NextRequest, NextResponse } from 'next/server'

const LIBGEN_CONFIG = (await import('@/data/academic-databases')).find(d => d.id === 'libgen-im')

export async function GET(request: NextRequest) {
  try {
    const { q, page = 1 } = await request.nextUrl.searchParams.get('q')
    if (!q) return NextResponse.json({ error: 'Recherche requise' })
    const url = `${LIBGEN_CONFIG.url}${encodeURIComponent(q)}&page=${page}`
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const data = await res.json()
    const results = (data.results || data.items || []).slice(0, 12).map((doc: any) => ({
      title: doc.title || 'Sans titre',
      authors: doc.authors || '',
      year: doc.year || '',
      abstract: doc.abstract || doc.description || '',
      url: doc.id || doc.URL || doc.href || '',
      source: 'libgen-im',
      sourceLabel: 'Library Genesis',
      sourceColor: '#7C3AED',
    }))
    return NextResponse.json({ results, total: data.total || 0 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur Library Genesis.' })
  }
}