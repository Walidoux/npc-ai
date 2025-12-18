import type { NPCPersonality } from '../utils/npcs'
import puter, {
  type ChatMessage,
  type ChatOptions,
  type ToolMessage,
} from '@heyputer/puter.js'
import systemPromptTemplate from '../assets/npcs/system-prompt.md?raw'

const weatherTool = {
  type: 'function',
  function: {
    name: 'get_weather',
    description: 'Get current weather for a given location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City name or location, e.g. Paris, London, Casablanca',
        },
      },
      required: ['location'],
    },
    strict: true,
  },
} satisfies ChatOptions['tools']

const getWeather = async (location: string): Promise<string> => {
  try {
    const url = `https://wttr.in/${encodeURIComponent(location)}?format=j1`
    const response = await puter.net.fetch(url)
    const data = await response.json()
    const current = data.current_condition[0]
    const temp = current.temp_C
    const desc = current.weatherDesc[0].value
    return `${location}: ${desc}, ${temp}°C`
  } catch (error) {
    console.error('Weather fetch error:', error)
    return `Unable to fetch weather for ${location}`
  }
}

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
    const tools = [weatherTool]
    const useStream = !tools.length && !!onChunk
    const testMode = import.meta.env.DEV
    const response = await puter.ai.chat(
      messages,
      {
        model: 'gpt-4o-mini',
        stream: useStream,
        ...(tools.length ? { tools } : {}),
      },
      testMode,
    )

    let fullMessage = ''
    const newMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    if (useStream) {
      // Handle streaming response (no tools)
      for await (const chunk of response) {
        if (chunk?.text) {
          fullMessage += chunk.text
          newMessage.content = fullMessage
          onChunk(chunk.text)
        }
      }
    } else {
      // Handle non-streaming response (with tools or no chunk callback)
      const chatResponse = response as { message?: Omit<ChatMessage, 'role'> }

      if (chatResponse.message?.tool_calls?.length) {
        // Handle tool calls
        const toolMessages: ToolMessage[] = []
        for (const toolCall of chatResponse.message.tool_calls) {
          if (toolCall.function.name === 'get_weather') {
            const args = JSON.parse(toolCall.function.arguments)
            const weatherData = await getWeather(args.location)
            toolMessages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: weatherData,
            })
          }
        }

        // Call AI again with tool results
        const finalMessages = [
          ...messages,
          chatResponse.message,
          ...toolMessages,
        ]
        const finalResponse = await puter.ai.chat(
          finalMessages,
          { model: 'gpt-4o-mini', stream: !!onChunk },
          testMode,
        )

        if (onChunk) {
          // Stream the final response
          for await (const chunk of finalResponse) {
            if (chunk?.text) {
              fullMessage += chunk.text
              newMessage.content = fullMessage
              onChunk(chunk.text)
            }
          }
        } else {
          // Non-streaming final response
          const finalChatResponse = finalResponse as {
            message?: { content?: string }
          }
          fullMessage =
            finalChatResponse.message?.content || String(finalResponse)
          newMessage.content = fullMessage
        }
      } else {
        // No tools called
        fullMessage = chatResponse.message?.content || String(response)
        newMessage.content = fullMessage
        if (onChunk) {
          // Emit the whole message as chunk
          onChunk(fullMessage)
        }
      }
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
