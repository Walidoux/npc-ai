import type { ChatMessage } from '@heyputer/puter.js'
import { create } from 'zustand'

type SettingsState = {
  selectedNpc: string
  setSelectedNpc: (npc: string) => void
  selectedMusic: string
  setSelectedMusic: (music: string) => void
  enableTypingSound: boolean
  setEnableTypingSound: (enabled: boolean) => void
  typingSoundVolume: number
  setTypingSoundVolume: (volume: number) => void
  enableBackgroundMusic: boolean
  setEnableBackgroundMusic: (enabled: boolean) => void
  backgroundMusicVolume: number
  setBackgroundMusicVolume: (volume: number) => void
  conversationHistory: Record<string, ChatMessage[]>
  addMessage: (npc: string, message: ChatMessage) => void
  clearConversation: (npc: string) => void
  isAuthenticated: boolean
  setIsAuthenticated: (authenticated: boolean) => void
}

export const useSettings = create<SettingsState>((set) => ({
  selectedNpc: 'npc_1',
  setSelectedNpc: (npc) => set({ selectedNpc: npc }),
  selectedMusic: 'music_1',
  setSelectedMusic: (music) => set({ selectedMusic: music }),
  enableTypingSound: true,
  setEnableTypingSound: (enabled) => set({ enableTypingSound: enabled }),
  typingSoundVolume: 0.5,
  setTypingSoundVolume: (volume) => set({ typingSoundVolume: volume }),
  enableBackgroundMusic: true,
  setEnableBackgroundMusic: (enabled) =>
    set({ enableBackgroundMusic: enabled }),
  backgroundMusicVolume: 0.5,
  setBackgroundMusicVolume: (volume) => set({ backgroundMusicVolume: volume }),
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
