import { cn } from 'tailwind-variants'
import { Button } from '@/components/ui'
import { useSettings } from '@/store/settings'
import { musicOptions } from '@/utils/music'

type MusicSelectorProps = {
  selectedMusic: string
  onMusicChange: (music: string) => void
}

export const MusicSelector = ({
  selectedMusic,
  onMusicChange,
}: MusicSelectorProps) => {
  const { enableBackgroundMusic } = useSettings()
  return (
    <div
      className={cn('mt-4 grid grid-cols-1 gap-2', {
        'pointer-events-none opacity-20': !enableBackgroundMusic,
      })}>
      {Object.entries(musicOptions).map(([id, music]) => {
        const isSelected = selectedMusic === id
        return (
          <Button
            className={cn(
              'hover:translate-none active:translate-none flex-col shadow-none hover:bg-blue-50 hover:shadow-none',
              {
                'border-blue-500 bg-blue-50': isSelected,
                'border-gray-300': !isSelected,
              },
            )}
            key={id}
            onClick={() => onMusicChange(id)}
            type='button'
            variant='outline'>
            <div className='text-center text-sm'>
              <div className='font-semibold'>{music.title}</div>
              <div className='text-gray-600'>by {music.author}</div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
