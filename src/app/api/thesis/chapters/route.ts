import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDb } from '@/lib/db'

// POST /api/thesis/chapters — Create a new chapter
export async function POST(request: NextRequest) {
  try {
    await ensureDb()
    const body = await request.json()
    const { title, insertAfterOrder } = body

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 },
      )
    }

    // Find thesis
    const thesis = await db.thesis.findFirst()
    if (!thesis) {
      return NextResponse.json(
        { error: 'No thesis found' },
        { status: 404 },
      )
    }

    // Get current max order
    const chapters = await db.chapter.findMany({
      where: { thesisId: thesis.id },
      orderBy: { order: 'asc' },
    })

    let newOrder: number
    if (insertAfterOrder !== undefined && insertAfterOrder !== null) {
      // Insert after the chapter with the given order
      newOrder = insertAfterOrder + 1
      // Shift all chapters with order >= newOrder down by 1
      for (const ch of chapters) {
        if (ch.order >= newOrder) {
          await db.chapter.update({ where: { id: ch.id }, data: { order: ch.order + 1 } })
        }
      }
    } else {
      // Append at the end
      newOrder = chapters.length > 0 ? Math.max(...chapters.map(c => c.order)) + 1 : 1
    }

    // Generate a human-friendly number based on position
    const romanNumerals = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX']
    const number = newOrder <= 20 ? romanNumerals[newOrder - 1] : String(newOrder)

    const chapter = await db.chapter.create({
      data: {
        thesisId: thesis.id,
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
    return NextResponse.json(
      { error: 'Failed to create chapter', detail: msg },
      { status: 500 },
    )
  }
}

// POST /api/thesis/chapters/reorder — Swap two chapters' order
export async function PATCH(request: NextRequest) {
  try {
    await ensureDb()
    const body = await request.json()
    const { chapterId, direction } = body

    if (!chapterId || !['up', 'down'].includes(direction)) {
      return NextResponse.json(
        { error: 'chapterId and direction (up/down) are required' },
        { status: 400 },
      )
    }

    const chapter = await db.chapter.findUnique({ where: { id: chapterId } })
    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 },
      )
    }

    // Find sibling
    const sibling = await db.chapter.findFirst({
      where: {
        thesisId: chapter.thesisId,
        ...(direction === 'up' ? { order: chapter.order - 1 } : { order: chapter.order + 1 }),
      },
    })

    if (!sibling) {
      return NextResponse.json(
        { error: `Cannot move ${direction} — already at the ${direction === 'up' ? 'top' : 'bottom'}` },
        { status: 400 },
      )
    }

    // Swap orders in a transaction
    await db.$transaction([
      db.chapter.update({ where: { id: chapter.id }, data: { order: sibling.order } }),
      db.chapter.update({ where: { id: sibling.id }, data: { order: chapter.order } }),
    ])

    // Return updated thesis with reordered chapters
    const updatedThesis = await db.thesis.findFirst({
      where: { id: chapter.thesisId },
      include: { chapters: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json(updatedThesis)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[PATCH /api/thesis/chapters/reorder] Error:', msg, error)
    return NextResponse.json(
      { error: 'Failed to reorder chapter', detail: msg },
      { status: 500 },
    )
  }
}
