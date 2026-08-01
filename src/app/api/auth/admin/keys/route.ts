import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { LICENSE_TYPE_LABELS } from '@/lib/license'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'tf-admin-2024'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const querySecret = url.searchParams.get('admin_secret') || ''
    const headerAuth = req.headers.get('authorization')

    if (headerAuth !== `Bearer ${ADMIN_SECRET}` && querySecret !== ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    const keys = await db.licenseKey.findMany({
      orderBy: { createdAt: 'desc' },
      include: { activations: { orderBy: { activatedAt: 'desc' } } },
    })

    return NextResponse.json({
      success: true,
      keys: keys.map((k) => ({
        id: k.id,
        keyPrefix: k.keyPrefix,
        licenseType: k.licenseType,
        licenseTypeLabel: LICENSE_TYPE_LABELS[k.licenseType] || k.licenseType,
        status: k.status,
        maxActivations: k.maxActivations,
        currentActivations: k.currentActivations,
        note: k.note,
        createdAt: k.createdAt,
        expiresAt: k.expiresAt,
        activations: k.activations.map((a) => ({
          id: a.id,
          deviceName: a.deviceName,
          activatedAt: a.activatedAt,
          lastSeenAt: a.lastSeenAt,
        })),
      })),
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[auth/admin/keys] Error:', msg, error)
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur', debug: msg }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const querySecret = url.searchParams.get('admin_secret') || ''
    const headerAuth = req.headers.get('authorization')
    const body = await req.json().catch(() => ({}))
    const bodySecret = body.adminSecret || ''

    if (headerAuth !== `Bearer ${ADMIN_SECRET}` && querySecret !== ADMIN_SECRET && bodySecret !== ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    const { keyId, action } = body

    if (!keyId) {
      return NextResponse.json({ success: false, error: 'keyId requis' }, { status: 400 })
    }

    if (action === 'revoke') {
      await db.licenseKey.update({
        where: { id: keyId },
        data: { status: 'revoked' },
      })
      // Delete all activations
      await db.activation.deleteMany({ where: { licenseKeyId: keyId } })
      return NextResponse.json({ success: true, message: 'Licence révoquée' })
    }

    if (action === 'delete') {
      await db.licenseKey.delete({ where: { id: keyId } })
      return NextResponse.json({ success: true, message: 'Licence supprimée' })
    }

    if (action === 'reset-activations') {
      await db.activation.deleteMany({ where: { licenseKeyId: keyId } })
      await db.licenseKey.update({
        where: { id: keyId },
        data: { currentActivations: 0 },
      })
      return NextResponse.json({ success: true, message: 'Activations réinitialisées' })
    }

    return NextResponse.json({ success: false, error: 'Action non reconnue' }, { status: 400 })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[auth/admin/keys DELETE] Error:', msg, error)
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur', debug: msg }, { status: 500 })
  }
}
