import { motion } from 'framer-motion'
import * as marked from 'marked'

import { useStoreSelector } from '@/hooks/useRedux'
import { cn } from '@/utils/utils'

export function Converstations() {
  const { messages, loading } = useStoreSelector((state) => state.ai.chat)

  const createMarkup = (content: string) => ({ __html: marked.marked(content) })

  const renderLoading = () => {
    if (!loading) return null

    return (
      <div className="relative flex items-center gap-1">
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 10 }}
          transition={{
            duration: 2,
            type: 'spring',
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'loop',
            delay: 0,
          }}
          className="h-[.625rem] w-[.625rem] rounded-full bg-indigo-700"
        />
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 10 }}
          transition={{
            duration: 2,
            type: 'spring',
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
            delay: 0.1,
          }}
          className="h-[.625rem] w-[.625rem] rounded-full bg-indigo-700"
        />

        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 10 }}
          transition={{
            duration: 2,
            type: 'spring',
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'loop',
            delay: 0.2,
          }}
          className="h-[.625rem] w-[.625rem] rounded-full bg-indigo-700"
        />
      </div>
    )
  }

  return (
    <div className="grid gap-2 px-4 pb-20">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {messages.map((message: any) => (
        <div
          key={message.id}
          className={cn(
            'relative before:absolute before:bottom-0 before:w-0 before:h-0 before:border-b-[10px] before:border-x-[10px] before:border-x-transparent before:border-solid',
            {
              'flex justify-end before:border-b-gray-200 before:bottom-0 before:-right-[9px]':
                message.role === 'user',
              'before:border-b-gray-100 before:bottom-0 before:-left-[9px]':
                message.role !== 'user',
            }
          )}>
          <div
            className={cn('text-sm px-4 py-3 rounded-md tracking-tight', {
              'text-right self-end  bg-gray-200': message.role === 'user',
              'bg-gray-100 text-gray-800 text-left self-start':
                message.role !== 'user',
            })}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={createMarkup(message.content)}
          />
        </div>
      ))}
      {renderLoading()}
    </div>
  )
}
