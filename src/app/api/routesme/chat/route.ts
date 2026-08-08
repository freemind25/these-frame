import { NextRequest, NextResponse } from 'next/server'
import { getRoutesMeClient } from '@/lib/routesme'

export async function POST(request: NextRequest) {
  try {
    const client = getRoutesMeClient()
    if (!client) {
      return NextResponse.json(
        { error: 'Clé API RoutesMe non configurée.' },
        { status: 400 },
      )
    }

    const body = await request.json()
    const { model, messages, temperature, max_tokens } = body as {
      model?: string
      messages: Array<{ role: string; content: string }>
      temperature?: number
      max_tokens?: number
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages requis.' }, { status: 400 })
    }

    const result = await client.chat({
      model: model || 'GLM5.2R',
      messages: messages.map(m => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content,
      })),
      temperature: temperature ?? 0.3,
      max_tokens: max_tokens ?? 4000,
    })

    return NextResponse.json({
      content: result.choices[0]?.message?.content || '',
      model: result.model,
      usage: result.usage,
    })
  } catch (error) {
    console.error('[RoutesMe] Chat error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne.' },
      { status: 500 },
    )
  }
}
