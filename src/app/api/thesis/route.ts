import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDb } from '@/lib/db'
import { getMockThesis, isDbAvailable } from '@/lib/mock-thesis'

// GET /api/thesis — Get or create thesis with all chapters and parts
export async function GET() {
  try {
    // Check if DB is available; fall back to mock data
    const dbOk = await isDbAvailable()
    if (!dbOk) {
      console.warn('[GET /api/thesis] DB unavailable, returning mock thesis')
      return NextResponse.json(getMockThesis())
    }

    await ensureDb()
    let thesis = await db.thesis.findFirst({
      include: {
        chapters: { orderBy: { order: 'asc' } },
        parts: { orderBy: { order: 'asc' } },
      },
    })

    if (!thesis) {
      thesis = await db.thesis.create({
        data: {},
        include: {
          chapters: { orderBy: { order: 'asc' } },
          parts: { orderBy: { order: 'asc' } },
        },
      })
    }

    return NextResponse.json(thesis)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[GET /api/thesis] Error:', msg, error)
    // Fallback to mock if DB fails
    return NextResponse.json(getMockThesis())
  }
}

// PATCH /api/thesis — Update thesis metadata (including structureMode)
export async function PATCH(request: NextRequest) {
  try {
    const dbOk = await isDbAvailable()
    if (!dbOk) {
      // In mock mode, return updated mock thesis
      const body = await request.json()
      const mock = getMockThesis()
      return NextResponse.json({ ...mock, ...body })
    }

    await ensureDb()
    const body = await request.json()
    const { title, subtitle, author, field, university, status, structureMode } = body

    let thesis = await db.thesis.findFirst()
    if (!thesis) {
      return NextResponse.json({ error: 'No thesis found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (subtitle !== undefined) updateData.subtitle = subtitle
    if (author !== undefined) updateData.author = author
    if (field !== undefined) updateData.field = field
    if (university !== undefined) updateData.university = university
    if (status !== undefined) updateData.status = status
    if (structureMode !== undefined && ['chapters', 'parts'].includes(structureMode)) {
      updateData.structureMode = structureMode
    }

    const updated = await db.thesis.update({
      where: { id: thesis.id },
      data: updateData,
      include: {
        chapters: { orderBy: { order: 'asc' } },
        parts: { orderBy: { order: 'asc' } },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PATCH /api/thesis] Error:', error)
    return NextResponse.json({ error: 'Failed to update thesis' }, { status: 500 })
  }
}
