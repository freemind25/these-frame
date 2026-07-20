import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const refSchema = z.object({
  type: z.string().default('article'),
  citationKey: z.string().optional(),
  title: z.string().min(1),
  authors: z.string().default(''),
  year: z.string().optional(),
  journal: z.string().optional(),
  volume: z.string().optional(),
  number: z.string().optional(),
  pages: z.string().optional(),
  doi: z.string().optional(),
  abstract: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
  source: z.string().default('manual'),
  mendeleyId: z.string().optional(),
})

// GET all references
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const tag = searchParams.get('tag') || ''
    const type = searchParams.get('type') || ''

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { authors: { contains: search } },
        { journal: { contains: search } },
        { doi: { contains: search } },
      ]
    }
    if (tag) {
      where.tags = { contains: tag }
    }
    if (type) {
      where.type = type
    }

    const references = await db.reference.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(references)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST create a reference
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = refSchema.parse(body)

    // Generate citation key if not provided
    if (!data.citationKey && data.authors && data.year) {
      const firstAuthor = data.authors.split(';')[0].trim()
      const lastName = firstAuthor.split(' ').pop()?.toLowerCase() || 'unknown'
      const year = data.year || 'xxxx'
      const suffix = Math.floor(Math.random() * 100)
      data.citationKey = `${lastName}${year}${suffix}`
    } else if (!data.citationKey) {
      data.citationKey = `ref_${Date.now()}`
    }

    const ref = await db.reference.create({ data })

    // Mark mendeleyId as unique-safe
    if (data.mendeleyId) {
      try {
        await db.reference.update({
          where: { id: ref.id },
          data: { mendeleyId: data.mendeleyId },
        })
      } catch {
        // Unique constraint violation — update existing
        const existing = await db.reference.findFirst({
          where: { mendeleyId: data.mendeleyId },
        })
        if (existing) {
          await db.reference.update({
            where: { id: existing.id },
            data: { ...data, citationKey: data.citationKey },
          })
          return NextResponse.json(existing)
        }
      }
    }

    return NextResponse.json(ref, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT update a reference
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const ref = await db.reference.update({
      where: { id },
      data,
    })
    return NextResponse.json(ref)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE a reference
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    await db.reference.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}