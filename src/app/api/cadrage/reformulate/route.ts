import { NextRequest, NextResponse } from 'next/server'
import { getZAI } from '@/lib/zai'
import { buildReformulatePrompt } from '@/lib/cadrage-prompt'
import { db } from '@/lib/db'
import { CADRAGE_FIELDS } from '@/types/cadrage'
import type { CadrageFieldKey } from '@/types/cadrage'

// POST /api/cadrage/reformulate — Reformuler un champ isolé
export async function POST(request: NextRequest) {
  try {
    const { thesisId, fieldKey, currentValue, otherFields } = await request.json()

    if (!thesisId || !fieldKey || !currentValue) {
      return NextResponse.json(
        { error: 'thesisId, fieldKey et currentValue requis' },
        { status: 400 },
      )
    }

    const fieldDef = CADRAGE_FIELDS.find(f => f.key === fieldKey)
    if (!fieldDef) {
      return NextResponse.json(
        { error: 'Champ invalide' },
        { status: 400 },
      )
    }

    // Call LLM
    const zai = await getZAI()
    const userPrompt = buildReformulatePrompt(
      fieldKey,
      fieldDef.label,
      currentValue,
      otherFields || {},
    )

    const response = await zai.chat.completions.create({
      model: 'glm-4-flash',
      messages: [
        { role: 'system', content: 'Tu es l\'assistant de cadrage de ThesisFrame. Reformule le champ demandé au conditionnel. Réponds UNIQUEMENT en JSON valide : { "value": "...", "meta": null | {...} }. Pas de markdown.' },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    let rawContent = response.choices[0]?.message?.content || ''
    rawContent = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

    let parsed: any = {}
    try {
      parsed = JSON.parse(rawContent)
    } catch {
      return NextResponse.json(
        { error: 'La réponse IA n\'a pas pu être interprétée.' },
        { status: 502 },
      )
    }

    // Update the field in DB
    const cadrage = await db.thesisCadrage.findUnique({ where: { thesisId } })
    if (cadrage) {
      await db.thesisCadrageField.update({
        where: { cadrageId_fieldKey: { cadrageId: cadrage.id, fieldKey } },
        data: {
          fieldValue: parsed.value || '',
          fieldMeta: parsed.meta ? JSON.stringify(parsed.meta) : null,
          isAiSuggestion: true,
          editedByUser: false,
        },
      })
    }

    return NextResponse.json({
      value: parsed.value || '',
      meta: parsed.meta || null,
    })
  } catch (err) {
    console.error('[cadrage/reformulate]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
