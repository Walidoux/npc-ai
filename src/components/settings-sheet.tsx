import { Sliders2 as SettingsIcon } from '@nsmr/pixelart-react'
import { NpcSelector } from './npc-selector'
import { Slider } from './retroui/Slider'
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
  typingSoundVolume: number
  setTypingSoundVolume: (value: number) => void
  backgroundMusicVolume: number
  setBackgroundMusicVolume: (value: number) => void
  showClearConversation?: boolean
  onClearConversation?: () => void
}

export const SettingsSheet = ({
  selectedNpc,
  onNpcChange,
  enableTypingSound,
  setEnableTypingSound,
  typingSoundVolume,
  setTypingSoundVolume,
  backgroundMusicVolume,
  setBackgroundMusicVolume,
  showClearConversation = false,
  onClearConversation,
}: SettingsSheetProps) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button className='p-2' size='icon' variant='secondary'>
        <SettingsIcon />
      </Button>
    </SheetTrigger>
    <SheetContent className='font-head'>
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
          {enableTypingSound ? (
            <div className='mt-4'>
              <label
                className='font-medium text-sm'
                htmlFor='typing-sound-volume'>
                Typing Sound Volume
              </label>
              <div className='mt-2'>
                <Slider
                  className='w-full'
                  id='typing-sound-volume'
                  max={1}
                  min={0}
                  onValueChange={(value) => setTypingSoundVolume(value[0])}
                  step={0.1}
                  value={[typingSoundVolume]}
                />
              </div>
            </div>
          ) : null}
          <div className='mt-4'>
            <label className='font-medium text-sm' htmlFor='bg-music-volume'>
              Background Music Volume
            </label>
            <div className='mt-2'>
              <Slider
                className='w-full'
                id='bg-music-volume'
                max={1}
                min={0}
                onValueChange={(value) => setBackgroundMusicVolume(value[0])}
                step={0.1}
                value={[backgroundMusicVolume]}
              />
            </div>
          </div>
        </div>
      </div>
      <SheetFooter />
    </SheetContent>
  </Sheet>
)
