type DialogueBoxProps = {
  displayedText: string
  isTyping: boolean
}

export const DialogueBox = ({ displayedText, isTyping }: DialogueBoxProps) => (
  <div className='arrow-down absolute bottom-46 left-8 w-70 rounded-xl border p-4'>
    <p className='select-none text-xl leading-5 tracking-wide'>
      {displayedText}
      {Boolean(isTyping) && <span className='animate-pulse'>|</span>}
    </p>
  </div>
)
