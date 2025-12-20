import { musicOptions } from '../utils/music'

type MusicSelectorProps = {
  selectedMusic: string
  onMusicChange: (music: string) => void
}

export const MusicSelector = ({
  selectedMusic,
  onMusicChange,
}: MusicSelectorProps) => (
  <div className='mt-2 grid grid-cols-1 gap-4'>
    {Object.entries(musicOptions).map(([id, music]) => {
      const isSelected = selectedMusic === id
      return (
        <button
          className={`flex cursor-pointer flex-col items-center gap-2 rounded border p-4 ${
            isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          key={id}
          onClick={() => onMusicChange(id)}
          type='button'>
          <div className='text-center text-sm'>
            <div className='font-semibold'>{music.title}</div>
            <div className='text-gray-600'>by {music.author}</div>
          </div>
        </button>
      )
    })}
  </div>
)
