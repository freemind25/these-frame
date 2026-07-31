import { NextRequest, NextResponse } from 'next/server'
import { getZAI } from '@/lib/zai'
import { DIRECTEUR_SYSTEM_PROMPT } from '@/data/directeur-prompt'
import { getGuidanceForContext } from '@/data/guidance-fiches'

// In-memory conversation store
const conversations = new Map<string, Array<{ role: string; content: string }>>()

interface ChapterProgress {
  number: string
  title: string
  wordCount: number
  status: string
}

/**
 * Build a conversational system prompt for the directeur.
 * Unlike the one-shot /api/directeur, this prompt is designed for multi-turn dialogue:
 * the directeur asks follow-up questions, pushes the student, remembers context.
 */
function buildDirecteurChatSystemPrompt(ctx: {
  thesisTitle?: string
  thesisField?: string
  chapterTitle?: string
  chapterNumber?: string
  chapterContent?: string
  thesisProgress?: ChapterProgress[]
  sousDomaine?: string
  problematique?: { quoi: string; comment: string; pourquoi: string }
  hypothese?: string
  userMessage?: string
}): string {
  const parts: string[] = []

  // Core identity
  parts.push(DIRECTEUR_SYSTEM_PROMPT)

  // Add conversational instructions
  parts.push(`
## Mode conversationnel

Tu es maintenant en mode **conversationnel**. Contrairement à une évaluation unique, tu dialogues avec le doctorant comme lors d'une réunion de suivi régulière.

Comportement attendu :
- Si le doctorant te présente une idée, questionne-la : quels sont les présupposés ? Quelle est la littérature qui soutient cette position ?
- Si le doctorant te montre un passage, évalue-le avec la même rigueur que dans une soumission formelle, mais tu peux être plus bref et aller directement au point.
- Si le doctorant te pose une question sur la méthode, le cadre théorique ou l'argumentation, réponds en tant qu'expert — mais ne lui mâche pas le travail. Guide-le vers la réponse plutôt que de la lui donner.
- Si le doctorant est bloqué, aide-le à reformuler son problème, à identifier les alternatives, à découper un objectif inaccessible en sous-objectifs.
- Tu peux demander à voir un chapitre, un plan, une section spécifique. Le doctorant peut te coller du texte.
- Tu dois toujours finir par une **question exigeante** ou une **consigne d'action précise** — jamais par un simple acquiescement.
- Tu n'écris JAMAIS de texte que le doctorant pourrait copier-coller. Si on te demande de rédiger, refuse poliment et redirige.
- Sois direct, exigeant, jamais condescendant. Le respect que tu dois au doctorant, c'est la franchise.

Format en conversation :
- Tu peux être plus concis que dans une évaluation formelle.
- Utilise des listes courtes quand c'est utile.
- Si le contexte envoyé contient un chapitre, évalue-le selon tes 5 critères habituels.
- Sinon, adapte ta réponse à ce que le doctorant te demande.`)

  // Context block
  const contextParts: string[] = []

  if (ctx.thesisTitle) contextParts.push(`Titre de la thèse : ${ctx.thesisTitle}`)
  if (ctx.thesisField) contextParts.push(`Domaine : ${ctx.thesisField}`)
  if (ctx.sousDomaine) contextParts.push(`Sous-domaine : ${ctx.sousDomaine}`)

  if (ctx.chapterTitle) {
    contextParts.push(`Chapitre courant : ${ctx.chapterNumber ? `Chapitre ${ctx.chapterNumber}` : 'Chapitre'} — « ${ctx.chapterTitle} »`)
  }

  if (ctx.chapterContent && ctx.chapterContent.trim().length > 0) {
    const truncated = ctx.chapterContent.length > 4000
      ? ctx.chapterContent.slice(0, 4000) + '\n[... texte tronqué ...]'
      : ctx.chapterContent
    const cleaned = truncated
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\n{3,}/g, '\n\n')
    contextParts.push(`CONTENU DU CHAPITRE COURANT (extrait) :\n${cleaned}`)
  }

  if (ctx.problematique) {
    contextParts.push(
      `PROBLÉMATIQUE DU PROJET :
- QUOI : ${ctx.problematique.quoi}\n- COMMENT : ${ctx.problematique.comment}\n- POURQUOI : ${ctx.problematique.pourquoi}`
    )
  }

  if (ctx.hypothese) {
    contextParts.push(`HYPOTHÈSE DE RECHERCHE : « ${ctx.hypothese} »`)
  }

  if (ctx.thesisProgress && ctx.thesisProgress.length > 0) {
    const totalWords = ctx.thesisProgress.reduce((s, c) => s + c.wordCount, 0)
    const lines = ctx.thesisProgress
      .map(c => `  - Chap. ${c.number} « ${c.title} » : ${c.wordCount} mots [${c.status}]`)
      .join('\n')
    contextParts.push(`PROGRESSION GLOBALE (${totalWords.toLocaleString()} mots) :\n${lines}`)
  }

  if (contextParts.length > 0) {
    parts.push(`\n## CONTEXTE DE LA THÈSE\n\n${contextParts.join('\n\n')}`)
  }

  // ── Contextual guidance knowledge base ──
  let guidanceResult
  if (ctx.chapterTitle) {
    guidanceResult = getGuidanceForContext({ chapterTitle: ctx.chapterTitle, signal: 'chapter-structure' })
  } else if (ctx.userMessage) {
    guidanceResult = getGuidanceForContext({ userMessage: ctx.userMessage, signal: 'auto' })
  }

  if (guidanceResult && guidanceResult.fiches.length > 0) {
    const ficheTexts = guidanceResult.fiches.map(f => `### ${f.title}\n\n${f.content}`).join('\n\n---\n\n')
    parts.push(`\n## BASE DE CONNAISSANCE CONTEXTUELLE\n\n${ficheTexts}\n\nUtilise cette base de connaissance pour fonder tes critiques et tes conseils. Ces critères sont explicites et vérifiables — s'appuyer dessus rend ton évaluation plus précise et plus justifiable.`)
  }

  return parts.join('\n')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      message,
      sessionId,
      clearHistory,
      chapterTitle,
      chapterNumber,
      chapterContent,
      thesisProgress,
      thesisTitle,
      thesisField,
      sousDomaine,
      problematique,
      hypothese,
    } = body as {
      message?: string
      sessionId?: string
      clearHistory?: boolean
      chapterTitle?: string
      chapterNumber?: string
      chapterContent?: string
      thesisProgress?: ChapterProgress[]
      thesisTitle?: string
      thesisField?: string
      sousDomaine?: string
      problematique?: { quoi: string; comment: string; pourquoi: string }
      hypothese?: string
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Le message est requis.' }, { status: 400 })
    }

    const trimmedMessage = message.trim()
    const sid = sessionId || `directeur_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

    if (clearHistory) {
      conversations.delete(sid)
    }

    // Build the system prompt with all available context
    const systemPrompt = buildDirecteurChatSystemPrompt({
      thesisTitle,
      thesisField,
      chapterTitle,
      chapterNumber,
      chapterContent,
      thesisProgress,
      sousDomaine,
      problematique,
      hypothese,
      userMessage: trimmedMessage,
    })

    let history = conversations.get(sid) || [
      { role: 'system', content: systemPrompt },
    ]

    // If context changed, reset with new system prompt
    if (history[0]?.content !== systemPrompt) {
      history = [{ role: 'system', content: systemPrompt }]
    }

    history.push({ role: 'user', content: trimmedMessage })

    // Trim to last 24 messages + system
    if (history.length > 25) {
      history = [history[0], ...history.slice(-24)]
    }

    const zai = await getZAI()
    const apiMessages = history
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        ...apiMessages,
      ],
      thinking: { type: 'disabled' },
    })

    const aiResponse =
      completion.choices[0]?.message?.content ||
      'Désolé, une erreur est survenue lors de la génération.'

    history.push({ role: 'assistant', content: aiResponse })
    conversations.set(sid, history)

    return NextResponse.json({
      success: true,
      response: aiResponse,
      sessionId: sid,
      messageCount: history.length - 1,
    })
  } catch (error) {
    console.error('Directeur chat API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne du serveur.' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    if (sessionId) {
      conversations.delete(sessionId)
    } else {
      conversations.clear()
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la suppression.' }, { status: 500 })
  }
}
