'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
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

type DictationState = 'idle' | 'requesting' | 'recording' | 'transcribing' | 'error'

export default function DictationButton({ onTranscribed, disabled }: DictationButtonProps) {
  const [state, setState] = useState<DictationState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval>>()
  const streamRef = useRef<MediaStream | null>(null)
  const onTranscribedRef = useRef(onTranscribed)
  useEffect(() => { onTranscribedRef.current = onTranscribed }, [onTranscribed])

  // Declare all helpers before using them in effects/callbacks
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

  const stopRecording = useCallback(() => {
    stopTimer()
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    mediaRecorderRef.current = null
  }, [stopTimer])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer()
      stopStream()
    }
  }, [stopTimer, stopStream])

  const startRecording = useCallback(async () => {
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
            body: JSON.stringify({ audio: base64 }),
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
          stopRecording()
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
  }, [stopStream, stopRecording])

  const handleClick = () => {
    if (state === 'recording') {
      stopRecording()
    } else if (state === 'idle' || state === 'error') {
      startRecording()
    }
  }

  const isRecording = state === 'recording'
  const isBusy = state === 'requesting' || state === 'transcribing'

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}s`
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
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
            {state === 'requesting' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {state === 'transcribing' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {state === 'recording' && <MicOff className="h-3.5 w-3.5" />}
            {(state === 'idle' || state === 'error') && <Mic className="h-3.5 w-3.5" />}

            {isRecording && (
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-[11px]">
          {isRecording
            ? `Enregistrement... ${formatTime(elapsed)} — cliquez pour arrêter`
            : state === 'transcribing'
              ? 'Transcription en cours...'
              : state === 'error'
                ? errorMsg || 'Réessayez'
                : 'Dicter le texte (speech-to-text)'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
