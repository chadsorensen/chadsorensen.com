import { onBeforeUnmount, ref } from 'vue'
import { splitSpoken } from './parse'

// Minimal typings: the Web Speech API isn't in every TS DOM lib yet.
interface RecognitionResult {
  readonly isFinal: boolean
  readonly 0: { readonly transcript: string }
}
interface RecognitionEvent {
  readonly resultIndex: number
  readonly results: { readonly length: number; readonly [index: number]: RecognitionResult }
}
interface Recognition {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: RecognitionEvent) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type RecognitionCtor = new () => Recognition

const Ctor: RecognitionCtor | undefined =
  typeof window === 'undefined'
    ? undefined
    : ((window as unknown as Record<string, RecognitionCtor | undefined>).SpeechRecognition ??
      (window as unknown as Record<string, RecognitionCtor | undefined>).webkitSpeechRecognition)

export const speechSupported = Boolean(Ctor)

/**
 * Listens for a spoken list. Each pause ends a segment, and each segment
 * (split further on commas) becomes one or more captured items.
 */
export function useSpeech() {
  const listening = ref(false)
  const interim = ref('')
  const captured = ref<string[]>([])
  const error = ref('')
  let recognition: Recognition | undefined

  function start() {
    if (!Ctor || listening.value) return
    error.value = ''
    interim.value = ''
    recognition = new Ctor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = navigator.language || 'en-US'

    recognition.onresult = (event) => {
      let pending = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (!result) continue
        if (result.isFinal) captured.value.push(...splitSpoken(result[0].transcript))
        else pending += result[0].transcript
      }
      interim.value = pending
    }

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return
      error.value =
        event.error === 'not-allowed' || event.error === 'service-not-allowed'
          ? 'Microphone access is off. Allow it in your browser settings, or type the list instead.'
          : "Couldn't hear that. Tap the mic to try again."
    }

    recognition.onend = () => {
      listening.value = false
      interim.value = ''
    }

    recognition.start()
    listening.value = true
  }

  function stop() {
    recognition?.stop()
  }

  function reset() {
    recognition?.abort()
    captured.value = []
    interim.value = ''
    error.value = ''
  }

  const removeAt = (index: number) => captured.value.splice(index, 1)

  onBeforeUnmount(() => recognition?.abort())

  return { listening, interim, captured, error, start, stop, reset, removeAt }
}
