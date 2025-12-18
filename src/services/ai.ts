import type { NPCPersonality } from '../utils/npcs'
import puter, { type ChatMessage } from '@heyputer/puter.js'
import systemPromptTemplate from '../assets/npcs/system-prompt.md?raw'

const interpolateTemplate = (
  template: string,
  values: Record<string, string>,
) =>
  Object.entries(values).reduce(
    (acc, [key, value]) => acc.replace(`{${key}}`, value),
    template,
  )

export type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: number
}

export type ChatResponse = {
  message: string
  fullResponse: Message[]
}

// Generate system prompt from NPC personality
export const createSystemPrompt = ({
  name,
  personality,
  traits,
  description,
}: NPCPersonality): string =>
  interpolateTemplate(systemPromptTemplate, {
    name,
    personality,
    traits: traits.length > 0 ? traits.join(', ') : '',
    description,
  })

// Send chat message and get AI response
export const sendChatMessage = async (
  message: string,
  personality: NPCPersonality,
  conversationHistory: Message[] = [],
  onChunk?: (chunk: string) => void,
): Promise<ChatResponse> => {
  const messages = [
    { role: 'system' as const, content: createSystemPrompt(personality) },
    ...conversationHistory.slice(-10), // Keep last 10 messages for context
    { role: 'user' as const, content: message },
  ] satisfies ChatMessage[]

  try {
    const testMode = import.meta.env.DEV
    const response = await puter.ai.chat(
      messages,
      {
        model: 'gpt-4o-mini',
        stream: !!onChunk,
      },
      testMode,
    )

    let fullMessage = ''
    const newMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    if (onChunk) {
      // Handle streaming response
      for await (const chunk of response) {
        if (chunk?.text) {
          fullMessage += chunk.text
          newMessage.content = fullMessage
          onChunk(chunk.text)
        }
      }
    } else {
      // Handle non-streaming response
      const chatResponse = response as { message?: { content?: string } }
      fullMessage = chatResponse.message?.content || String(response)
      newMessage.content = fullMessage
    }

    const fullResponse: Message[] = [
      ...conversationHistory,
      { role: 'user', content: message, timestamp: Date.now() },
      newMessage,
    ]

    return {
      message: fullMessage,
      fullResponse,
    }
  } catch (error) {
    console.error('AI chat error:', error)

    // Return fallback response
    const fallbackMessage: Message = {
      role: 'assistant',
      content: `I'm sorry, I couldn't process that right now. Let's try again later!`,
      timestamp: Date.now(),
    }

    return {
      message: fallbackMessage.content,
      fullResponse: [
        ...conversationHistory,
        { role: 'user', content: message, timestamp: Date.now() },
        fallbackMessage,
      ],
    }
  }
}

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await puter.auth.getUser()
    return !!user
  } catch {
    return false
  }
}

export const authenticate = async (): Promise<void> => {
  await puter.auth.signIn()
}
