import { Sliders2 as SettingsIcon } from '@nsmr/pixelart-react'
import { useEffect, useRef, useState } from 'react'
import { CharacterPortrait, DialogueBox, TypingAudio } from './components'
import { Button } from './components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet'
import { Switch } from './components/ui/switch'
import { useSettings } from './store/settings'
import { useTyping } from './utils/hooks'
import { npcMarkdowns, npcs } from './utils/npcs'

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
  const [currentText, setCurrentText] = useState('')
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const bgAudioRef = useRef<HTMLAudioElement>(null)
  const { selectedNpc, setSelectedNpc, enableTypingSound, setEnableTypingSound } = useSettings()

  const dialogues = ['Salut beau gosse :) ! Je tiens juste à te souhaite une excellente journée, aurevoir !']

  useEffect(() => {
    if (started && dialogueIndex < dialogues.length) {
      setCurrentText(dialogues[dialogueIndex])
    }
  }, [dialogueIndex, started])

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

  const handleDialogueComplete = () => {
    if (dialogueIndex < dialogues.length - 1) {
      // Small delay before next dialogue
      setTimeout(() => {
        setDialogueIndex((prev) => prev + 1)
      }, 2000)
    } else {
      // Unrender dialogue box when all dialogues reach the end, keep music
      setFinished(true)
    }
  }

  const handleStart = () => {
    setStarted(true)
  }

  if (!started) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-900 p-8'>
        <Button onClick={handleStart}>Listen</Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button asChild className='p-2' size='icon'>
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
                      onClick={() => setSelectedNpc(name)}
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
    <div className='flex min-h-screen items-center justify-center bg-gray-900 p-8'>
      <div className='relative flex items-end gap-4'>
        <CharacterPortrait />
        {!finished && <TalkingBox enabled={enableTypingSound} onComplete={handleDialogueComplete} text={currentText} />}
      </div>
      <audio preload='auto' ref={bgAudioRef} src='/background.mp3'>
        <track kind='captions' />
      </audio>
    </div>
  )
}
