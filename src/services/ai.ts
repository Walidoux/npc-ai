import type { NPCPersonality } from '../utils/npcs'
import puter, {
  type ChatMessage,
  type ChatOptions,
  type ToolMessage,
} from '@heyputer/puter.js'
import systemPromptTemplate from '../assets/npcs/system-prompt.md?raw'

const weatherTool: ChatOptions['tools'] = {
  type: 'function',
  function: {
    strict: true,
    name: 'get_weather',
    description: 'Get current weather for a given location',
    parameters: {
      type: 'object',
      required: ['location'],
      properties: {
        location: {
          type: 'string',
          description: 'City name or location, e.g. Paris, London, Casablanca',
        },
      },
    },
  },
}

const getWeather = async (location: string): Promise<string> => {
  try {
    const url = `https://wttr.in/${encodeURIComponent(location)}?format=j1`
    const response = await puter.net.fetch(url)
    const data = await response.json()
    const current = data.current_condition[0]
    return `${location}: ${current.weatherDesc[0].value}, ${current.temp_C}°C`
  } catch (error) {
    console.error('Weather fetch error:', error)
    return `Unable to fetch weather for ${location}`
  }
}

/**
 * Generate a system prompt from an NPC personality.
 * The system prompt is a template that includes details about the NPC's name,
 * personality, traits, and description.
 * @param {NPCPersonality} personality The NPC's personality.
 * @returns {string} The generated system prompt.
 */
export const createSystemPrompt = ({
  name,
  personality,
  traits,
  description,
}: NPCPersonality): string =>
  Object.entries({
    name,
    personality,
    traits: traits.length > 0 ? traits.join(', ') : '',
    description,
  }).reduce(
    (acc, [key, value]): string => acc.replace(`{${key}}`, value),
    systemPromptTemplate,
  )

// Send chat message and get AI response
export const sendChatMessage = async (
  message: string,
  personality: NPCPersonality,
  conversationHistory: ChatMessage[] = [],
  onChunk?: (chunk: string) => void,
): Promise<string> => {
  const messages: ChatMessage[] = [
    { role: 'system', content: createSystemPrompt(personality) },
    ...conversationHistory.slice(-10), // Keep last 10 messages for context
    { role: 'user', content: message },
  ]

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
    const newMessage: ChatMessage = {
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

    return fullMessage
  } catch (error) {
    console.error('AI chat error:', error)

    // Return fallback response
    const fallbackMessage: ChatMessage = {
      role: 'assistant',
      content: `I'm sorry, I couldn't process that right now. Let's try again later!`,
      timestamp: Date.now(),
    }

    return fallbackMessage.content
  }
}
