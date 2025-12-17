type DialogueBoxProps = {
  displayedText: string
  isTyping: boolean
}

export const DialogueBox = ({ displayedText, isTyping }: DialogueBoxProps) => (
  <div className='arrow-down absolute bottom-42 left-8 w-70 rounded-xl border border-white bg-black p-4 text-white'>
    <p className='dialogue select-none font-mono text-xl leading-5 tracking-wide'>
      {displayedText}
      {Boolean(isTyping) && <span className='animate-pulse'>|</span>}
    </p>
  </div>
)
