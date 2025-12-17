import { Sliders2 as SettingsIcon } from '@nsmr/pixelart-react'
import { useEffect, useRef, useState } from 'react'
import { CharacterPortrait, DialogueBox, TypingAudio } from './components'
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch
} from './components/ui'
import { authenticate, isAuthenticated, type Message, sendChatMessage } from './services/ai'
import { useSettings } from './store/settings'
import { useTyping } from './utils/hooks'
import { npcMarkdowns, npcPersonalities, npcs } from './utils/npcs'

type TalkingBoxProps = {
  text: string
  onComplete?: () => void
  enabled?: boolean
}

export const TalkingBox = ({ text, onComplete, enabled = true }: TalkingBoxProps) => {
  const { displayedText, isTyping, isDelayed } = useTyping(text, () => {
    onComplete?.()
  })

  return (
    <>
      <DialogueBox displayedText={displayedText} isTyping={isTyping} />
      <TypingAudio enabled={enabled} isDelayed={isDelayed} isTyping={isTyping} />
    </>
  )
}

export const Dialogue = () => {
  const [userMessage, setUserMessage] = useState('')
  const [isTypingResponse, setIsTypingResponse] = useState(false)
  const [started, setStarted] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const bgAudioRef = useRef<HTMLAudioElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    selectedNpc,
    setSelectedNpc,
    enableTypingSound,
    setEnableTypingSound,
    conversationHistory,
    addMessage,
    clearConversation,
    isAuthenticated: authStatus,
    setIsAuthenticated
  } = useSettings()

  // Check authentication on mount
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

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isTypingResponse || !authStatus) return

    const message = userMessage.trim()
    setUserMessage('')
    setIsTypingResponse(true)

    const userMessageObj: Message = {
      role: 'user',
      content: message,
      timestamp: Date.now()
    }

    // Add user message to history
    addMessage(selectedNpc, userMessageObj)

    try {
      const personality = npcPersonalities[selectedNpc]
      const history = conversationHistory[selectedNpc] || []

      let responseText = ''

      const response = await sendChatMessage(message, personality, history, (chunk) => {
        responseText += chunk
        // Update displayed text in real-time for typing effect
        // This will be handled by the TypingBox component
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message,
        timestamp: Date.now()
      }

      addMessage(selectedNpc, assistantMessage)
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      }
      addMessage(selectedNpc, errorMessage)
    } finally {
      setIsTypingResponse(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleStart = async () => {
    if (authStatus) {
      setStarted(true)
    } else {
      try {
        await authenticate()
        const authenticated = await isAuthenticated()
        setIsAuthenticated(authenticated)
        if (authenticated) {
          setStarted(true)
        }
      } catch (error) {
        console.error('Authentication failed:', error)
      }
    }
  }

  const handleNpcChange = (npcName: string) => {
    setSelectedNpc(npcName)
    // Focus input when switching NPCs
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const currentHistory = conversationHistory[selectedNpc] || []
  const lastMessage = currentHistory.at(-1)

  if (!authChecked) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-900 p-8'>
        <div className='text-white'>Checking authentication...</div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-900 p-8'>
        <div className='text-center'>
          <h1 className='mb-4 font-bold text-2xl text-white'>NPC Chat</h1>
          <p className='mb-6 text-gray-300'>Talk to AI-powered characters</p>
          {!isAuthenticated && (
            <p className='mb-4 text-yellow-400'>You'll need to sign in with Puter to use AI features</p>
          )}
          <Button onClick={handleStart}>{authStatus ? 'Start Chatting' : 'Sign In & Start'}</Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button asChild className='fixed top-4 right-4 p-2' size='icon'>
              <SettingsIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
              <SheetDescription>Adjust your preferences here.</SheetDescription>
            </SheetHeader>
            <div className='mt-4'>
              <h3 className='font-semibold text-lg'>Select Character</h3>
              <div className='mt-2 grid grid-cols-3 gap-4'>
                {Object.entries(npcs).map(([path, url]) => {
                  const name = path.split('/')[4]
                  const mdPath = `/src/assets/npcs/${name}/metadata.md`
                  const mdContent = npcMarkdowns[mdPath]
                  const isSelected = selectedNpc === name
                  return (
                    <button
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded border p-4 ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                      key={name}
                      onClick={() => handleNpcChange(name)}
                      type='button'>
                      <img alt={name} className='h-16 w-16 object-cover' height={64} src={url} width={64} />
                      <div className='text-center text-sm'>{mdContent}</div>
                    </button>
                  )
                })}
              </div>
              <div className='mt-6'>
                <h3 className='font-semibold text-lg'>Sound Settings</h3>
                <div className='mt-2 flex items-center justify-between'>
                  <label className='text-sm' htmlFor='typing-sound'>
                    Enable Typing Sound
                  </label>
                  <Switch checked={enableTypingSound} id='typing-sound' onCheckedChange={setEnableTypingSound} />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <audio preload='auto' ref={bgAudioRef} src='/background.mp3'>
          <track kind='captions' />
        </audio>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col bg-gray-900 p-8'>
      {/* Chat History */}
      <div className='mb-4 max-h-[60vh] flex-1 overflow-y-auto'>
        <div className='space-y-4'>
          {currentHistory.map((msg, index) => (
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} key={index}>
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'
                }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Character and Dialogue */}
      <div className='relative mb-4 flex items-end gap-4'>
        <CharacterPortrait />
        {lastMessage?.role === 'assistant' && <TalkingBox enabled={enableTypingSound} text={lastMessage.content} />}
      </div>

      {/* Input */}
      <div className='flex gap-2'>
        <input
          className='flex-1 rounded border border-gray-300 px-3 py-2 text-black'
          disabled={isTypingResponse}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder='Type your message...'
          ref={inputRef}
          type='text'
          value={userMessage}
        />
        <Button disabled={!userMessage.trim() || isTypingResponse} onClick={handleSendMessage}>
          {isTypingResponse ? '...' : 'Send'}
        </Button>
      </div>

      {/* Settings */}
      <Sheet>
        <SheetTrigger asChild>
          <Button asChild className='fixed top-4 right-4 p-2' size='icon'>
            <SettingsIcon />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>Adjust your preferences here.</SheetDescription>
          </SheetHeader>
          <div className='mt-4'>
            <h3 className='font-semibold text-lg'>Select Character</h3>
            <div className='mt-2 grid grid-cols-3 gap-4'>
              {Object.entries(npcs).map(([path, url]) => {
                const name = path.split('/')[4]
                const mdPath = `/src/assets/npcs/${name}/metadata.md`
                const mdContent = npcMarkdowns[mdPath]
                const isSelected = selectedNpc === name
                return (
                  <button
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded border p-4 ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                    key={name}
                    onClick={() => handleNpcChange(name)}
                    type='button'>
                    <img alt={name} className='h-16 w-16 object-cover' height={64} src={url} width={64} />
                    <div className='text-center text-sm'>{mdContent}</div>
                  </button>
                )
              })}
            </div>
            <div className='mt-6'>
              <Button className='w-full' onClick={() => clearConversation(selectedNpc)} variant='outline'>
                Clear Conversation
              </Button>
            </div>
            <div className='mt-6'>
              <h3 className='font-semibold text-lg'>Sound Settings</h3>
              <div className='mt-2 flex items-center justify-between'>
                <label className='text-sm' htmlFor='typing-sound'>
                  Enable Typing Sound
                </label>
                <Switch checked={enableTypingSound} id='typing-sound' onCheckedChange={setEnableTypingSound} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <audio preload='auto' ref={bgAudioRef} src='/background.mp3'>
        <track kind='captions' />
      </audio>
    </div>
  )
}
