'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Mic, MicOff, Loader2, AudioLines } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface DictationButtonProps {
  /** Called with the transcribed text when recording finishes */
  onTranscribed: (text: string) => void
  disabled?: boolean
}

type DictationMode = 'browser' | 'server'
type DictationState = 'idle' | 'requesting' | 'recording' | 'transcribing' | 'error'

// Check if Web Speech API is available
function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false
  return !!(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  )
}

// Get the SpeechRecognition constructor (with webkit prefix fallback)
function getSpeechRecognition(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  )
}

export default function DictationButton({ onTranscribed, disabled }: DictationButtonProps) {
  const [state, setState] = useState<DictationState>('idle')
  const [mode, setMode] = useState<DictationMode>(() =>
    isSpeechRecognitionSupported() ? 'browser' : 'server',
  )
  const [elapsed, setElapsed] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [interimText, setInterimText] = useState('')
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval>>()
  const streamRef = useRef<MediaStream | null>(null)
  const onTranscribedRef = useRef(onTranscribed)
  useEffect(() => { onTranscribedRef.current = onTranscribed }, [onTranscribed])

  // ─── Shared helpers ───
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = undefined
    }
    setElapsed(0)
  }, [])

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer()
      stopStream()
      recognitionRef.current?.abort()
    }
  }, [stopTimer, stopStream])

  // ─── Mode 1: Web Speech API (instant, browser-native) ───
  const startBrowserRecognition = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognition()
    if (!SpeechRecognitionCtor) {
      // Fall back to server mode
      setMode('server')
      return false
    }

    const recognition = new SpeechRecognitionCtor()
    recognitionRef.current = recognition
    recognition.lang = 'fr-FR'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    let finalTranscript = ''

    recognition.onresult = (event: any) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' '
        } else {
          interim += result[0].transcript
        }
      }
      setInterimText(interim)
    }

    recognition.onerror = (event: any) => {
      console.warn('[SpeechAPI]', event.error)
      if (event.error === 'not-allowed') {
        setErrorMsg('Microphone refusé')
      } else if (event.error === 'no-speech') {
        setErrorMsg('Aucune parole détectée')
      } else {
        setErrorMsg(`Erreur: ${event.error}`)
      }
      setState('error')
    }

    recognition.onend = () => {
      stopTimer()
      // Speech API can stop on its own (silence timeout)
      if (finalTranscript.trim().length > 0) {
        onTranscribedRef.current(cleanBrowserText(finalTranscript.trim()))
      }
      setInterimText('')
      setState('idle')
    }

    recognition.start()
    setState('recording')

    const startTime = Date.now()
    timerRef.current = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000)
      setElapsed(seconds)
      if (seconds >= 300) {
        recognition.stop()
      }
    }, 1000)

    return true
  }, [stopTimer])

  // ─── Mode 2: Server-side (Groq Whisper) ───
  const startServerRecording = useCallback(async () => {
    try {
      setState('requesting')
      setErrorMsg('')

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      })

      streamRef.current = stream
      chunksRef.current = []

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4'

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        stopStream()
        const blob = new Blob(chunksRef.current, { type: mimeType })

        if (blob.size < 1000) {
          setState('error')
          setErrorMsg('Enregistrement trop court')
          return
        }

        setState('transcribing')
        try {
          const arrayBuffer = await blob.arrayBuffer()
          const uint8 = new Uint8Array(arrayBuffer)
          let binary = ''
          for (let i = 0; i < uint8.length; i++) {
            binary += String.fromCharCode(uint8[i])
          }
          const base64 = btoa(binary)

          const res = await fetch('/api/asr/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64, language: 'fr' }),
          })

          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Erreur de transcription')

          if (data.text && data.text.trim().length > 0) {
            onTranscribedRef.current(data.text.trim())
          }
          setState('idle')
        } catch (err: any) {
          setState('error')
          setErrorMsg(err.message || 'Erreur de transcription')
        }
      }

      recorder.onerror = () => {
        stopStream()
        setState('error')
        setErrorMsg("Erreur d'enregistrement")
      }

      recorder.start(250)
      setState('recording')

      const startTime = Date.now()
      timerRef.current = setInterval(() => {
        const seconds = Math.floor((Date.now() - startTime) / 1000)
        setElapsed(seconds)
        if (seconds >= 300) {
          recorder.stop()
        }
      }, 1000)
    } catch (err: any) {
      setState('error')
      if (err.name === 'NotAllowedError') {
        setErrorMsg('Microphone refusé')
      } else if (err.name === 'NotFoundError') {
        setErrorMsg('Aucun microphone')
      } else {
        setErrorMsg('Erreur microphone')
      }
    }
  }, [stopStream])

  // ─── Actions ───
  const handleClick = () => {
    if (state === 'recording') {
      // Stop
      if (mode === 'browser') {
        recognitionRef.current?.stop()
      } else {
        mediaRecorderRef.current?.stop()
      }
      return
    }
    if (state === 'idle' || state === 'error') {
      setInterimText('')
      if (mode === 'browser') {
        const started = startBrowserRecognition()
        if (!started) {
          // Fallback to server mode
          startServerRecording()
        }
      } else {
        startServerRecording()
      }
    }
  }

  const toggleMode = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (state !== 'idle' && state !== 'error') return
    setMode(prev => (prev === 'browser' ? 'server' : 'browser'))
    setErrorMsg('')
  }

  const isRecording = state === 'recording'
  const isBusy = state === 'requesting' || state === 'transcribing'

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}s`
  }

  const tooltipText = isRecording
    ? `${mode === 'browser' ? 'Navigateur' : 'IA'} — ${formatTime(elapsed)} — cliquez pour arrêter`
    : state === 'transcribing'
      ? 'Transcription IA en cours...'
      : state === 'error'
        ? errorMsg || 'Réessayez'
        : mode === 'browser'
          ? `Dicter (${mode === 'browser' ? 'navigateur' : 'IA'}) — clic droit pour changer`
          : `Dicter (IA Groq) — clic droit pour changer`

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            onContextMenu={toggleMode}
            disabled={disabled || state === 'requesting'}
            className={cn(
              'relative flex items-center justify-center w-8 h-8 rounded-full transition-all',
              isRecording
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30'
                : state === 'transcribing'
                  ? 'bg-violet-500 text-white animate-pulse'
                  : state === 'error'
                    ? 'bg-red-100 text-red-500 hover:bg-red-200'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
              disabled && 'opacity-40 cursor-not-allowed',
            )}
          >
            {(state === 'requesting' || state === 'transcribing') && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            {isRecording && <MicOff className="h-3.5 w-3.5" />}
            {(state === 'idle' || state === 'error') && (
              mode === 'browser' ? (
                <Mic className="h-3.5 w-3.5" />
              ) : (
                <AudioLines className="h-3.5 w-3.5" />
              )
            )}

            {isRecording && (
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-[11px] max-w-[220px]">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ─── Browser STT post-processing ───
function cleanBrowserText(text: string): string {
  let cleaned = text.replace(/\s+/g, ' ').trim()

  // Remove common French filler words
  const fillers = /\b(euh|hum|bah|ben|hein|donc|voilà|enfin|quoi\?|tu vois|en fait)\b/gi
  cleaned = cleaned.replace(fillers, '')
  cleaned = cleaned.replace(/\s+/g, ' ').trim()

  // Ensure text ends with proper punctuation
  if (
    cleaned.length > 0 &&
    !['.', '!', '?', ';', ':', ',', '…'].includes(cleaned[cleaned.length - 1])
  ) {
    cleaned += '.'
  }

  return cleaned
}
