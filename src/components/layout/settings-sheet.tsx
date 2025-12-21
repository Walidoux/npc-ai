import {
  Users as CharacterIcon,
  Trash as ClearIcon,
  Music as MusicIcon,
  Sliders2 as SettingsIcon,
  Volume2 as VolumeSettings,
} from '@nsmr/pixelart-react'
import { cn } from 'tailwind-variants'
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Slider,
  Switch,
  Text,
} from '@/components/ui'
import { useSettings } from '@/store/settings'
import { MusicSelector } from './music-selector'
import { NpcSelector } from './npc-selector'

export const SettingsSheet = () => {
  const {
    selectedNpc,
    setSelectedNpc,
    selectedMusic,
    setSelectedMusic,
    enableTypingSound,
    setEnableTypingSound,
    typingSoundVolume,
    setTypingSoundVolume,
    enableBackgroundMusic,
    setEnableBackgroundMusic,
    backgroundMusicVolume,
    setBackgroundMusicVolume,
    conversationHistory,
    clearConversation,
  } = useSettings()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className='p-2' size='icon' variant='outline'>
          <SettingsIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className='font-head'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-x-2'>
            <SettingsIcon size={28} />
            <Text as='h3' className='font-semibold'>
              Settings
            </Text>
          </SheetTitle>
          <SheetDescription>Adjust your preferences here.</SheetDescription>
        </SheetHeader>
        <div className='mt-4 overflow-y-auto px-4 pb-6'>
          <Text as='h4' className='flex items-center gap-x-2 font-semibold'>
            <CharacterIcon size={20} />
            Select Character
          </Text>
          <NpcSelector onNpcChange={setSelectedNpc} selectedNpc={selectedNpc} />
          <Text
            as='h4'
            className='mt-6 flex items-center gap-x-2 font-semibold'>
            <MusicIcon />
            Background Music
          </Text>
          <div className='mt-2 flex cursor-pointer items-center justify-between'>
            <label
              className='cursor-pointer select-none text-sm'
              htmlFor='background-music'>
              Enable Background Music
            </label>
            <Switch
              checked={enableBackgroundMusic}
              id='background-music'
              onCheckedChange={setEnableBackgroundMusic}
            />
          </div>
          <MusicSelector
            onMusicChange={setSelectedMusic}
            selectedMusic={selectedMusic}
          />

          <div className='mt-6'>
            <Text as='h4' className='flex items-center gap-x-2 font-semibold'>
              <VolumeSettings />
              Sound Settings
            </Text>
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
            {enableTypingSound && (
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
            )}
            <div
              className={cn('mt-4', {
                'pointer-events-none opacity-20': !enableBackgroundMusic,
              })}>
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
        {(conversationHistory[selectedNpc] || []).length > 0 && (
          <SheetFooter>
            <Button
              className='gap-x-4'
              onClick={() => clearConversation(selectedNpc)}
              variant='outline'>
              <ClearIcon />
              Clear Conversation
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
