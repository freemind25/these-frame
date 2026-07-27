import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDb } from '@/lib/db'

// POST /api/thesis/switch-mode — Switch structure mode with migration
export async function POST(request: NextRequest) {
  try {
    await ensureDb()
    const body = await request.json()
    const { mode } = body

    if (!['chapters', 'parts'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
    }

    const thesis = await db.thesis.findFirst({
      include: {
        chapters: { orderBy: { order: 'asc' } },
        parts: { orderBy: { order: 'asc' } },
      },
    })
    if (!thesis) {
      return NextResponse.json({ error: 'No thesis found' }, { status: 404 })
    }

    if (thesis.structureMode === mode) {
      return NextResponse.json(thesis)
    }

    if (mode === 'parts') {
      const part = await db.part.create({
        data: { thesisId: thesis.id, title: 'Partie I', order: 1 },
      })
      await db.chapter.updateMany({
        where: { thesisId: thesis.id },
        data: { partId: part.id },
      })
    } else {
      await db.chapter.updateMany({
        where: { thesisId: thesis.id, partId: { not: null } },
        data: { partId: null },
      })
      await db.part.deleteMany({ where: { thesisId: thesis.id } })
    }

    const updated = await db.thesis.update({
      where: { id: thesis.id },
      data: { structureMode: mode },
      include: {
        chapters: { orderBy: { order: 'asc' } },
        parts: { orderBy: { order: 'asc' } },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[POST /api/thesis/switch-mode] Error:', msg, error)
    return NextResponse.json({ error: 'Failed to switch mode', detail: msg }, { status: 500 })
  }
}
