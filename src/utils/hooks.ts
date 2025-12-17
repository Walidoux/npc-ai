import { useRef } from 'react'
import { authenticate, isAuthenticated } from '../services/ai'
import { useSettings } from '../store/settings'

const TYPING_SPEED = 50

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

export const useTyping = (text: string, onComplete?: () => void) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDelayed, setIsDelayed] = useState(false)
  const timeoutRef = useRef<number>(null)

  const delays: Record<string, number> = {
    '!': 500,
    '.': 300,
    ',': 200,
    '?': 400,
    ':': 200,
    ';': 200,
  }

  useEffect(() => {
    if (text && !isTyping) {
      setIsTyping(true)
      setCurrentIndex(0)
      setDisplayedText('')
    }
  }, [text, isTyping])

  useEffect(() => {
    if (isTyping && currentIndex < text.length) {
      const char = text[currentIndex]
      const delay = delays[char] || TYPING_SPEED
      if (delay > TYPING_SPEED) {
        setIsDelayed(true)
      }
      timeoutRef.current = window.setTimeout(() => {
        setDisplayedText((prev) => prev + char)
        setCurrentIndex((prev) => prev + 1)
        setIsDelayed(false)
      }, delay)
    } else if (isTyping && currentIndex >= text.length) {
      setIsTyping(false)
      setIsDelayed(false)
      onComplete?.()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentIndex, text, isTyping, onComplete])

  const stopTyping = () => {
    setIsTyping(false)
    setCurrentIndex(0)
    setDisplayedText('')
    setIsDelayed(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  return { displayedText, isTyping, currentIndex, stopTyping, isDelayed }
}

export const useKeySound = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInputFocused()) {
        const soundType = getSoundType(event.key)
        playSound(soundType, 'keydown')
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (isInputFocused()) {
        const soundType = getSoundType(event.key)
        playSound(soundType, 'keyup')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
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
  const audio = new Audio(`/keyboard/${type}_${event}.mp3`)
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
      console.log(Boolean(started && bgAudioRef.current))
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
