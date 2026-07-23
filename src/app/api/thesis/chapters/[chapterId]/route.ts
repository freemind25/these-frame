import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/thesis/chapters/[chapterId] — Get a single chapter
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> },
) {
  try {
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

// DELETE /api/thesis/chapters/[chapterId] — Reset chapter content
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> },
) {
  try {
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

    // Reset content and word count, keep structure intact
    const reset = await db.chapter.update({
      where: { id: chapterId },
      data: {
        content: '',
        wordCount: 0,
        status: 'draft',
      },
    })

    return NextResponse.json(reset)
  } catch (error) {
    console.error('[DELETE /api/thesis/chapters/:id] Error:', error)
    return NextResponse.json(
      { error: 'Failed to reset chapter' },
      { status: 500 },
    )
  }
}
