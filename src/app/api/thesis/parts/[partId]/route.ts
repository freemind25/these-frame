import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDb } from '@/lib/db'

// DELETE /api/thesis/parts/[partId] — Delete part, unassign its chapters, reindex
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ partId: string }> },
) {
  try {
    await ensureDb()
    const { partId } = await params

    const part = await db.part.findUnique({ where: { id: partId } })
    if (!part) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 })
    }

    // Unassign all chapters from this part
    await db.chapter.updateMany({
      where: { partId },
      data: { partId: null },
    })

    // Delete the part
    await db.part.delete({ where: { id: partId } })

    // Reindex remaining parts
    const remaining = await db.part.findMany({
      where: { thesisId: part.thesisId },
      orderBy: { order: 'asc' },
    })
    await db.$transaction(
      remaining.map((p, i) =>
        db.part.update({ where: { id: p.id }, data: { order: i + 1 } })
      )
    )

    // If no parts left, switch back to chapters mode
    if (remaining.length === 0) {
      await db.thesis.update({
        where: { id: part.thesisId },
        data: { structureMode: 'chapters' },
      })
    }

    const thesis = await db.thesis.findFirst({
      where: { id: part.thesisId },
      include: { chapters: { orderBy: { order: 'asc' } }, parts: { orderBy: { order: 'asc' } } },
    })
    return NextResponse.json(thesis)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[DELETE /api/thesis/parts/:id] Error:', msg, error)
    return NextResponse.json({ error: 'Failed to delete part', detail: msg }, { status: 500 })
  }
}
