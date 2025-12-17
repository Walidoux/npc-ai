export const npcs = import.meta.glob('/src/assets/npcs/*/animated.gif', {
  as: 'url',
  eager: true
})

export const npcMarkdowns = import.meta.glob('/src/assets/npcs/*/*.md', {
  as: 'raw',
  eager: true
})

// Regex patterns defined at module level for performance
const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
const YAML_LINE_REGEX = /^(\w+):\s*(.*)$/
const QUOTE_REGEX = /^["']|["']$/g

export type NPCPersonality = {
  name: string
  personality: string
  traits: string[]
  description: string
}

// Parse YAML frontmatter from markdown content
const parseFrontmatter = (content: string): NPCPersonality => {
  const frontmatterMatch = content.match(FRONTMATTER_REGEX)
  if (!frontmatterMatch) {
    return {
      name: 'Unknown',
      personality: 'Neutral',
      traits: [],
      description: content.trim()
    }
  }

  const frontmatter = frontmatterMatch[1]
  const description = frontmatterMatch[2].trim()

  const lines = frontmatter.split('\n')
  const data: Record<string, string | string[]> = {}

  for (const line of lines) {
    const match = line.match(YAML_LINE_REGEX)
    if (match) {
      const [, key, value] = match
      try {
        // Try to parse as JSON for arrays
        data[key] = JSON.parse(value)
      } catch {
        data[key] = value.replace(QUOTE_REGEX, '') // Remove quotes if present
      }
    }
  }

  return {
    name: typeof data.name === 'string' ? data.name : 'Unknown',
    personality: typeof data.personality === 'string' ? data.personality : 'Neutral',
    traits: Array.isArray(data.traits) ? data.traits : [],
    description
  }
}

export const npcPersonalities: Record<string, NPCPersonality> = {}

for (const [path, content] of Object.entries(npcMarkdowns)) {
  const npcName = path.split('/')[4] // Extract npc_1, npc_2, etc.
  npcPersonalities[npcName] = parseFrontmatter(content)
}
