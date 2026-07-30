import { NextRequest, NextResponse } from 'next/server'
import { getZAI } from '@/lib/zai'
import { buildCoherencePrompt } from '@/lib/cadrage-prompt'

// POST /api/cadrage/verify — Vérification de cohérence
export async function POST(request: NextRequest) {
  try {
    const { thesisId, fields } = await request.json()

    if (!fields || typeof fields !== 'object' || Object.keys(fields).length < 3) {
      return NextResponse.json(
        { error: 'Au moins 3 champs sont nécessaires pour la vérification.' },
        { status: 400 },
      )
    }

    // Call LLM
    const zai = await getZAI()
    const userPrompt = buildCoherencePrompt(fields)

    const response = await zai.chat.completions.create({
      model: 'glm-4-flash',
      messages: [
        { role: 'system', content: 'Tu es l\'assistant de cadrage de ThesisFrame. Vérifie la cohérence entre les champs. Réponds UNIQUEMENT en JSON : { "coherence_remarks": [{ "field": "...", "severity": "info|warning|error", "message": "..." }] }. Si tout est cohérent, renvoie un tableau vide.' },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    let rawContent = response.choices[0]?.message?.content || ''
    rawContent = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

    let parsed: any = {}
    try {
      parsed = JSON.parse(rawContent)
    } catch {
      return NextResponse.json({ coherence_remarks: [] })
    }

    return NextResponse.json({
      coherence_remarks: parsed.coherence_remarks || [],
    })
  } catch (err) {
    console.error('[cadrage/verify]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
