import '@heyputer/puter.js'
import type { ChatMessage as BaseChatMessage } from '@heyputer/puter.js'

declare module '@heyputer/puter.js' {
  export type ChatOptions = {
    tools: {
      type: 'function'
      function: Record<'name' | 'description', string> & {
        strict: boolean
        parameters: {
          type: 'function' | 'object'
          required: string[]
          properties: Record<string, string | object>
        }
      }
    }
  }

  export type ToolMessage = Omit<ChatMessage, 'tool_calls'> & {
    tool_call_id: string
  }

  export type ChatMessage = BaseChatMessage & {
    role: 'system' | 'user' | 'assistant'
    timestamp?: number
  }
}
