import { NextResponse } from 'next/server'
import { listDriveFiles } from '@/lib/google-drive'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const conn = await db.cloudDriveConnection.findFirst({ where: { provider: 'google_drive' } })
    if (!conn?.connected) {
      return NextResponse.json({ files: [], connected: false })
    }

    const files = await listDriveFiles(10)
    return NextResponse.json({ files, connected: true })
  } catch {
    return NextResponse.json({ files: [], error: 'Impossible de lister les fichiers' })
  }
}
