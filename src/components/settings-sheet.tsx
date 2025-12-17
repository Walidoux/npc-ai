import { Sliders2 as SettingsIcon } from '@nsmr/pixelart-react'
import { NpcSelector } from './npc-selector'
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
} from './ui'

type SettingsSheetProps = {
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
}: SettingsSheetProps) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button className='p-2' size='icon' variant='secondary'>
        <SettingsIcon />
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Settings</SheetTitle>
        <SheetDescription>Adjust your preferences here.</SheetDescription>
      </SheetHeader>
      <div className='mt-4 px-4'>
        <h3 className='font-semibold text-lg'>Select Character</h3>
        <NpcSelector onNpcChange={onNpcChange} selectedNpc={selectedNpc} />
        {Boolean(showClearConversation) && (
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
          <div className='mt-2 flex cursor-pointer items-center justify-between'>
            <label
              className='cursor-pointer select-none text-sm'
              htmlFor='typing-sound'>
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
      <SheetFooter />
    </SheetContent>
  </Sheet>
)
