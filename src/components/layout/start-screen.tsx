import { ArrowBarDown as AuthIcon, Chat } from '@nsmr/pixelart-react'
import { toast } from 'sonner'
import { Button, Spinner, Text } from '@/components/ui'

type StartScreenProps = {
  authChecked: boolean
  isAuthenticating: boolean
  authStatus: boolean
  onStart: () => void
}

export const StartScreen = ({
  authChecked,
  isAuthenticating,
  authStatus,
  onStart,
}: StartScreenProps) => {
  if (!authChecked) {
    return (
      <div className='flex min-h-screen items-center justify-center p-8 font-head'>
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
    buttonContent = (
      <>
        <Chat className='mr-2' size={18} />
        Start Chatting
      </>
    )
  } else {
    buttonContent = (
      <>
        <AuthIcon />
        Sign In & Chat
      </>
    )
  }

  // biome-ignore lint/correctness/useHookAtTopLevel: attended
  useEffect(() => {
    if (localStorage.getItem('toastShown') !== 'true') {
      toast('We do not use cookies', {
        description: 'AI feature is completely free of use',
        classNames: { content: 'mr-8' },
        duration: Number.POSITIVE_INFINITY,
        cancel: {
          label: 'OK !',
          onClick() {
            localStorage.setItem('toastShown', 'true')
          },
        },
      })
    }
  }, [])

  return (
    <div className='flex min-h-screen items-center justify-center p-8'>
      <div className='text-center'>
        {!authStatus && (
          <Text className='mb-4'>
            You'll need to sign in with Puter to use AI features
          </Text>
        )}
        <Button disabled={isAuthenticating} onClick={onStart}>
          {buttonContent}
        </Button>
      </div>
    </div>
  )
}
