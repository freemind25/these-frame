import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getZAI } from '@/lib/zai'
import { extractBookText } from '@/lib/extract-book-text'

const EXTRACTION_PROMPT = `Tu es un expert en analyse de livres académiques et techniques. Tu extrais la STRUCTURE et les CONNAISSANCES ACTIONNABLES d'un livre, PAS un résumé.

À partir du texte extrait d'un livre, génère un objet JSON STRICTEMENT valide avec cette structure :
{
  "title": "titre du livre",
  "author": "auteur(s)",
  "coreConcept": "1-2 phrases décrivant le concept central du livre",
  "frameworks": [
    { "name": "Nom du cadre", "description": "Ce qu'est ce cadre en 1 phrase", "when": "Quand l'appliquer" }
  ],
  "principles": ["principe 1", "principe 2"],
  "techniques": ["technique 1", "technique 2"],
  "antiPatterns": ["piège 1", "piège 2"],
  "relevance": [
    { "chapterType": "I", "reason": "Pourquoi pertinent pour l'introduction" },
    { "chapterType": "III", "reason": "Pourquoi pertinent pour la méthodologie" },
    { "chapterType": "all", "reason": "Pertinent pour tous les chapitres" }
  ],
  "quickReference": "1 phrase d'aide-mémoire",
  "glossary": [
    { "term": "terme", "definition": "définition courte" }
  ]
}

RÈGLES STRICTES :
1. Réponds UNIQUEMENT avec le JSON, aucun texte avant ou après.
2. Les chapterType possibles : "I" (Introduction), "II" (Bibliographie/Revue littérature), "III" (Méthodologie), "IV" (Résultats), "V" (Discussion), "VI" (Conclusion), "all" (tous les chapitres).
3. 3 à 8 frameworks nommés avec contexte d'utilisation.
4. 3 à 6 principes actionnables.
5. 3 à 8 techniques pratiques.
6. 2 à 5 pièges/anti-patterns.
7. Pertinence pour au moins 2 types de chapitres de thèse.
8. 5 à 15 termes de glossaire.
9. Tout le contenu doit être en FRANÇAIS, y compris les noms de cadres si possible.
10. Si le texte est incomplet, extrais ce que tu peux."
`

const MAX_TEXT_LENGTH = 60000 // ~45k tokens — keep under context limits

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Fichier manquant.' }, { status: 400 })
    }

    const ext = file.name.toLowerCase().split('.').pop()
    if (ext !== 'pdf' && ext !== 'epub') {
      return NextResponse.json({ error: 'Format non supporté. Utilisez PDF ou EPUB.' }, { status: 400 })
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 50 Mo).' }, { status: 400 })
    }

    // Create initial DB record
    const record = await db.customBookSkill.create({
      data: {
        title: file.name.replace(/\.[^.]+$/, ''),
        fileName: file.name,
        fileSize: file.size,
        status: 'processing',
      },
    })

    // Process in background (non-blocking response)
    processBookAsync(record.id, file).catch(async (err) => {
      console.error('[book-skills/upload] Background error:', err)
      await db.customBookSkill.update({
        where: { id: record.id },
        data: { status: 'error', errorMessage: err instanceof Error ? err.message : 'Erreur inconnue' },
      })
    })

    return NextResponse.json({ success: true, id: record.id, status: 'processing' })
  } catch (error) {
    console.error('[book-skills/upload] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne.' },
      { status: 500 },
    )
  }
}

async function processBookAsync(recordId: string, file: File) {
  // 1. Extract text
  const buffer = Buffer.from(await file.arrayBuffer())
  const { text, pageCount, metadata } = await extractBookText(buffer, file.name)

  if (!text || text.trim().length < 200) {
    await db.customBookSkill.update({
      where: { id: recordId },
      data: { status: 'error', errorMessage: 'Impossible d\'extraire suffisamment de texte du fichier.' },
    })
    return
  }

  // 2. Truncate if needed
  const truncatedText = text.length > MAX_TEXT_LENGTH
    ? text.slice(0, MAX_TEXT_LENGTH) + '\n[... texte tronqué ...]'
    : text

  // 3. Call LLM to structure
  const zai = await getZAI()
  const pagesInfo = pageCount ? ` (${pageCount} pages)` : ''

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'assistant', content: EXTRACTION_PROMPT },
      { role: 'user', content: `Analyse le texte suivant extrait d'un livre${pagesInfo} et génère le JSON structuré :

--- DÉBUT DU TEXTE ---
${truncatedText}
--- FIN DU TEXTE ---` },
    ],
    thinking: { type: 'disabled' },
  })

  let raw = completion.choices[0]?.message?.content || ''

  // Strip markdown code fences if present
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()

  // Parse JSON
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(raw)
  } catch {
    // Try to extract JSON from the response
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0])
    } else {
      throw new Error('L\'IA n\'a pas pu générer un JSON valide. Réessayez.')
    }
  }

  // 4. Save to DB
  const frameworks = JSON.stringify(parsed.frameworks || [])
  const principles = JSON.stringify(parsed.principles || [])
  const techniques = JSON.stringify(parsed.techniques || [])
  const antiPatterns = JSON.stringify(parsed.antiPatterns || [])
  const relevance = JSON.stringify(parsed.relevance || [])
  const glossary = JSON.stringify(parsed.glossary || [])

  await db.customBookSkill.update({
    where: { id: recordId },
    data: {
      title: (parsed.title as string) || metadata?.title || file.name.replace(/\.[^.]+$/, ''),
      author: (parsed.author as string) || metadata?.author || '',
      coreConcept: (parsed.coreConcept as string) || '',
      frameworks,
      principles,
      techniques,
      antiPatterns,
      relevance,
      quickReference: (parsed.quickReference as string) || '',
      glossary,
      status: 'ready',
    },
  })
}

export async function GET() {
  // Also serve as status check
  return NextResponse.json({ status: 'ok' })
}
