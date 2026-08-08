import { NextRequest, NextResponse } from 'next/server'
import { RoutesMeClient, isRoutesMeConfigured, saveRoutesMeConfig, getRoutesMeConfig } from '@/lib/routesme'

/** GET: check current config status (called on panel mount) */
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

/** POST: save key + test connection (called when clicking "Tester") */
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

    // Save config first
    saveRoutesMeConfig(apiKey.trim(), plan || 'free')

    // Then test the connection
    const client = new RoutesMeClient({ apiKey: apiKey.trim(), plan: plan || 'free' })
    const result = await client.testConnection()

    if (result.success) {
      return NextResponse.json({
        success: true,
        plan: result.plan,
        modelCount: result.modelCount,
      })
    } else {
      // If test failed, still keep config saved so user can retry
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
