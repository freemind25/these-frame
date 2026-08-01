import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateLicenseKey, hashKey, keyPrefix, LICENSE_TYPE_LIMITS, LICENSE_TYPE_DURATIONS } from '@/lib/license'
import { addDays } from 'date-fns'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'tf-admin-2024'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Auth check: header, body, or query param
    const headerAuth = req.headers.get('authorization')
    const bodySecret = body.adminSecret || ''
    const url = new URL(req.url)
    const querySecret = url.searchParams.get('admin_secret') || ''

    if (headerAuth !== `Bearer ${ADMIN_SECRET}` && bodySecret !== ADMIN_SECRET && querySecret !== ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    const licenseType = body.licenseType || 'standard'
    const count = Math.min(Math.max(body.count || 1, 1), 50)
    const note = body.note || ''

    const validTypes = ['trial', 'academic', 'standard', 'premium']
    if (!validTypes.includes(licenseType)) {
      return NextResponse.json({ success: false, error: 'Type de licence invalide' }, { status: 400 })
    }

    const maxAct = LICENSE_TYPE_LIMITS[licenseType]
    const duration = LICENSE_TYPE_DURATIONS[licenseType]
    const expiresAt = duration ? addDays(new Date(), duration) : null

    const generated: string[] = []

    for (let i = 0; i < count; i++) {
      const rawKey = generateLicenseKey()
      const kh = hashKey(rawKey)
      const kp = keyPrefix(rawKey)

      await db.licenseKey.create({
        data: {
          keyHash: kh,
          keyPrefix: kp,
          licenseType,
          maxActivations: maxAct,
          status: 'active',
          note: note || null,
          expiresAt,
        },
      })
      generated.push(rawKey)
    }

    return NextResponse.json({
      success: true,
      count: generated.length,
      licenseType,
      expiresAt,
      keys: generated,
    })
  } catch (error) {
    console.error('[auth/admin/generate] Error:', error)
    return NextResponse.json({ success: false, error: 'Erreur interne' }, { status: 500 })
  }
}