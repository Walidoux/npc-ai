export const npcs = import.meta.glob('/src/assets/npcs/*/animated.gif', {
  as: 'url',
  eager: true,
})

export const npcMarkdowns = import.meta.glob('/src/assets/npcs/*/*.md', {
  as: 'raw',
  eager: true,
})
