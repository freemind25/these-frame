import { NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/google-drive'

export async function GET() {
  try {
    const url = getGoogleAuthUrl('thesisframe_connect')
    return NextResponse.json({ url })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Configuration manquante' },
      { status: 500 },
    )
  }
}