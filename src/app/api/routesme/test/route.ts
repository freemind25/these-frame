import { NextRequest, NextResponse } from 'next/server'
import { RoutesMeClient, isRoutesMeConfigured, saveRoutesMeConfig, getRoutesMeConfig } from '@/lib/routesme'

/** GET: check current config status */
export async function GET() {
  try {
    const configured = isRoutesMeConfigured()
    const config = getRoutesMeConfig()
    return NextResponse.json({
      configured,
      plan: config?.plan || null,
    })
  } catch {
    return NextResponse.json({ configured: false, plan: null })
  }
}

/** POST: save key + test connection */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiKey, plan } = body as { apiKey?: string; plan?: 'free' | 'vip' }

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Clé API requise.' },
        { status: 400 },
      )
    }

    const trimmedKey = apiKey.trim()
    const resolvedPlan = plan || 'free'

    // Save config for local dev (won't persist on Vercel but doesn't hurt)
    saveRoutesMeConfig(trimmedKey, resolvedPlan)

    // Test connection
    const client = new RoutesMeClient({ apiKey: trimmedKey, plan: resolvedPlan })
    const result = await client.testConnection()

    if (result.success) {
      return NextResponse.json({
        success: true,
        plan: result.plan,
        modelCount: result.modelCount,
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Connexion échouée.',
      })
    }
  } catch (error) {
    console.error('[RoutesMe] Test error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur interne.' },
      { status: 500 },
    )
  }
}
