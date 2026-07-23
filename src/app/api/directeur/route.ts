import { NextRequest, NextResponse } from 'next/server'
import { getZAI } from '@/lib/zai'
import { DIRECTEUR_SYSTEM_PROMPT, buildDirecteurPrompt, type DirecteurParams } from '@/data/directeur-prompt'

export async function POST(request: NextRequest) {
  try {
    const body: DirecteurParams & { chapitreContenu?: string } = await request.json()

    const {
      chapitreTitre,
      chapitreContenu = '',
      probleme,
      hypothese,
      sousDomaineLabel,
      contraintesMethodologiques,
    } = body

    if (!chapitreTitre || typeof chapitreTitre !== 'string') {
      return NextResponse.json(
        { error: 'Le titre du chapitre est requis.' },
        { status: 400 },
      )
    }

    if (!probleme || !probleme.quoi || !probleme.comment || !probleme.pourquoi) {
      return NextResponse.json(
        { error: 'La problématique (QUOI / COMMENT / POURQUOI) est requise.' },
        { status: 400 },
      )
    }

    if (!hypothese || !hypothese.texte) {
      return NextResponse.json(
        { error: 'L\'hypothèse de recherche est requise.' },
        { status: 400 },
      )
    }

    const userPrompt = buildDirecteurPrompt({
      chapitreTitre,
      chapitreContenu,
      probleme: {
        quoi: probleme.quoi,
        comment: probleme.comment,
        pourquoi: probleme.pourquoi,
      },
      hypothese: {
        texte: hypothese.texte,
        observation: Boolean(hypothese.observation),
        verifiable: Boolean(hypothese.verifiable),
        coherente: Boolean(hypothese.coherente),
      },
      sousDomaineLabel: sousDomaineLabel || 'Non précisé',
      contraintesMethodologiques: contraintesMethodologiques || '',
    })

    const zai = await getZAI()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: DIRECTEUR_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    })

    const aiResponse =
      completion.choices[0]?.message?.content ||
      'Désolé, une erreur est survenue lors de l\'évaluation.'

    return NextResponse.json({ success: true, response: aiResponse })
  } catch (error) {
    console.error('Directeur API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne du serveur.' },
      { status: 500 },
    )
  }
}
