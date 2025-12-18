import type { NPCPersonality } from '../utils/npcs'
import puter, {
  type ChatMessage,
  type ChatOptions,
  type ToolMessage,
} from '@heyputer/puter.js'
import systemPromptTemplate from '../assets/npcs/system-prompt.md?raw'

type SearchResult = {
  title: string
  link: string
  snippet: string
}

type ToolCall = {
  id: string
  function: { name: string; arguments: string }
}

type ChatResponse = {
  message?: ChatMessage & { tool_calls?: ToolCall[] }
}

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

const webSearchTool: ChatOptions['tools'] = {
  type: 'function',
  function: {
    strict: true,
    name: 'web_search',
    description:
      'Search the internet for current news, historical events, or specific information.',
    parameters: {
      type: 'object',
      required: ['query'],
      properties: {
        query: {
          type: 'string',
          description:
            'The search query, e.g. "latest news Casablanca" or "history of the Eiffel Tower"',
        },
      },
    },
  },
}

const tools = [weatherTool, webSearchTool]

const parseSearchResults = (html: string): SearchResult[] => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const results: SearchResult[] = []

  for (const element of doc.querySelectorAll('.result')) {
    const titleEl = element.querySelector('.result__a')
    const snippetEl = element.querySelector('.result__snippet')
    if (titleEl && snippetEl) {
      results.push({
        title: titleEl.textContent?.trim() || '',
        link: (titleEl as HTMLAnchorElement).href,
        snippet: snippetEl.textContent?.trim() || '',
      })
    }
  }

  return results
}

const performWebSearch = async (query: string): Promise<string> => {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
    const response = await puter.net.fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    })

    const htmlText = await response.text()
    const results = parseSearchResults(htmlText).slice(0, 5)

    return results.length > 0
      ? JSON.stringify(results)
      : `No results found for "${query}".`
  } catch (error) {
    console.error('Web search error:', error)
    return `Failed to perform web search for "${query}"`
  }
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

const executeTool = async (
  name: string,
  args: Record<string, string>,
): Promise<string> => {
  switch (name) {
    case 'get_weather':
      return await getWeather(args.location)
    case 'web_search':
      return await performWebSearch(args.query)
    default:
      return `Unknown tool: ${name}`
  }
}

const processToolCalls = async (
  toolCalls: ToolCall[],
): Promise<ToolMessage[]> =>
  Promise.all(
    toolCalls.map(async (toolCall) => ({
      role: 'tool' as const,
      tool_call_id: toolCall.id,
      content: await executeTool(
        toolCall.function.name,
        JSON.parse(toolCall.function.arguments),
      ),
    })),
  )

const streamResponse = async (
  response: AsyncIterable<{ text?: string }>,
  onChunk: (chunk: string) => void,
): Promise<string> => {
  let fullMessage = ''
  for await (const chunk of response) {
    if (chunk?.text) {
      fullMessage += chunk.text
      onChunk(chunk.text)
    }
  }
  return fullMessage
}

const buildMessages = (
  message: string,
  personality: NPCPersonality,
  conversationHistory: ChatMessage[],
): ChatMessage[] => [
  { role: 'system', content: createSystemPrompt(personality) },
  ...conversationHistory.slice(-10),
  { role: 'user', content: message },
]

/** Generate a system prompt from an NPC personality. */
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

export const sendChatMessage = async (
  message: string,
  personality: NPCPersonality,
  conversationHistory: ChatMessage[] = [],
  onChunk?: (chunk: string) => void,
): Promise<string> => {
  const messages = buildMessages(message, personality, conversationHistory)
  const testMode = import.meta.env.DEV

  try {
    const response = (await puter.ai.chat(
      messages,
      { model: 'gpt-4o-mini', stream: false, tools },
      testMode,
    )) as ChatResponse

    if (!response.message?.tool_calls?.length) {
      const content = response.message?.content || String(response)
      onChunk?.(content)
      return content
    }

    const toolMessages = await processToolCalls(response.message.tool_calls)
    const finalMessages = [...messages, response.message, ...toolMessages]

    const finalResponse = await puter.ai.chat(
      finalMessages,
      { model: 'gpt-4o-mini', stream: !!onChunk },
      testMode,
    )

    if (onChunk) {
      return streamResponse(
        finalResponse as AsyncIterable<{ text?: string }>,
        onChunk,
      )
    }

    const finalChatResponse = finalResponse as ChatResponse
    return finalChatResponse.message?.content || String(finalResponse)
  } catch (error) {
    console.error('AI chat error:', error)
    return "I'm sorry, I couldn't process that right now."
  }
}
