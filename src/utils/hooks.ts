import puter from '@heyputer/puter.js'
import { useSettings } from '../store/settings'
import { getSample } from '.'

export const useAudioSamples = () => {
  const [isListening, setIsListening] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        for (const track of stream.getTracks()) {
          track.stop()
        }
      }

      mediaRecorder.start()
      setIsListening(true)
    } catch (error) {
      console.error('Error starting audio recording:', error)
    }
  }

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop()
      setIsListening(false)
    }
  }

  return { startListening, stopListening, isListening, audioBlob }
}

const TYPING_SPEED = 30
const TYPING_DELAYS: Record<string, number> = {
  '.': 300,
  ',': 150,
  '!': 300,
  '?': 300,
  ':': 200,
  ';': 200,
}

type UseTypingOptions = {
  onComplete?: () => void
  isStreamComplete?: boolean
}

export function useTyping(text: string, options: UseTypingOptions = {}) {
  const { onComplete, isStreamComplete = true } = options

  const [displayedText, setDisplayedText] = useState('')
  const [isDelayed, setIsDelayed] = useState(false)

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const onCompleteCalledRef = useRef(false)

  const isTyping = text.length > 0 && displayedText.length < text.length

  // Reset when text changes incompatibly
  useEffect(() => {
    if (!text) {
      setDisplayedText('')
      setIsDelayed(false)
      onCompleteCalledRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    if (!text.startsWith(displayedText)) {
      setDisplayedText('')
      setIsDelayed(false)
      onCompleteCalledRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, displayedText])

  // Main typing animation
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const currentIndex = displayedText.length

    if (currentIndex < text.length) {
      // ✅ Check the LAST TYPED character for punctuation delay
      const lastTypedChar = currentIndex > 0 ? text[currentIndex - 1] : ''
      const punctuationDelay = TYPING_DELAYS[lastTypedChar] || 0
      const hasPunctuationDelay = punctuationDelay > 0

      // ✅ Set delayed state immediately for audio feedback during the pause
      if (hasPunctuationDelay) {
        setIsDelayed(true)
      }

      // ✅ Apply punctuation delay to the NEXT character's timing
      const totalDelay = TYPING_SPEED + punctuationDelay

      timeoutRef.current = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1))

        // Clear delayed state after the pause is over
        if (hasPunctuationDelay) {
          setIsDelayed(false)
        }
      }, totalDelay)
    } else {
      // Finished typing current text
      setIsDelayed(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [displayedText, text])

  // Completion callback
  useEffect(() => {
    const isDone = text.length > 0 && displayedText === text

    if (isDone && isStreamComplete && !onCompleteCalledRef.current) {
      onCompleteCalledRef.current = true
      onComplete?.()
    }

    if (displayedText.length < text.length) {
      onCompleteCalledRef.current = false
    }
  }, [displayedText, text, isStreamComplete, onComplete])

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setDisplayedText('')
    setIsDelayed(false)
    onCompleteCalledRef.current = false
  }, [])

  return {
    displayedText,
    isTyping,
    isDelayed,
    reset,
  }
}

export const useKeySound = () => {
  const pressedKeys = useRef<Set<string>>(new Set())

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInputFocused() && !pressedKeys.current.has(event.key)) {
        pressedKeys.current.add(event.key)
        const soundType = getSoundType(event.key)
        playSound(soundType, 'keydown')
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (isInputFocused()) {
        const soundType = getSoundType(event.key)
        playSound(soundType, 'keyup')
        pressedKeys.current.delete(event.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      pressedKeys.current.clear()
    }
  }, [])
}

const isInputFocused = (): boolean => {
  const active = document.activeElement
  return (
    active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement
  )
}

const getSoundType = (key: string): string => {
  switch (key) {
    case 'Backspace':
      return 'backspace'
    case 'Enter':
      return 'enter'
    case ' ':
      return 'space'
    default:
      return 'default'
  }
}

const playSound = (type: string, event: 'keydown' | 'keyup') => {
  const audio = new Audio(getSample(`keyboard/${type}_${event}.mp3`))
  audio.play().catch(() => {
    // Ignore audio play errors
  })
}

export const useSFX = () => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {
        // Ignore audio play errors
      })
    }
  }

  return { audioRef, play }
}

const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await puter.auth.getUser()
    return !!user
  } catch {
    return false
  }
}

const authenticate = async (): Promise<void> => {
  await puter.auth.signIn()
}

export const useAuth = () => {
  const [authChecked, setAuthChecked] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const { isAuthenticated: authStatus, setIsAuthenticated } = useSettings()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated()
        setIsAuthenticated(authenticated)
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setAuthChecked(true)
      }
    }
    checkAuth()
  }, [setIsAuthenticated])

  const handleStart = async (setStarted: (value: boolean) => void) => {
    if (authStatus) {
      setStarted(true)
    } else {
      setIsAuthenticating(true)
      try {
        await authenticate()
        const authenticated = await isAuthenticated()
        setIsAuthenticated(authenticated)
        if (authenticated) {
          setStarted(true)
        }
      } catch (error) {
        console.error('Authentication failed:', error)
      } finally {
        setIsAuthenticating(false)
      }
    }
  }

  return { authChecked, isAuthenticating, authStatus, handleStart }
}

export const useBackgroundAudio = (started: boolean) => {
  const bgAudioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const play = async () => {
      if (started && bgAudioRef.current) {
        bgAudioRef.current.loop = true
        try {
          await bgAudioRef.current.play()
        } catch (error) {
          console.error(error)
        }
      }
    }
    play()
  }, [started])

  return bgAudioRef
}
