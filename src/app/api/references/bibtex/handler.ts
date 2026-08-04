import { NextResponse } from 'next/server'
import { db, ensureDb } from '@/lib/db'

export async function GET() {
  try {
    const references = await db.reference.findMany({ orderBy: { createdAt: 'desc' } })

    let bib = ''
    for (const ref of references) {
      const key = ref.citationKey || `ref_${ref.id.slice(0, 6)}`
      const authorList = ref.authors
        ? ref.authors.split(';').map(a => a.trim()).join(' and ')
        : 'Unknown'

      switch (ref.type) {
        case 'book':
          bib += `@book{${key},
  author    = {${authorList}},
  title     = {${ref.title}},
  year      = {${ref.year || ''}},
  publisher = {${ref.journal || ''}},
  doi       = {${ref.doi || ''}},
  note      = {${ref.notes || ''}}
}\n\n`
          break
        case 'inproceedings':
          bib += `@inproceedings{${key},
  author    = {${authorList}},
  title     = {${ref.title}},
  booktitle = {${ref.journal || ''}},
  year      = {${ref.year || ''}},
  pages     = {${ref.pages || ''}},
  doi       = {${ref.doi || ''}},
  note      = {${ref.notes || ''}}
}\n\n`
          break
        case 'thesis':
          bib += `@phdthesis{${key},
  author = {${authorList}},
  title  = {${ref.title}},
  school = {${ref.journal || ''}},
  year   = {${ref.year || ''}},
  note   = {${ref.notes || ''}}
}\n\n`
          break
        case 'incollection':
          bib += `@incollection{${key},
  author    = {${authorList}},
  title     = {${ref.title}},
  booktitle = {${ref.journal || ''}},
  year      = {${ref.year || ''}},
  pages     = {${ref.pages || ''}},
  publisher = {${ref.journal || ''}},
  doi       = {${ref.doi || ''}}
}\n\n`
          break
        case 'web':
          bib += `@misc{${key},
  author       = {${authorList}},
  title        = {${ref.title}},
  howpublished = {${ref.journal || ''}},
  year         = {${ref.year || ''}},
  url          = {${ref.doi || ''}},
  note         = {${ref.notes || ''}}
}\n\n`
          break
        default: // article
          bib += `@article{${key},
  author  = {${authorList}},
  title   = {${ref.title}},
  journal = {${ref.journal || ''}},
  year    = {${ref.year || ''}},
  volume  = {${ref.volume || ''}},
  number  = {${ref.number || ''}},
  pages   = {${ref.pages || ''}},
  doi     = {${ref.doi || ''}},
  note    = {${ref.notes || ''}}
}\n\n`
          break
      }
    }

    return new NextResponse(bib, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="references.bib"',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}