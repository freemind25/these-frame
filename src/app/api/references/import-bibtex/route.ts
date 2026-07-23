import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDb } from '@/lib/db'

// POST: import references from Mendeley documents
export async function POST(request: NextRequest) {
  try {
    const { documents } = await request.json()

    if (!Array.isArray(documents)) {
      return NextResponse.json({ error: 'documents array requis' }, { status: 400 })
    }

    let imported = 0
    let skipped = 0

    for (const doc of documents) {
      const mendeleyId = doc.id
      if (!mendeleyId) { skipped++; continue }

      // Check if already imported
      const existing = await db.reference.findFirst({ where: { mendeleyId } })
      if (existing) { skipped++; continue }

      const authors = doc.authors
        ?.map((a: { first_name?: string; last_name?: string }) =>
          [a.first_name, a.last_name].filter(Boolean).join(' ')
        )
        .join('; ') || ''

      const title = doc.title || 'Sans titre'
      const year = doc.year?.toString() || ''
      const journal = doc.source || doc.journal?.name || ''
      const doi = doc.doi || ''
      const abstractText = doc.abstract || ''
      const volume = doc.volume || ''
      const pages = doc.pages || ''
      const type = doc.type === 'book' ? 'book'
        : doc.type === 'conference_proceedings' ? 'inproceedings'
        : doc.type === 'thesis' ? 'thesis'
        : 'article'

      // Generate citation key
      const firstAuthor = authors.split(';')[0]?.trim() || 'unknown'
      const lastName = firstAuthor.split(' ').pop()?.toLowerCase() || 'unknown'
      const suffix = Math.floor(Math.random() * 100)
      const citationKey = `${lastName}${year || 'xxxx'}${suffix}`

      try {
        await db.reference.create({
          data: {
            type,
            citationKey,
            title,
            authors,
            year,
            journal,
            volume,
            pages,
            doi,
            abstract: abstractText,
            source: 'mendeley',
            mendeleyId,
          },
        })
        imported++
      } catch {
        skipped++
      }
    }

    return NextResponse.json({ imported, skipped, total: documents.length })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}