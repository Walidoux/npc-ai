import type { ChatMessage } from '@heyputer/puter.js'
import { create } from 'zustand'

type SettingsState = {
  selectedNpc: string
  setSelectedNpc: (npc: string) => void
  enableTypingSound: boolean
  setEnableTypingSound: (enabled: boolean) => void
  conversationHistory: Record<string, ChatMessage[]>
  addMessage: (npc: string, message: ChatMessage) => void
  clearConversation: (npc: string) => void
  isAuthenticated: boolean
  setIsAuthenticated: (authenticated: boolean) => void
}

export const useSettings = create<SettingsState>((set) => ({
  selectedNpc: 'npc_1',
  setSelectedNpc: (npc) => set({ selectedNpc: npc }),
  enableTypingSound: true,
  setEnableTypingSound: (enabled) => set({ enableTypingSound: enabled }),
  conversationHistory: {},
  addMessage: (npc, message) =>
    set((state) => ({
      conversationHistory: {
        ...state.conversationHistory,
        [npc]: [...(state.conversationHistory[npc] || []), message],
      },
    })),
  clearConversation: (npc) =>
    set((state) => ({
      conversationHistory: {
        ...state.conversationHistory,
        [npc]: [],
      },
    })),
  isAuthenticated: false,
  setIsAuthenticated: (authenticated) =>
    set({ isAuthenticated: authenticated }),
}))
