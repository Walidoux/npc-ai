import { useMemo } from 'react'

export const CharacterPortrait = () => {
  const randomNpc = useMemo(() => Math.floor(Math.random() * 3) + 1, [])

  return (
    <div className='relative'>
      <img
        alt='Character'
        className='select-none object-cover'
        draggable={false}
        height={128}
        src={`/npcs/npc_${randomNpc}/animated.gif`}
        width={128}
      />
    </div>
  )
}
