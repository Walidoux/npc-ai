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
    ';': 200
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
      const delay = delays[char] || 100
      if (delay > 100) {
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
