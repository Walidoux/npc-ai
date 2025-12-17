import { create } from 'zustand'

type SettingsState = {
  selectedNpc: string
  setSelectedNpc: (npc: string) => void
  enableTypingSound: boolean
  setEnableTypingSound: (enabled: boolean) => void
}

export const useSettings = create<SettingsState>((set) => ({
  selectedNpc: 'npc_1',
  setSelectedNpc: (npc) => set({ selectedNpc: npc }),
  enableTypingSound: true,
  setEnableTypingSound: (enabled) => set({ enableTypingSound: enabled }),
}))
