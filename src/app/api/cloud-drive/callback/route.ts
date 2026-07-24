import { NextRequest, NextResponse } from 'next/server'
import { exchangeCode, getGoogleProfile } from '@/lib/google-drive'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || ''}/?drive_error=${encodeURIComponent(error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || ''}/?drive_error=no_code`)
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCode(code)
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)

    // Get user profile
    const profile = await getGoogleProfile(tokens.access_token)

    // Upsert connection in DB
    const existing = await db.cloudDriveConnection.findFirst({ where: { provider: 'google_drive' } })

    if (existing) {
      await db.cloudDriveConnection.update({
        where: { id: existing.id },
        data: {
          connected: true,
          email: profile.email,
          displayName: profile.name,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiresAt: expiresAt,
          lastSyncAt: new Date(),
        },
      })
    } else {
      await db.cloudDriveConnection.create({
        data: {
          provider: 'google_drive',
          connected: true,
          email: profile.email,
          displayName: profile.name,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiresAt: expiresAt,
        },
      })
    }

    // Redirect back to app with success
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    return NextResponse.redirect(`${baseUrl}/?drive_connected=1&drive_email=${encodeURIComponent(profile.email)}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur OAuth'
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || ''}/?drive_error=${encodeURIComponent(msg)}`)
  }
}