import { NextRequest, NextResponse } from 'next/server'

const ANNAS_CONFIG = (await import('@/data/academic-databases')).find(d => d.id === 'annas-archive')

export async function GET(request: NextRequest) {
  try {
    const { q, page = 1, rows = 20 } = await request.nextUrl.searchParams.get('q')
    if (!q) return NextResponse.json({ error: 'Recherche requise' })
    const url = `${ANNAS_CONFIG.url}${encodeURIComponent(q)}&page=${page}&rows=${rows}`
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const data = await res.json()
    const results = (data.response?.docs || data.results || []).slice(0, rows).map((doc: any) => ({
      title: doc.title || 'Sans titre',
      authors: doc.authors || '',
      year: doc.year || '',
      abstract: doc.abstract || doc.description || '',
      url: doc.id || doc.URL || doc.href || '',
      source: 'annas-archive',
      sourceLabel: "Anna's Archive",
      sourceColor: '#8B4513',
    }))
    return NextResponse.json({ results, total: data.response?.numFound || 0 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur Anna's Archive." })
  }
}