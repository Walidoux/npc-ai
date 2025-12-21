import type { ChatMessage } from '@heyputer/puter.js'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CharacterPortrait,
  CO2EmissionsPage,
  DialogueBox,
  HeaderPanel,
  HistoryDialog,
  StartScreen,
  TypingAudio,
} from './components/layout'
import { Button, Input } from './components/ui'
import { sendChatMessage } from './services/ai'
import { useSettings } from './store'
import {
  useAuth,
  useBackgroundAudio,
  useKeySound,
  useTyping,
} from './utils/hooks'
import { musicOptions } from './utils/music'
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
  const [showCO2Page, setShowCO2Page] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useKeySound()

  const {
    selectedNpc,
    selectedMusic,
    enableTypingSound,
    typingSoundVolume,
    conversationHistory,
    addMessage,
  } = useSettings()

  const { authChecked, isAuthenticating, authStatus, handleStart } = useAuth()
  const bgAudioRef = useBackgroundAudio(started)

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

  return (
    <>
      <HeaderPanel onCO2Click={() => setShowCO2Page(true)} />
      <AnimatePresence mode='wait'>
        {started &&
          !showCO2Page &&
          (conversationHistory[selectedNpc] || []).length > 0 && (
            <HistoryDialog
              currentHistory={conversationHistory[selectedNpc] || []}
              selectedNpc={selectedNpc}
            />
          )}

        {showCO2Page && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='absolute inset-0 overflow-y-auto'
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
            key='co2-page'
            transition={{ duration: 0.5, ease: 'easeInOut' }}>
            <CO2EmissionsPage onBack={() => setShowCO2Page(false)} />
          </motion.div>
        )}

        {!showCO2Page && started && (
          <motion.main
            animate={{ opacity: 1, y: 0 }}
            className='flex min-h-screen flex-col items-center justify-center p-8'
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
            key='dialogue-screen'
            transition={{ duration: 0.5, ease: 'easeInOut' }}>
            <section
              aria-label='character-dialogue'
              className='relative mb-4 flex items-end gap-4'>
              <CharacterPortrait />
              {isTypingResponse ||
                (currentResponse && (
                  <TalkingBox
                    enabled={enableTypingSound}
                    isStreamComplete={!isTypingResponse}
                    text={currentResponse}
                    typingSoundVolume={typingSoundVolume}
                  />
                ))}
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
            <audio
              preload='auto'
              ref={bgAudioRef}
              src={musicOptions[selectedMusic]?.url}>
              <track kind='captions' />
            </audio>
          </motion.main>
        )}

        {!(showCO2Page || started) && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='absolute inset-0'
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
            key='start-screen'
            transition={{ duration: 0.5, ease: 'easeInOut' }}>
            <StartScreen
              authChecked={authChecked}
              authStatus={authStatus}
              isAuthenticating={isAuthenticating}
              onStart={() => handleStart(setStarted)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
