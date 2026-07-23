import { NextRequest, NextResponse } from 'next/server'

const WELIB_CONFIG = (await import('@/data/academic-databases')).find(d => d.id === 'welib-st')

export async function GET(request: NextRequest) {
  try {
    const { q, page = 1, rows = 12 } = await request.nextUrl.searchParams.get('q')
    if (!q) return NextResponse.json({ error: 'Recherche requise' })
    const url = `${WELIB_CONFIG.url}${encodeURIComponent(q)}&page=${page}&rows=${rows}`
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const data = await res.json()
    const docs = data.docs || data.results || data.items || []
    const results = docs.slice(0, rows).map((doc: any) => ({
      title: doc.title || 'Sans titre',
      authors: doc.authors || '',
      year: doc.year || '',
      abstract: doc.abstract || doc.description || '',
      url: doc.id || doc.URL || doc.href || '',
      source: 'welib',
      sourceLabel: 'Welib',
      sourceColor: '#2563EB',
    }))
    return NextResponse.json({ results, total: data.total || 0 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur Welib.' })
  }
}