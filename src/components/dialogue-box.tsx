type DialogueBoxProps = {
  displayedText: string
  isTyping: boolean
}

export const DialogueBox = ({ displayedText, isTyping }: DialogueBoxProps) => (
  <div className='arrow-down absolute bottom-46 left-8 max-h-[200px] w-80 border'>
    <div className='sidebar-scroll h-[calc(200px-24px)] overflow-y-auto px-4 py-2 pr-3 text-justify'>
      <p className='select-none text-xl leading-5 tracking-wide'>
        {displayedText}
        {Boolean(isTyping) && <span className='animate-pulse'>|</span>}
      </p>
    </div>
  </div>
)
