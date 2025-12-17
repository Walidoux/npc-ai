import { SettingsSheet } from './settings-sheet'
import { Button, Spinner } from './ui'

type StartScreenProps = {
  authChecked: boolean
  isAuthenticating: boolean
  authStatus: boolean
  onStart: () => void
  selectedNpc: string
  onNpcChange: (name: string) => void
  enableTypingSound: boolean
  setEnableTypingSound: (value: boolean) => void
  bgAudioRef: React.RefObject<HTMLAudioElement | null>
}

export const StartScreen = ({
  authChecked,
  isAuthenticating,
  authStatus,
  onStart,
  selectedNpc,
  onNpcChange,
  enableTypingSound,
  setEnableTypingSound,
  bgAudioRef,
}: StartScreenProps) => {
  if (!authChecked) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-900 p-8'>
        <Spinner className='mr-2' size='sm' />
        Checking authentication...
      </div>
    )
  }

  let buttonContent: React.ReactNode
  if (isAuthenticating) {
    buttonContent = (
      <>
        <Spinner className='mr-2' size='sm' />
        Signing in...
      </>
    )
  } else if (authStatus) {
    buttonContent = 'Start Chatting'
  } else {
    buttonContent = 'Sign In & Start'
  }

  return (
    <>
      <div className='flex min-h-screen items-center justify-center bg-gray-900 p-8'>
        <div className='text-center'>
          <h1 className='mb-4 font-bold text-2xl text-white'>NPC Chat</h1>
          <p className='mb-6 text-gray-300'>Talk to AI-powered characters</p>
          {!authStatus && (
            <p className='mb-4 text-yellow-400'>
              You'll need to sign in with Puter to use AI features
            </p>
          )}
          <Button disabled={isAuthenticating} onClick={onStart}>
            {buttonContent}
          </Button>
        </div>
        <SettingsSheet
          enableTypingSound={enableTypingSound}
          onNpcChange={onNpcChange}
          selectedNpc={selectedNpc}
          setEnableTypingSound={setEnableTypingSound}
        />
      </div>
      <audio preload='auto' ref={bgAudioRef} src='/background.mp3'>
        <track kind='captions' />
      </audio>
    </>
  )
}
