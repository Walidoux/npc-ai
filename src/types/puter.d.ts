import '@heyputer/puter.js'
import type { ChatMessage } from '@heyputer/puter.js'

declare module '@heyputer/puter.js' {
  export type ChatOptions = {
    tools: {
      type: 'function' | 'object'
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
}
