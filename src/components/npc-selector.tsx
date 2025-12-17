import { npcPersonalities, npcs } from '../utils/npcs'

type NpcSelectorProps = {
  selectedNpc: string
  onNpcChange: (name: string) => void
}

export const NpcSelector = ({ selectedNpc, onNpcChange }: NpcSelectorProps) => (
  <div className='mt-2 grid grid-cols-3 gap-4'>
    {Object.entries(npcs).map(([path, url]) => {
      const name = path.split('/')[4]
      const personality = npcPersonalities[name]
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
            alt={personality.name}
            className='h-16 w-16 object-cover'
            height={64}
            src={url}
            width={64}
          />
          <div className='text-center text-sm'>
            <span> {personality.name}</span>
            {/* TODO: does not work */}
            <ul className='list-inside list-disc'>
              {personality.traits.map((trait) => (
                <li key={trait}>{trait}</li>
              ))}
            </ul>
          </div>
        </button>
      )
    })}
  </div>
)
