import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'download', 'ThesisFrame.zip')
    const fileBuffer = readFileSync(filePath)
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="ThesisFrame-Desktop.zip"',
        'Content-Length': String(fileBuffer.length),
      },
    })
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
