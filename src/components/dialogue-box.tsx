import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

type DialogueBoxProps = {
  displayedText: string
  isTyping: boolean
}

export const DialogueBox = ({ displayedText }: DialogueBoxProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [displayedText])

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className='arrow-down absolute bottom-46 left-8 max-h-[200px] w-80 border'
      initial={{ opacity: 0, y: 50 }}>
      <div
        className='sidebar-scroll max-h-[calc(200px-32px)] overflow-y-auto px-4 py-3 pr-3'
        ref={scrollRef}>
        <div className='select-none text-xl leading-5 tracking-wide'>
          <ReactMarkdown
            components={{
              hr: ({ node, ...props }) => <hr className='my-3' {...props} />,
              code: ({ node, ...props }) => (
                <code
                  className='my-2 overflow-x-auto bg-slate-100 p-2 font-head text-xs'
                  {...props}
                />
              ),
              pre: ({ node, ...props }) => (
                <pre
                  className='my-2 overflow-x-auto bg-slate-100 p-2 font-head text-xs'
                  {...props}
                />
              ),
            }}>
            {displayedText}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  )
}
