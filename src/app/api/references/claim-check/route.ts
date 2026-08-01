import { NextRequest, NextResponse } from 'next/server'
import { getZAI } from '@/lib/zai'

/**
 * POST /api/references/claim-check
 *
 * Vérifie si les références citées supportent réellement les claims
 * auxquelles elles sont attachées — inspiré du template 1.3 du
 * Research Prompt Handbook.
 *
 * Body : { claims: Array<{ id: string; claim: string; citation: string; source: string }> }
 *   - claim : l'affirmation faite dans le texte
 *   - citation : le texte cité (auteur, année, citation in-text)
 *   - source : titre ou description de la source
 *
 * Returns : { results: Array<{ claimId, verdict, explanation }> }
 */

interface ClaimInput {
  id: string
  claim: string
  citation: string
  source: string
}

interface ClaimResult {
  claimId: string
  verdict: 'supports' | 'partial' | 'unrelated' | 'contradicts'
  explanation: string
}

const CLAIM_CHECK_SYSTEM = `Tu es un vérificateur de citations académiques. Ta tâche :

Pour chaque paire (claim, source), évalue si la source supporte RÉELLEMENT la claim spécifique — pas seulement si elle est sur le même sujet général.

Critères d'évaluation :
- **supports** : la source fournit des preuves directes, des données ou un argument explicite pour cette claim
- **partial** : la source est pertinente mais ne supporte qu'une partie de la claim, ou le lien est indirect
- **unrelated** : la source est sur le même sujet mais ne supporte pas cette claim spécifique
- **contradicts** : la source dit explicitement le contraire de la claim

Réponds UNIQUEMENT en JSON valide, sans markdown ni backticks :
[
  { "claimId": "...", "verdict": "supports|partial|unrelated|contradicts", "explanation": "..." }
]

L'explication doit être concise (1-2 phrases) et en français.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const claims: ClaimInput[] = body.claims

    if (!claims || !Array.isArray(claims) || claims.length === 0) {
      return NextResponse.json(
        { error: 'Fournir un tableau de claims avec { id, claim, citation, source }.' },
        { status: 400 }
      )
    }

    if (claims.length > 20) {
      return NextResponse.json(
        { error: 'Maximum 20 claims par requête.' },
        { status: 400 }
      )
    }

    // Build the user message with all claims
    const claimEntries = claims
      .map((c, i) => `${i + 1}. [ID: ${c.id}]\n   Claim : ${c.claim}\n   Citation : ${c.citation}\n   Source : ${c.source}`)
      .join('\n\n')

    const userMessage = `Vérifie les claims suivantes :\n\n${claimEntries}`

    const zai = await getZAI()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: CLAIM_CHECK_SYSTEM },
        { role: 'user', content: userMessage },
      ],
      thinking: { type: 'disabled' },
    })

    const raw = completion.choices[0]?.message?.content || '[]'

    // Parse JSON from response (handle possible markdown wrapping)
    let parsed: ClaimResult[]
    try {
      const cleaned = raw.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        { error: 'Impossible de parser la réponse IA. Réessayez.' },
        { status: 500 }
      )
    }

    if (!Array.isArray(parsed)) {
      return NextResponse.json(
        { error: 'La réponse IA n\'est pas un tableau valide.' },
        { status: 500 }
      )
    }

    // Validate structure
    const validVerdicts = ['supports', 'partial', 'unrelated', 'contradicts']
    const results: ClaimResult[] = parsed
      .filter((r) => r.claimId && r.verdict && r.explanation)
      .map((r) => ({
        claimId: r.claimId,
        verdict: validVerdicts.includes(r.verdict) ? r.verdict : ('partial' as const),
        explanation: r.explanation,
      }))

    const summary = {
      total: results.length,
      supports: results.filter((r) => r.verdict === 'supports').length,
      partial: results.filter((r) => r.verdict === 'partial').length,
      unrelated: results.filter((r) => r.verdict === 'unrelated').length,
      contradicts: results.filter((r) => r.verdict === 'contradicts').length,
    }

    return NextResponse.json({ results, summary })
  } catch (error) {
    console.error('[POST /api/references/claim-check]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne du serveur.' },
      { status: 500 }
    )
  }
}
