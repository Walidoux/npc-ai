import { getSample } from '@/utils'

type TypingAudioProps = {
  isTyping: boolean
  isDelayed: boolean
  enabled: boolean
}

export const TypingAudio = ({
  isTyping,
  isDelayed,
  enabled,
}: TypingAudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (isTyping && enabled && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.loop = true
      audioRef.current.play().catch(() => {
        // Ignore audio play errors
      })
    }
  }, [isTyping, enabled])

  // Handle audio looping for first 2 seconds
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    const handleTimeUpdate = () => {
      if (audio.currentTime >= 2) {
        audio.currentTime = 0
      }
    }

    const handleEnded = () => {
      if (isTyping && enabled) {
        audio.currentTime = 0
        audio.play().catch(() => {
          // Ignore audio play errors
        })
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [isTyping])

  // Stop audio when typing ends or when delayed
  useEffect(() => {
    if ((!isTyping || isDelayed || !enabled) && audioRef.current) {
      audioRef.current.pause()
      if (!isTyping) {
        audioRef.current.currentTime = 0
      }
    } else if (isTyping && !isDelayed && enabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore audio play errors
      })
    }
  }, [isTyping, isDelayed, enabled])

  return (
    <audio preload='auto' ref={audioRef} src={getSample('typing.mp3')}>
      <track kind='captions' />
    </audio>
  )
}
