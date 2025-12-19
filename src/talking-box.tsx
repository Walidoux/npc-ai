import type { ChatMessage } from '@heyputer/puter.js'
import {
  CharacterPortrait,
  DialogueBox,
  HistoryDialog,
  SettingsSheet,
  StartScreen,
  TypingAudio,
} from './components'
import { Button, Input } from './components/ui'
import { sendChatMessage } from './services/ai'
import { useSettings } from './store/settings'
import { getSample } from './utils'
import {
  useAuth,
  useBackgroundAudio,
  useCarbonFootprint,
  useKeySound,
  useTyping,
} from './utils/hooks'
import { npcPersonalities } from './utils/npcs'

type TalkingBoxProps = {
  text: string
  onComplete?: () => void
  enabled?: boolean
  isStreamComplete?: boolean
  typingSoundVolume: number
}

export const TalkingBox = ({
  text,
  onComplete,
  enabled = true,
  isStreamComplete = true,
  typingSoundVolume,
}: TalkingBoxProps) => {
  const { displayedText, isTyping, isDelayed } = useTyping(text, {
    onComplete,
    isStreamComplete,
  })

  return (
    <>
      <DialogueBox displayedText={displayedText} isTyping={isTyping} />
      <TypingAudio
        enabled={enabled}
        isDelayed={isDelayed}
        isTyping={isTyping}
        volume={typingSoundVolume}
      />
    </>
  )
}

export const Dialogue = () => {
  const [userMessage, setUserMessage] = useState('')
  const [isTypingResponse, setIsTypingResponse] = useState(false)
  const [started, setStarted] = useState(false)
  const [currentResponse, setCurrentResponse] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useKeySound()
  const {
    selectedNpc,
    setSelectedNpc,
    enableTypingSound,
    setEnableTypingSound,
    typingSoundVolume,
    setTypingSoundVolume,
    backgroundMusicVolume,
    setBackgroundMusicVolume,
    conversationHistory,
    addMessage,
    clearConversation,
  } = useSettings()

  const { authChecked, isAuthenticating, authStatus, handleStart } = useAuth()
  const bgAudioRef = useBackgroundAudio(started)
  const carbonMetrics = useCarbonFootprint()

  useEffect(() => {
    console.log('Carbon Footprint Data:', carbonMetrics)
  }, [carbonMetrics])

  const handleSendMessage = async () => {
    if (userMessage.trim() && !isTypingResponse && authStatus) {
      const message = userMessage.trim()
      setUserMessage('')
      setIsTypingResponse(true)
      setCurrentResponse('')

      const userMessageObj: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: Date.now(),
      }

      // Add user message to history
      addMessage(selectedNpc, userMessageObj)

      try {
        const personality = npcPersonalities[selectedNpc]
        const history = conversationHistory[selectedNpc] || []

        let _responseText = ''

        const content = await sendChatMessage(
          message,
          personality,
          history,
          (chunk) => {
            _responseText += chunk
            console.log(chunk)
            setCurrentResponse((prev) => prev + chunk)
          },
        )

        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content,
          timestamp: Date.now(),
        }

        addMessage(selectedNpc, assistantMessage)
      } catch (error) {
        console.error('Failed to send message:', error)
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: Date.now(),
        }
        addMessage(selectedNpc, errorMessage)
      } finally {
        setIsTypingResponse(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNpcChange = (npcName: string) => {
    setSelectedNpc(npcName)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const currentHistory = conversationHistory[selectedNpc] || []

  if (!started) {
    return (
      <StartScreen
        authChecked={authChecked}
        authStatus={authStatus}
        backgroundMusicVolume={backgroundMusicVolume}
        enableTypingSound={enableTypingSound}
        isAuthenticating={isAuthenticating}
        onNpcChange={handleNpcChange}
        onStart={() => handleStart(setStarted)}
        selectedNpc={selectedNpc}
        setBackgroundMusicVolume={setBackgroundMusicVolume}
        setEnableTypingSound={setEnableTypingSound}
        setTypingSoundVolume={setTypingSoundVolume}
        typingSoundVolume={typingSoundVolume}
      />
    )
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-8'>
      <section
        aria-label='character-dialogue'
        className='relative mb-4 flex items-end gap-4'>
        <CharacterPortrait />
        {Boolean(isTypingResponse || currentResponse) && (
          <TalkingBox
            enabled={enableTypingSound}
            isStreamComplete={!isTypingResponse}
            text={currentResponse}
            typingSoundVolume={typingSoundVolume}
          />
        )}
      </section>

      <div className='flex gap-2'>
        <Input
          autoFocus
          disabled={isTypingResponse}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder='Type your message...'
          ref={inputRef}
          type='text'
          value={userMessage}
        />
        <Button
          className='uppercase'
          disabled={!userMessage.trim() || isTypingResponse}
          onClick={handleSendMessage}>
          {isTypingResponse ? '...' : 'send'}
        </Button>
      </div>

      <div className='fixed top-4 right-4 flex gap-2'>
        <HistoryDialog
          currentHistory={currentHistory}
          selectedNpc={selectedNpc}
        />
        <SettingsSheet
          backgroundMusicVolume={backgroundMusicVolume}
          enableTypingSound={enableTypingSound}
          onClearConversation={() => clearConversation(selectedNpc)}
          onNpcChange={handleNpcChange}
          selectedNpc={selectedNpc}
          setBackgroundMusicVolume={setBackgroundMusicVolume}
          setEnableTypingSound={setEnableTypingSound}
          setTypingSoundVolume={setTypingSoundVolume}
          showClearConversation={true}
          typingSoundVolume={typingSoundVolume}
        />
      </div>
      <audio preload='auto' ref={bgAudioRef} src={getSample('background.mp3')}>
        <track kind='captions' />
      </audio>
    </main>
  )
}
