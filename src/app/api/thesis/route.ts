import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/thesis — Get or create thesis with all chapters
export async function GET() {
  try {
    // Try to find an existing thesis
    let thesis = await db.thesis.findFirst({
      include: {
        chapters: {
          orderBy: { order: 'asc' },
        },
      },
    })

    // If no thesis exists, create a default one
    if (!thesis) {
      thesis = await db.thesis.create({
        data: {},
        include: {
          chapters: {
            orderBy: { order: 'asc' },
          },
        },
      })
    }

    return NextResponse.json(thesis)
  } catch (error) {
    console.error('[GET /api/thesis] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thesis' },
      { status: 500 },
    )
  }
}

// PATCH /api/thesis — Update thesis metadata
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, author, field, university, status } = body

    // Find the thesis first
    let thesis = await db.thesis.findFirst()

    if (!thesis) {
      return NextResponse.json(
        { error: 'No thesis found. Please seed the thesis first.' },
        { status: 404 },
      )
    }

    // Build update payload with only provided fields
    const updateData: Record<string, string> = {}
    if (title !== undefined) updateData.title = title
    if (subtitle !== undefined) updateData.subtitle = subtitle
    if (author !== undefined) updateData.author = author
    if (field !== undefined) updateData.field = field
    if (university !== undefined) updateData.university = university
    if (status !== undefined) updateData.status = status

    const updated = await db.thesis.update({
      where: { id: thesis.id },
      data: updateData,
      include: {
        chapters: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PATCH /api/thesis] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update thesis' },
      { status: 500 },
    )
  }
}
