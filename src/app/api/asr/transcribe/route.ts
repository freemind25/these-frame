import { NextRequest, NextResponse } from 'next/server'
import { getZAI } from '@/lib/zai'

// POST /api/asr/transcribe
// Body: { audio: string (base64), language?: string }
// Returns: { text: string, wordCount: number }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { audio, language } = body

    if (!audio || typeof audio !== 'string') {
      return NextResponse.json({ error: 'Audio base64 requis' }, { status: 400 })
    }

    // Validate base64 size (max ~25MB audio)
    const maxBase64Size = 35_000_000 // ~25MB in base64
    if (audio.length > maxBase64Size) {
      return NextResponse.json(
        { error: 'Fichier audio trop volumineux (max ~25 Mo)' },
        { status: 413 },
      )
    }

    const zai = await getZAI()

    const response = await zai.audio.asr.create({
      file_base64: audio,
    })

    const text = response.text || ''

    // Post-processing: clean up transcription
    const cleaned = cleanTranscription(text)

    return NextResponse.json({
      text: cleaned,
      rawText: text,
      wordCount: cleaned.split(/\s+/).filter(Boolean).length,
    })
  } catch (err: any) {
    console.error('[asr/transcribe]', err)
    return NextResponse.json(
      { error: err.message || 'Erreur de transcription' },
      { status: 500 },
    )
  }
}

function cleanTranscription(text: string): string {
  // Remove excessive whitespace
  let cleaned = text.replace(/\s+/g, ' ').trim()

  // Capitalize first letter of sentences
  cleaned = cleaned.replace(/(^[a-zàâéèêëïîôùûüÿçñ]|(?<=[.!?]\s)[a-zàâéèêëïîôùûüÿçñ])/g, m => m.toUpperCase())

  // Remove common French filler words
  const fillers = /\b(euh|hum|bah|ben|hein|donc|voilà|enfin|quoi\?|tu vois|en fait)\b/gi
  cleaned = cleaned.replace(fillers, '')

  // Clean up double spaces after filler removal
  cleaned = cleaned.replace(/\s+/g, ' ').trim()

  // Ensure text ends with proper punctuation
  if (cleaned.length > 0 && ![ '.', '!', '?', ';', ':', ',', '…' ].includes(cleaned[cleaned.length - 1])) {
    cleaned += '.'
  }

  return cleaned
}
