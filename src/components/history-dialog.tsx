import type { ChatMessage } from '@heyputer/puter.js'
import { NotesMultiple as HistoryIcon } from '@nsmr/pixelart-react'
import { npcPersonalities } from '../utils/npcs'
import { Button } from './ui'
import { Dialog } from './ui/dialog'

type HistoryDialogProps = {
  currentHistory: ChatMessage[]
  selectedNpc: string
}

export const HistoryDialog = ({
  currentHistory,
  selectedNpc,
}: HistoryDialogProps) => (
  <Dialog>
    <Dialog.Trigger asChild>
      <Button size='icon' variant='outline'>
        <HistoryIcon />
      </Button>
    </Dialog.Trigger>
    <Dialog.Content className='max-h-[80vh]' size='2xl'>
      <Dialog.Header className='font-head'>
        <div className='font-bold text-xl'>Conversation History</div>
        <Dialog.Description>
          Your chat history with{' '}
          {npcPersonalities[selectedNpc]?.name || selectedNpc}
        </Dialog.Description>
      </Dialog.Header>
      <div className='max-h-[60vh] overflow-y-auto'>
        <div className='space-y-4'>
          {currentHistory.length === 0 ? (
            <p className='text-center text-gray-500'>
              No messages yet. Start a conversation!
            </p>
          ) : (
            currentHistory.map((msg, index) => (
              <div
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                key={index}>
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-white'
                  }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Dialog.Content>
  </Dialog>
)
