import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDb } from '@/lib/db'
import { THESIS_TEMPLATES } from '@/data/thesis-templates'
import { chapterNumber, renumberChapters, ROMAN } from '@/lib/chapter-numbering'

// POST /api/thesis/apply-template — Replace all chapters with a template structure
export async function POST(request: NextRequest) {
  try {
    await ensureDb()
    const body = await request.json()
    const { templateId } = body

    const template = THESIS_TEMPLATES.find(t => t.id === templateId)
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 400 })
    }

    const thesis = await db.thesis.findFirst()
    if (!thesis) {
      return NextResponse.json({ error: 'No thesis found' }, { status: 404 })
    }

    // Delete all existing chapters and parts in a transaction
    await db.$transaction([
      db.chapter.deleteMany({ where: { thesisId: thesis.id } }),
      db.part.deleteMany({ where: { thesisId: thesis.id } }),
    ])

    // Set structure mode
    await db.thesis.update({
      where: { id: thesis.id },
      data: { structureMode: template.structureMode },
    })

    if (template.structureMode === 'parts' && template.parts) {
      // Create parts with their chapters
      let globalOrder = 0
      for (const partDef of template.parts) {
        const partIdx = template.parts!.indexOf(partDef)
        const part = await db.part.create({
          data: {
            thesisId: thesis.id,
            title: partDef.title,
            order: partIdx + 1,
          },
        })

        for (let i = 0; i < partDef.chapters.length; i++) {
          globalOrder++
          const chDef = partDef.chapters[i]
          const num = chapterNumber(i + 1, 'parts', partIdx)
          await db.chapter.create({
            data: {
              thesisId: thesis.id,
              partId: part.id,
              order: globalOrder,
              number: num,
              title: chDef.title,
              content: '',
              wordCount: 0,
              status: 'draft',
            },
          })
        }
      }
    } else if (template.chapters) {
      // Flat chapters mode
      const chapters = await db.$transaction(
        template.chapters.map((chDef, i) => {
          const num = i < 20 ? ROMAN[i] : String(i + 1)
          return db.chapter.create({
            data: {
              thesisId: thesis.id,
              order: i + 1,
              number: num,
              title: chDef.title,
              content: '',
              wordCount: 0,
              status: 'draft',
            },
          })
        }),
      )
    }

    const updated = await db.thesis.findFirst({
      where: { id: thesis.id },
      include: { chapters: { orderBy: { order: 'asc' } }, parts: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json(updated)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[POST /api/thesis/apply-template] Error:', msg, error)
    return NextResponse.json({ error: 'Failed to apply template', detail: msg }, { status: 500 })
  }
}
