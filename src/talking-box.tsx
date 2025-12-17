import { useRef, useState } from 'react'
import {
  CharacterPortrait,
  DialogueBox,
  HistoryDialog,
  SettingsSheet,
  StartScreen,
  TypingAudio,
} from './components'
import { Button, Input } from './components/ui'
import { type Message, sendChatMessage } from './services/ai'
import { useSettings } from './store/settings'
import { getSample } from './utils'
import {
  useAuth,
  useBackgroundAudio,
  useKeySound,
  useTyping,
} from './utils/hooks'
import { npcPersonalities } from './utils/npcs'

type TalkingBoxProps = {
  text: string
  onComplete?: () => void
  enabled?: boolean
}

export const TalkingBox = ({
  text,
  onComplete,
  enabled = true,
}: TalkingBoxProps) => {
  const { displayedText, isTyping, isDelayed } = useTyping(text, () => {
    onComplete?.()
  })

  return (
    <>
      <DialogueBox displayedText={displayedText} isTyping={isTyping} />
      <TypingAudio
        enabled={enabled}
        isDelayed={isDelayed}
        isTyping={isTyping}
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
    conversationHistory,
    addMessage,
    clearConversation,
  } = useSettings()

  const { authChecked, isAuthenticating, authStatus, handleStart } = useAuth()
  const bgAudioRef = useBackgroundAudio(started)

  const handleSendMessage = async () => {
    if (userMessage.trim() && !isTypingResponse && authStatus) {
      const message = userMessage.trim()
      setUserMessage('')
      setIsTypingResponse(true)
      setCurrentResponse('')

      const userMessageObj: Message = {
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

        const response = await sendChatMessage(
          message,
          personality,
          history,
          (chunk) => {
            _responseText += chunk
            console.log(chunk)
            setCurrentResponse((prev) => prev + chunk)
          },
        )

        const assistantMessage: Message = {
          role: 'assistant',
          content: response.message,
          timestamp: Date.now(),
        }

        addMessage(selectedNpc, assistantMessage)
      } catch (error) {
        console.error('Failed to send message:', error)
        const errorMessage: Message = {
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
    // Focus input when switching NPCs
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const currentHistory = conversationHistory[selectedNpc] || []
  const lastMessage = currentHistory.at(-1)

  if (!started) {
    return (
      <StartScreen
        authChecked={authChecked}
        authStatus={authStatus}
        enableTypingSound={enableTypingSound}
        isAuthenticating={isAuthenticating}
        onNpcChange={handleNpcChange}
        onStart={() => handleStart(setStarted)}
        selectedNpc={selectedNpc}
        setEnableTypingSound={setEnableTypingSound}
      />
    )
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-8'>
      <section
        aria-label='character-dialogue'
        className='relative mb-4 flex items-end gap-4'>
        <CharacterPortrait />
        {lastMessage?.role === 'assistant' && !isTypingResponse ? (
          <TalkingBox enabled={enableTypingSound} text={lastMessage.content} />
        ) : null}
        {isTypingResponse ? (
          <TalkingBox enabled={enableTypingSound} text={currentResponse} />
        ) : null}
      </section>

      {/* Input */}
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
          disabled={!userMessage.trim() || isTypingResponse}
          onClick={handleSendMessage}>
          {isTypingResponse ? '...' : 'SEND'}
        </Button>
      </div>

      {/* History and Settings */}
      <div className='fixed top-4 right-4 flex gap-2'>
        <HistoryDialog
          currentHistory={currentHistory}
          selectedNpc={selectedNpc}
        />
        <SettingsSheet
          enableTypingSound={enableTypingSound}
          onClearConversation={() => clearConversation(selectedNpc)}
          onNpcChange={handleNpcChange}
          selectedNpc={selectedNpc}
          setEnableTypingSound={setEnableTypingSound}
          showClearConversation={true}
        />
      </div>
      <audio preload='auto' ref={bgAudioRef} src={getSample('background.mp3')}>
        <track kind='captions' />
      </audio>
    </main>
  )
}
