import styles from '../styles/dialogue.module.css'
import { cn } from '../utils/lib'

type DialogueBoxProps = {
  displayedText: string
  isTyping: boolean
}

export const DialogueBox = ({ displayedText, isTyping }: DialogueBoxProps) => (
  <div className={cn('relative w-100 border border-white bg-black p-4 text-white', styles.container)}>
    <p className='font-mono text-sm leading-relaxed'>
      {displayedText}
      {Boolean(isTyping) && <span className='animate-pulse'>|</span>}
    </p>
  </div>
)
