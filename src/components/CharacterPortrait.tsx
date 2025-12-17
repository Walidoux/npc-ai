import { useSettings } from '../store/settings'
import { npcs } from '../utils/npcs'

export const CharacterPortrait = () => {
  const { selectedNpc } = useSettings()
  const npcUrl = npcs[`/src/assets/npcs/${selectedNpc}/animated.gif`]

  return (
    <div className='relative'>
      <img
        alt='Character'
        className='select-none object-cover'
        draggable={false}
        height={128}
        src={npcUrl}
        width={128}
      />
    </div>
  )
}
