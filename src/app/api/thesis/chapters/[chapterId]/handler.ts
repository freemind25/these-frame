import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDb } from '@/lib/db'
import { renumberChapters } from '@/lib/chapter-numbering'

// GET /api/thesis/chapters/[chapterId] — Get a single chapter
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> },
) {
  try {
    await ensureDb()
    const { chapterId } = await params

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 },
      )
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('[GET /api/thesis/chapters/:id] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapter' },
      { status: 500 },
    )
  }
}

// PATCH /api/thesis/chapters/[chapterId] — Save chapter content (auto-compute wordCount)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> },
) {
  try {
    await ensureDb()
    const { chapterId } = await params
    const body = await request.json()
    const { title, content, status, directorFeedback } = body

    // Verify chapter exists
    const existing = await db.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 },
      )
    }

    // Build update payload
    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (status !== undefined) updateData.status = status
    if (directorFeedback !== undefined) {
      updateData.directorFeedback = directorFeedback
      updateData.directorFeedbackAt = new Date()
    }

    // If content is provided, auto-compute word count
    if (content !== undefined) {
      updateData.content = content
      updateData.wordCount = content
        .split(/\s+/)
        .filter((word: string) => word.length > 0).length
    }

    const updated = await db.chapter.update({
      where: { id: chapterId },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PATCH /api/thesis/chapters/:id] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update chapter' },
      { status: 500 },
    )
  }
}

// DELETE /api/thesis/chapters/[chapterId] — Delete chapter and reindex orders
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> },
) {
  try {
    await ensureDb()
    const { chapterId } = await params

    // Verify chapter exists
    const existing = await db.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 },
      )
    }

    // Delete the chapter
    await db.chapter.delete({
      where: { id: chapterId },
    })

    // Reindex remaining chapters: close the gap
    const thesis = await db.thesis.findFirst({ where: { id: existing.thesisId } })
    const mode = thesis?.structureMode || 'chapters'
    const remaining = await db.chapter.findMany({
      where: { thesisId: existing.thesisId },
      orderBy: { order: 'asc' },
    })

    await db.$transaction(
      remaining.map((ch, i) =>
        db.chapter.update({
          where: { id: ch.id },
          data: { order: i + 1 },
        })
      )
    )

    // Renumber with proper format (parts mode uses Part.Chapter)
    await renumberChapters(existing.thesisId, mode)

    // Return updated thesis
    const updatedThesis = await db.thesis.findFirst({
      where: { id: existing.thesisId },
      include: { chapters: { orderBy: { order: 'asc' } }, parts: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json(updatedThesis)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[DELETE /api/thesis/chapters/:id] Error:', msg, error)
    return NextResponse.json(
      { error: 'Failed to delete chapter', detail: msg },
      { status: 500 },
    )
  }
}
