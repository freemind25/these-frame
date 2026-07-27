import { NextResponse } from 'next/server'
import { db, ensureDb } from '@/lib/db'
import { CHAPTERS } from '@/data/chapters-structure'
import { getMockThesis, isDbAvailable } from '@/lib/mock-thesis'

// POST /api/thesis/seed — Ensure a thesis exists with 6 empty chapters
export async function POST() {
  try {
    // Check if DB is available; fall back to mock data
    const dbOk = await isDbAvailable()
    if (!dbOk) {
      console.warn('[seed] DB unavailable, returning mock thesis')
      return NextResponse.json(getMockThesis())
    }

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

    // Create thesis with all chapters in a single transaction
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
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[POST /api/thesis/seed] Error:', msg, error)
    // Fallback to mock if DB fails
    return NextResponse.json(getMockThesis())
  }
}
