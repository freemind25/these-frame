import { NextResponse } from 'next/server'
import { db, ensureDb } from '@/lib/db'
import { CHAPTERS } from '@/data/chapters-structure'

// POST /api/thesis/seed — Ensure a thesis exists with 6 empty chapters
export async function POST() {
  try {
    await ensureDb()
    // Check if a thesis already exists
    const existing = await db.thesis.findFirst({
      include: {
        chapters: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (existing) {
      return NextResponse.json(existing)
    }

    // Create thesis with all 6 chapters in a single transaction
    const thesis = await db.thesis.create({
      data: {
        chapters: {
          create: CHAPTERS.map((ch) => ({
            order: ch.order,
            number: ch.number,
            title: ch.title,
            content: '',
            wordCount: 0,
            status: 'draft',
          })),
        },
      },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(thesis, { status: 201 })
  } catch (error) {
    console.error('[POST /api/thesis/seed] Error:', error)
    return NextResponse.json(
      { error: 'Failed to seed thesis' },
      { status: 500 },
    )
  }
}
