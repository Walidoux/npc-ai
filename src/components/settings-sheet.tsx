import { Sliders2 as SettingsIcon } from '@nsmr/pixelart-react'
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
} from './ui'
import { NpcSelector } from './npc-selector'

interface SettingsSheetProps {
  selectedNpc: string
  onNpcChange: (name: string) => void
  enableTypingSound: boolean
  setEnableTypingSound: (value: boolean) => void
  showClearConversation?: boolean
  onClearConversation?: () => void
}

export const SettingsSheet = ({
  selectedNpc,
  onNpcChange,
  enableTypingSound,
  setEnableTypingSound,
  showClearConversation = false,
  onClearConversation,
}: SettingsSheetProps) => {
  return (
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
          <NpcSelector selectedNpc={selectedNpc} onNpcChange={onNpcChange} />
          {showClearConversation && (
            <div className='mt-6'>
              <Button
                className='w-full'
                onClick={onClearConversation}
                variant='outline'>
                Clear Conversation
              </Button>
            </div>
          )}
          <div className='mt-6'>
            <h3 className='font-semibold text-lg'>Sound Settings</h3>
            <div className='mt-2 flex items-center justify-between'>
              <label className='text-sm' htmlFor='typing-sound'>
                Enable Typing Sound
              </label>
              <Switch
                checked={enableTypingSound}
                id='typing-sound'
                onCheckedChange={setEnableTypingSound}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
