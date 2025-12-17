import { npcMarkdowns, npcs } from '../utils/npcs'

interface NpcSelectorProps {
  selectedNpc: string
  onNpcChange: (name: string) => void
}

export const NpcSelector = ({ selectedNpc, onNpcChange }: NpcSelectorProps) => {
  return (
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
            onClick={() => onNpcChange(name)}
            type='button'>
            <img
              alt={name}
              className='h-16 w-16 object-cover'
              height={64}
              src={url}
              width={64}
            />
            <div className='text-center text-sm'>{mdContent}</div>
          </button>
        )
      })}
    </div>
  )
}
