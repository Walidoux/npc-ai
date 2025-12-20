import {
  Users as CharacterIcon,
  Trash as ClearIcon,
  Music as MusicIcon,
  Sliders2 as SettingsIcon,
} from '@nsmr/pixelart-react'
import { useSettings } from '../store/settings'
import { MusicSelector } from './music-selector'
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
  Slider,
  Switch,
} from './ui'

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
    backgroundMusicVolume,
    setBackgroundMusicVolume,
    conversationHistory,
    clearConversation,
  } = useSettings()

  return (
    <Sheet>
      <SheetTrigger asChild className='fixed top-4 right-4'>
        <Button className='p-2' size='icon' variant='secondary'>
          <SettingsIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className='font-head'>
        <SheetHeader>
          <SheetTitle className='inline-flex gap-x-2'>
            <SettingsIcon />
            Settings
          </SheetTitle>
          <SheetDescription>Adjust your preferences here.</SheetDescription>
        </SheetHeader>
        <div className='mt-4 overflow-y-auto px-4 pb-6'>
          <h3 className='inline-flex gap-x-2 font-semibold text-lg'>
            <CharacterIcon />
            Select Character
          </h3>
          <NpcSelector onNpcChange={setSelectedNpc} selectedNpc={selectedNpc} />
          <h3 className='mt-6 inline-flex gap-x-2 font-semibold text-lg'>
            <MusicIcon />
            Select Background Music
          </h3>
          <MusicSelector
            onMusicChange={setSelectedMusic}
            selectedMusic={selectedMusic}
          />

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
