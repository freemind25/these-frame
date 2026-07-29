import { NextRequest, NextResponse } from 'next/server'
import { getZAI } from '@/lib/zai'
import { buildSystemPrompt, type AssistantMode } from '@/lib/thesis-assistant-knowledge'

const VALID_MODES: AssistantMode[] = ['general', 'redaction', 'correction', 'critique', 'methode', 'bibliographie', 'suivi']

// In-memory conversation store
const conversations = new Map<string, Array<{ role: string; content: string }>>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mode, message, sessionId, clearHistory } = body as {
      mode?: string
      message?: string
      sessionId?: string
      clearHistory?: boolean
    }

    const currentMode = (mode || 'general') as AssistantMode

    if (!VALID_MODES.includes(currentMode)) {
      return NextResponse.json(
        { error: `Mode invalide. Modes : ${VALID_MODES.join(', ')}` },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Le message est requis.' }, { status: 400 })
    }

    const sid = sessionId || `thesis_ast_${Date.now()}`

    if (clearHistory) {
      conversations.delete(sid)
    }

    const systemPrompt = buildSystemPrompt(currentMode)
    let history = conversations.get(sid) || [
      { role: 'system', content: systemPrompt }
    ]

    // If switching modes, reset with new system prompt
    if (history[0]?.content !== systemPrompt) {
      history = [{ role: 'system', content: systemPrompt }]
    }

    history.push({ role: 'user', content: message.trim() })

    // Trim to last 20 messages + system
    if (history.length > 21) {
      history = [history[0], ...history.slice(-20)]
    }

    const zai = await getZAI()
    const apiMessages = history
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        ...apiMessages,
      ],
      thinking: { type: 'disabled' },
    })

    const aiResponse = completion.choices[0]?.message?.content || 'Désolé, une erreur est survenue lors de la génération.'

    history.push({ role: 'assistant', content: aiResponse })
    conversations.set(sid, history)

    return NextResponse.json({
      success: true,
      response: aiResponse,
      sessionId: sid,
      messageCount: history.length - 1,
    })
  } catch (error) {
    console.error('Thesis assistant error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne du serveur.' },
      { status: 500 }
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
