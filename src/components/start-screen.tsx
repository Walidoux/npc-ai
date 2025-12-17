import { toast } from 'sonner'
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
}: StartScreenProps) => {
  if (!authChecked) {
    return (
      <div className='flex min-h-screen items-center justify-center p-8'>
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

  // biome-ignore lint/correctness/useHookAtTopLevel: attended
  useEffect(() => {
    toast('We do not use cookies', {
      description: 'AI feature is completely free of use',
      classNames: { content: 'mr-8' },
      cancel: { label: 'OK !', onClick: () => {} },
    })
  }, [])

  return (
    <div className='flex min-h-screen items-center justify-center p-8'>
      <div className='text-center'>
        <h1 className='mb-4 font-bold text-2xl'>NPC Chat</h1>
        <p className='mb-6'>Talk to AI-powered characters</p>
        {!authStatus && (
          <p className='mb-4'>
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
  )
}
