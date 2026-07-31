import { NextRequest, NextResponse } from 'next/server'
import { getZAI } from '@/lib/zai'

// ─── Types ──────────────────────────────────────────────
interface ResearcherResponse {
  researcherId: string
  researcherName: string
  researcherRole: string
  response: string
  keyPoints: string[]
  confidence: number // 0-1
  duration: number // ms
}

interface ConsensusPoint {
  point: string
  agreement: number // 0-1 ratio of researchers agreeing
  supportingResearchers: string[]
  confidence: 'high' | 'medium' | 'low'
}

interface AggregateResult {
  aggregatedResponse: string
  researchers: ResearcherResponse[]
  consensusPoints: ConsensusPoint[]
  consensusScore: number // 0-100
  researchMode: 'fast' | 'deep'
  totalDuration: number
}

// ─── Researcher Personas ────────────────────────────────
const RESEARCHERS = [
  {
    id: 'analyste',
    name: 'Dr. Analyste',
    role: 'Analyse critique et rigueur méthodologique',
    systemSuffix: `Tu es un chercheur académique spécialisé en analyse critique. Ton rôle est d'analyser la question avec un œil critique, d'identifier les biais potentiels, les limites méthodologiques, et de fournir une réponse précise et bien étayée. Formate ta réponse en français académique. Termine toujours par une liste de 3-5 points clés sous forme de tirets commençant par "POINT: ".`,
    temperature: 0.3,
  },
  {
    id: 'synthetiseur',
    name: 'Dr. Synthétiseur',
    role: 'Synthèse et mise en perspective',
    systemSuffix: `Tu es un chercheur académique spécialisé en synthèse et intégration de connaissances. Ton rôle est de fournir une vue d'ensemble cohérente, de connecter les différents aspects de la question, et d'offrir des perspectives transversales. Formate ta réponse en français académique. Termine toujours par une liste de 3-5 points clés sous forme de tirets commençant par "POINT: ".`,
    temperature: 0.5,
  },
  {
    id: 'innovateur',
    name: 'Dr. Innovateur',
    role: 'Perspectives innovantes et pistes de recherche',
    systemSuffix: `Tu es un chercheur académique visionnaire spécialisé dans l'identification de pistes de recherche émergentes. Ton rôle est de proposer des angles originaux, des connexions inattendues entre domaines, et d'identifier les lacunes dans la littérature existante. Formate ta réponse en français académique. Termine toujours par une liste de 3-5 points clés sous forme de tirets commençant par "POINT: ".`,
    temperature: 0.7,
  },
  {
    id: 'methodologue',
    name: 'Dr. Méthodologue',
    role: 'Expertise méthodologique et épistémologie',
    systemSuffix: `Tu es un chercheur académique expert en méthodologie de recherche. Ton rôle est d'analyser la question sous l'angle des méthodes de recherche appropriées, des cadres théoriques pertinents, et de la validité scientifique des approches. Formate ta réponse en français académique. Termine toujours par une liste de 3-5 points clés sous forme de tirets commençant par "POINT: ".`,
    temperature: 0.4,
  },
  {
    id: 'bibliographe',
    name: 'Dr. Bibliographe',
    role: "Expertise bibliographique et état de l'art",
    systemSuffix: `Tu es un chercheur académique spécialisé dans les revues de littérature et l'état de l'art. Ton rôle est de situer la question dans le contexte de la littérature existante, d'identifier les auteurs et courants majeurs, et de proposer une structuration bibliographique pertinente. Formate ta réponse en français académique. Termine toujours par une liste de 3-5 points clés sous forme de tirets commençant par "POINT: ".`,
    temperature: 0.5,
  },
]

// ─── Helper: Extract key points from researcher response ──
// Matches: "- POINT: text", "* POINT: text", "POINT: text", numbered lists, or bold key points
function extractKeyPoints(response: string): string[] {
  const points: string[] = []
  const lines = response.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.length < 15) continue
    // Match "POINT: text" with optional bullet/number prefix
    const pointMatch = trimmed.match(/^(?:[-*\d.)]+\s+)?(?:\*{0,2})\s*POINT\s*:\s*(.+)$/i)
    if (pointMatch) {
      points.push(pointMatch[1].replace(/\*+/g, '').trim())
      continue
    }
    // Match bold key sentences like "**Clé :** text" or "- **Key:** text"
    const boldKeyMatch = trimmed.match(/^(?:[-*\d.)]+\s+)?\*{0,2}(?:conclusion|recommandation|point clé|résultat|observation|idée clé|piste|enjeu|verdict)s?\s*[:：]\*{0,2}\s*(.+)$/i)
    if (boldKeyMatch) {
      points.push(boldKeyMatch[1].replace(/\*+/g, '').trim())
    }
  }
  // Fallback: if no structured points found, extract last 3 meaningful sentences
  if (points.length === 0 && response.length > 100) {
    const sentences = response.replace(/\n/g, ' ').split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 30)
    for (let i = Math.max(0, sentences.length - 3); i < sentences.length; i++) {
      points.push(sentences[i].trim())
    }
  }
  return points
}

// ─── Helper: Compute consensus between researchers ────
function computeConsensus(responses: ResearcherResponse[]): {
  points: ConsensusPoint[]
  score: number
} {
  const allPoints: Map<string, { text: string; researchers: string[] }> = new Map()

  for (const r of responses) {
    for (const point of r.keyPoints) {
      const normalized = point.toLowerCase().replace(/[^a-z0-9àâäéèêëïîôùûüÿçœæ\s]/g, '').trim()
      if (normalized.length < 10) continue

      // Check for similar existing points (fuzzy match)
      let found = false
      for (const [key, val] of allPoints) {
        const similarity = computeSimilarity(normalized, key)
        if (similarity > 0.5) {
          val.researchers.push(r.researcherId)
          found = true
          break
        }
      }
      if (!found) {
        allPoints.set(normalized, { text: point, researchers: [r.researcherId] })
      }
    }
  }

  const totalResearchers = responses.length || 1
  const consensusPoints: ConsensusPoint[] = []
  let totalAgreement = 0

  for (const [, val] of allPoints) {
    const agreement = val.researchers.length / totalResearchers
    totalAgreement += agreement
    consensusPoints.push({
      point: val.text,
      agreement,
      supportingResearchers: val.researchers,
      confidence: agreement >= 0.8 ? 'high' : agreement >= 0.5 ? 'medium' : 'low',
    })
  }

  // Sort by agreement descending
  consensusPoints.sort((a, b) => b.agreement - a.agreement)

  // Overall consensus score (0-100)
  const avgAgreement = consensusPoints.length > 0 ? totalAgreement / consensusPoints.length : 0
  const consensusScore = Math.round(avgAgreement * 100)

  return { points: consensusPoints, score: consensusScore }
}

// ─── Helper: Simple string similarity (Jaccard-like) ────
function computeSimilarity(a: string, b: string): number {
  const setA = new Set(a.split(/\s+/))
  const setB = new Set(b.split(/\s+/))
  let intersection = 0
  for (const word of setA) {
    if (setB.has(word)) intersection++
  }
  const union = setA.size + setB.size - intersection
  return union === 0 ? 0 : intersection / union
}

// ─── Helper: Aggregate responses into a final synthesis ──
function buildAggregationPrompt(
  question: string,
  researcherResponses: ResearcherResponse[],
  consensusPoints: ConsensusPoint[],
  mode: 'fast' | 'deep',
  context?: {
    thesisTitle?: string
    thesisField?: string
    chapterTitle?: string
  }
): string {
  const researcherSummaries = researcherResponses
    .map(r => `### ${r.name} (${r.role})\n${r.response.slice(0, 800)}${r.response.length > 800 ? '...' : ''}`)
    .join('\n\n')

  const consensusSection = consensusPoints.length > 0
    ? `\n\n## Points de consensus identifiés\n${consensusPoints.slice(0, 10).map((cp, i) => `${i + 1}. **[${cp.confidence === 'high' ? 'Fort consensus' : cp.confidence === 'medium' ? 'Consensus modéré' : 'Faible consensus'}]** ${cp.point} (${cp.supportingResearchers.length}/${researcherResponses.length} chercheurs)`).join('\n')}`
    : ''

  const contextSection = context?.thesisTitle
    ? `\n\n## Contexte de la thèse\n- Titre : ${context.thesisTitle}\n${context.thesisField ? `- Domaine : ${context.thesisField}` : ''}\n${context.chapterTitle ? `- Chapitre en cours : ${context.chapterTitle}` : ''}`
    : ''

  const depthInstruction = mode === 'deep'
    ? 'Fournis une analyse approfondie et détaillée (800-1200 mots). Inclue des sous-sections structurées.'
    : "Fournis une synthèse concise et percutante (300-500 mots). Va droit à l'essentiel."

  return `Tu es un chef de recherche qui doit agréger les analyses de ${researcherResponses.length} chercheurs experts en une synthèse cohérente et actionable pour un doctorant.

## Question du doctorant
${question}${contextSection}

## Analyses des chercheurs
${researcherSummaries}${consensusSection}

## Instructions
${depthInstruction}
- Met en avant les points de consensus forts
- Signale les divergences ou points de débat
- Fournis des recommandations concrètes et actionnables
- Formule en français académique de qualité
- Structure clairement avec des titres et sous-titres markdown`
}

// ─── Main Route ─────────────────────────────────────────
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const {
      question,
      mode = 'fast',
      thesisTitle,
      thesisField,
      chapterTitle,
    } = body as {
      question?: string
      mode?: 'fast' | 'deep'
      thesisTitle?: string
      thesisField?: string
      chapterTitle?: string
    }

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json({ error: 'La question est requise.' }, { status: 400 })
    }

    const zai = await getZAI()
    const trimmedQuestion = question.trim()

    // Select researchers based on mode
    const selectedResearchers = mode === 'deep'
      ? RESEARCHERS // All 5 for deep
      : RESEARCHERS.slice(0, 3) // First 3 for fast

    // Build context header for each researcher
    const contextHeader = [
      thesisTitle ? `Contexte : le doctorant prépare une thèse intitulée « ${thesisTitle} ».` : '',
      thesisField ? `Domaine : ${thesisField}.` : '',
      chapterTitle ? `Chapitre en cours : ${chapterTitle}.` : '',
    ].filter(Boolean).join(' ')

    // ── Phase 1: Query all researchers in parallel ──
    const researcherPromises = selectedResearchers.map(async (researcher) => {
      const researcherStart = Date.now()
      try {
        const systemPrompt = `${contextHeader}\n\n${researcher.systemSuffix}`

        const completion = await zai.chat.completions.create({
          messages: [
            { role: 'assistant', content: systemPrompt },
            { role: 'user', content: trimmedQuestion },
          ],
          thinking: { type: 'disabled' },
        })

        const responseText = completion.choices[0]?.message?.content || ''
        const keyPoints = extractKeyPoints(responseText)
        const duration = Date.now() - researcherStart

        return {
          researcherId: researcher.id,
          researcherName: researcher.name,
          researcherRole: researcher.role,
          response: responseText,
          keyPoints,
          confidence: keyPoints.length > 0 ? Math.min(1, keyPoints.length / 5) : 0.5,
          duration,
        } satisfies ResearcherResponse
      } catch (err) {
        console.error(`Researcher ${researcher.id} failed:`, err)
        return {
          researcherId: researcher.id,
          researcherName: researcher.name,
          researcherRole: researcher.role,
          response: `Erreur lors de l'analyse : ${err instanceof Error ? err.message : 'inconnue'}`,
          keyPoints: [],
          confidence: 0,
          duration: Date.now() - researcherStart,
        } satisfies ResearcherResponse
      }
    })

    const researcherResults = await Promise.all(researcherPromises)

    // ── Phase 2: Compute consensus ──
    const { points: consensusPoints, score: consensusScore } = computeConsensus(researcherResults)

    // ── Phase 3: Final aggregation ──
    const aggregationPrompt = buildAggregationPrompt(
      trimmedQuestion,
      researcherResults,
      consensusPoints,
      mode,
      { thesisTitle, thesisField, chapterTitle }
    )

    let aggregatedResponse: string
    try {
      const aggregation = await zai.chat.completions.create({
        messages: [
          { role: 'user', content: aggregationPrompt },
        ],
        thinking: { type: 'disabled' },
      })
      aggregatedResponse = aggregation.choices[0]?.message?.content || "Erreur lors de l'agrégation finale."
    } catch {
      aggregatedResponse = researcherResults[0]?.response || 'Aucune réponse disponible.'
    }

    const totalDuration = Date.now() - startTime

    const result: AggregateResult = {
      aggregatedResponse,
      researchers: researcherResults,
      consensusPoints,
      consensusScore,
      researchMode: mode,
      totalDuration,
    }

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('[POST /api/ai-aggregate] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne du serveur.' },
      { status: 500 }
    )
  }
}
