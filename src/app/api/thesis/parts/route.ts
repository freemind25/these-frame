import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDb } from '@/lib/db'
import { renumberChapters } from '@/lib/chapter-numbering'

// POST /api/thesis/parts — Create a new part
export async function POST(request: NextRequest) {
  try {
    await ensureDb()
    const body = await request.json()
    const { title, insertAfterOrder } = body

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const thesis = await db.thesis.findFirst()
    if (!thesis) {
      return NextResponse.json({ error: 'No thesis found' }, { status: 404 })
    }

    const existingParts = await db.part.findMany({
      where: { thesisId: thesis.id },
      orderBy: { order: 'asc' },
    })

    let newOrder: number
    if (insertAfterOrder !== undefined && insertAfterOrder !== null) {
      newOrder = insertAfterOrder + 1
      for (const p of existingParts) {
        if (p.order >= newOrder) {
          await db.part.update({ where: { id: p.id }, data: { order: p.order + 1 } })
        }
      }
    } else {
      newOrder = existingParts.length > 0 ? Math.max(...existingParts.map(p => p.order)) + 1 : 1
    }

    const part = await db.part.create({
      data: {
        thesisId: thesis.id,
        title: title.trim(),
        order: newOrder,
      },
    })

    let switchedMode = false
    // Switch thesis to parts mode if not already
    if (thesis.structureMode !== 'parts') {
      await db.thesis.update({
        where: { id: thesis.id },
        data: { structureMode: 'parts' },
      })
      // Assign all chapters to the first part
      if (existingParts.length === 0) {
        await db.chapter.updateMany({
          where: { thesisId: thesis.id },
          data: { partId: part.id },
        })
      }
      switchedMode = true
    }

    // Renumber chapters if we switched mode
    if (switchedMode) {
      await renumberChapters(thesis.id, 'parts')
    }

    // Return full thesis for state refresh
    const updatedThesis = await db.thesis.findFirst({
      where: { id: thesis.id },
      include: { chapters: { orderBy: { order: 'asc' } }, parts: { orderBy: { order: 'asc' } } },
    })
    return NextResponse.json(updatedThesis, { status: 201 })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[POST /api/thesis/parts] Error:', msg, error)
    return NextResponse.json({ error: 'Failed to create part', detail: msg }, { status: 500 })
  }
}

// PATCH /api/thesis/parts — Reorder or rename a part
export async function PATCH(request: NextRequest) {
  try {
    await ensureDb()
    const body = await request.json()
    const { partId, title, direction } = body

    if (title !== undefined) {
      // Rename
      const updated = await db.part.update({
        where: { id: partId },
        data: { title },
      })
      return NextResponse.json(updated)
    }

    if (direction && ['up', 'down'].includes(direction)) {
      // Reorder
      const part = await db.part.findUnique({ where: { id: partId } })
      if (!part) return NextResponse.json({ error: 'Part not found' }, { status: 404 })

      const sibling = await db.part.findFirst({
        where: {
          thesisId: part.thesisId,
          ...(direction === 'up' ? { order: part.order - 1 } : { order: part.order + 1 }),
        },
      })
      if (!sibling) {
        return NextResponse.json({ error: `Cannot move ${direction}` }, { status: 400 })
      }

      await db.$transaction([
        db.part.update({ where: { id: part.id }, data: { order: sibling.order } }),
        db.part.update({ where: { id: sibling.id }, data: { order: part.order } }),
      ])

      // Renumber chapters after part reorder
      await renumberChapters(part.thesisId, 'parts')

      const thesis = await db.thesis.findFirst({
        where: { id: part.thesisId },
        include: { chapters: { orderBy: { order: 'asc' } }, parts: { orderBy: { order: 'asc' } } },
      })
      return NextResponse.json(thesis)
    }

    return NextResponse.json({ error: 'Missing title or direction' }, { status: 400 })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[PATCH /api/thesis/parts] Error:', msg, error)
    return NextResponse.json({ error: 'Failed to update part', detail: msg }, { status: 500 })
  }
}
