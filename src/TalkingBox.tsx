import { AudioControls, CharacterPortrait, DialogueBox, TypingAudio } from './components'
import { useTyping } from './utils/hooks'

type TalkingBoxProps = {
  text: string
  onComplete?: () => void
}

export const TalkingBox = ({ text, onComplete }: TalkingBoxProps) => {
  const { displayedText, isTyping, stopTyping, isDelayed } = useTyping(text, () => {
    onComplete?.()
  })

  return (
    <div className='relative flex items-end gap-4'>
      <CharacterPortrait />
      <DialogueBox displayedText={displayedText} isTyping={isTyping} />
      <AudioControls stopTyping={stopTyping} />
      <TypingAudio isDelayed={isDelayed} isTyping={isTyping} />
    </div>
  )
}

export const Dialogue = () => {
  const [currentText, setCurrentText] = useState('')
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const bgAudioRef = useRef<HTMLAudioElement>(null)

  const dialogues = [
    'Hello there! Welcome to this Undertale-style dialogue system.',
    'This is a talking heads implementation with typewriter text effect.',
    'The character portrait animates while speaking...',
    'And each character makes a satisfying blip sound!',
    'You can customize the text, timing, and animations as needed.'
  ]

  useEffect(() => {
    if (started && dialogueIndex < dialogues.length) {
      setCurrentText(dialogues[dialogueIndex])
    }
  }, [dialogueIndex, started])

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

  const handleDialogueComplete = () => {
    if (dialogueIndex < dialogues.length - 1) {
      // Small delay before next dialogue
      setTimeout(() => {
        setDialogueIndex((prev) => prev + 1)
      }, 2000)
    }
  }

  const handleStart = () => {
    setStarted(true)
  }

  if (!started) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-900 p-8'>
        <button
          className='rounded border border-white bg-black px-4 py-2 text-white hover:bg-gray-800'
          onClick={handleStart}
          type='button'>
          Listen
        </button>
        <audio preload='auto' ref={bgAudioRef} src='/background.mp3'>
          <track kind='captions' />
        </audio>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-900 p-8'>
      <TalkingBox onComplete={handleDialogueComplete} text={currentText} />
      <audio preload='auto' ref={bgAudioRef} src='/background.mp3'>
        <track kind='captions' />
      </audio>
    </div>
  )
}
