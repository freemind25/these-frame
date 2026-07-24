import { NextRequest, NextResponse } from 'next/server'
import { uploadToDrive } from '@/lib/google-drive'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { fileName, content, format } = await req.json()

    if (!fileName || !content) {
      return NextResponse.json({ error: 'fileName et content requis' }, { status: 400 })
    }

    const mimeType = format === 'latex'
      ? 'application/x-latex'
      : 'application/pdf'

    // Check if configured
    const hasCredentials = process.env.GOOGLE_DRIVE_CLIENT_ID && process.env.GOOGLE_DRIVE_CLIENT_SECRET
    if (!hasCredentials) {
      return NextResponse.json(
        { error: 'Google Drive non configuré. Ajoutez GOOGLE_DRIVE_CLIENT_ID et GOOGLE_DRIVE_CLIENT_SECRET dans les variables d\'environnement.' },
        { status: 503 },
      )
    }

    // Check if connected
    const conn = await db.cloudDriveConnection.findFirst({ where: { provider: 'google_drive' } })
    if (!conn?.connected) {
      return NextResponse.json({ error: 'Google Drive non connecté' }, { status: 400 })
    }

    const file = await uploadToDrive(fileName, content, mimeType)

    // Update last sync
    await db.cloudDriveConnection.update({
      where: { id: conn.id },
      data: { lastSyncAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      file: {
        id: file.id,
        name: file.name,
        link: file.webViewLink,
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur upload' },
      { status: 500 },
    )
  }
}
