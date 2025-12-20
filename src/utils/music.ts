export const musicFiles = import.meta.glob('/public/music/background_*.mp3', {
  query: '?url',
  eager: true,
  import: 'default',
}) as Record<string, string>

export const musicMetadata = import.meta.glob('/public/music/metadata_*.json', {
  eager: true,
  import: 'default',
}) as Record<string, { title: string; author: string }>

export type MusicInfo = {
  id: string
  title: string
  author: string
  url: string
}

export const musicOptions: Record<string, MusicInfo> = {}

for (const [path, url] of Object.entries(musicFiles)) {
  const filename = path.split('/').pop() || ''
  const id = filename.replace('background_', '').replace('.mp3', '') // Extract 1, 2, 3
  const metadataKey = Object.keys(musicMetadata).find((key) =>
    key.includes(`metadata_${id}.json`),
  )
  const metadata = metadataKey ? musicMetadata[metadataKey] : null

  if (metadata) {
    musicOptions[`music_${id}`] = {
      id: `music_${id}`,
      title: metadata.title,
      author: metadata.author,
      url,
    }
  }
}
