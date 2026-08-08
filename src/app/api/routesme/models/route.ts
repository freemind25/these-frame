import { NextResponse } from 'next/server'
import { getRoutesMeClient } from '@/lib/routesme'

export async function GET() {
  try {
    const client = getRoutesMeClient()
    if (!client) {
      return NextResponse.json(
        { error: 'Clé API RoutesMe non configurée.' },
        { status: 400 },
      )
    }

    const models = await client.listModels()
    return NextResponse.json({ models })
  } catch (error) {
    console.error('[RoutesMe] Models error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne.' },
      { status: 500 },
    )
  }
}
