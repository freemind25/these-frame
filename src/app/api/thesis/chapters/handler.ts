import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDb } from '@/lib/db'
import { chapterNumber, renumberChapters } from '@/lib/chapter-numbering'

// POST /api/thesis/chapters — Create a new chapter
export async function POST(request: NextRequest) {
  try {
    await ensureDb()
    const body = await request.json()
    const { title, insertAfterOrder, partId } = body

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const thesis = await db.thesis.findFirst()
    if (!thesis) {
      return NextResponse.json({ error: 'No thesis found' }, { status: 404 })
    }

    const isParts = thesis.structureMode === 'parts'

    // Determine the chapter list scope
    const whereClause: Record<string, unknown> = { thesisId: thesis.id }
    if (isParts && partId) {
      whereClause.partId = partId
    }

    const chapters = await db.chapter.findMany({
      where: whereClause,
      orderBy: { order: 'asc' },
    })

    let newOrder: number
    if (insertAfterOrder !== undefined && insertAfterOrder !== null) {
      newOrder = insertAfterOrder + 1
      // Shift chapters with order >= newOrder (within same scope)
      for (const ch of chapters) {
        if (ch.order >= newOrder) {
          await db.chapter.update({ where: { id: ch.id }, data: { order: ch.order + 1 } })
        }
      }
    } else {
      newOrder = chapters.length > 0 ? Math.max(...chapters.map(c => c.order)) + 1 : 1
    }

    // Compute display number
    const position = chapters.filter(c => c.order <= newOrder).length + 1
    let partIndex: number | undefined
    if (isParts && partId) {
      const parts = await db.part.findMany({ where: { thesisId: thesis.id }, orderBy: { order: 'asc' } })
      const idx = parts.findIndex(p => p.id === partId)
      partIndex = idx >= 0 ? idx : 0
    }
    const number = chapterNumber(position, thesis.structureMode, partIndex)

    const chapter = await db.chapter.create({
      data: {
        thesisId: thesis.id,
        partId: partId || null,
        order: newOrder,
        number,
        title: title.trim(),
        content: '',
        wordCount: 0,
        status: 'draft',
      },
    })

    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[POST /api/thesis/chapters] Error:', msg, error)
    return NextResponse.json({ error: 'Failed to create chapter', detail: msg }, { status: 500 })
  }
}

// PATCH /api/thesis/chapters — Reorder a chapter (within part scope in parts mode)
export async function PATCH(request: NextRequest) {
  try {
    await ensureDb()
    const body = await request.json()
    const { chapterId, direction } = body

    if (!chapterId || !['up', 'down'].includes(direction)) {
      return NextResponse.json({ error: 'chapterId and direction (up/down) are required' }, { status: 400 })
    }

    const chapter = await db.chapter.findUnique({ where: { id: chapterId } })
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    const thesis = await db.thesis.findFirst({ where: { id: chapter.thesisId } })
    const isParts = thesis?.structureMode === 'parts'

    // In parts mode, sibling must be in the same part
    const siblingWhere: Record<string, unknown> = {
      thesisId: chapter.thesisId,
      ...(direction === 'up' ? { order: chapter.order - 1 } : { order: chapter.order + 1 }),
    }
    if (isParts && chapter.partId) {
      siblingWhere.partId = chapter.partId
    }

    const sibling = await db.chapter.findFirst({ where: siblingWhere })

    if (!sibling) {
      return NextResponse.json(
        { error: `Cannot move ${direction} — already at the ${direction === 'up' ? 'top' : 'bottom'}` },
        { status: 400 },
      )
    }

    // Swap orders
    await db.$transaction([
      db.chapter.update({ where: { id: chapter.id }, data: { order: sibling.order } }),
      db.chapter.update({ where: { id: sibling.id }, data: { order: chapter.order } }),
    ])

    // Renumber within the affected scope
    if (isParts) {
      await renumberChapters(chapter.thesisId, 'parts')
    }

    const updatedThesis = await db.thesis.findFirst({
      where: { id: chapter.thesisId },
      include: { chapters: { orderBy: { order: 'asc' } }, parts: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json(updatedThesis)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[PATCH /api/thesis/chapters] Error:', msg, error)
    return NextResponse.json({ error: 'Failed to reorder chapter', detail: msg }, { status: 500 })
  }
}
