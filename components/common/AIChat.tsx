/* eslint-disable jsx-a11y/control-has-associated-label */

import { ReactNode, useEffect, useRef } from 'react'

import { IconX } from '@tabler/icons-react'
import { useChat } from 'ai/react'
import { LuArrowUp } from 'react-icons/lu'

import { ScrollShadow } from '@nextui-org/react'

import { useProfile } from '@/hooks/useProfile'
import { cn } from '@/utils/utils'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AiChatSidebarWrapper({
  contentClass,
  children,
  onClose,
}: {
  contentClass: string
  children: ReactNode
  onClose: () => void
}) {
  return (
    <div
      className={cn(
        'w-full bg-white/95 h-full transition-all border-l bg-white'
      )}>
      <div className="flex items-center justify-between font-semibold w-full bg-slate-100 py-2 px-4">
        <p className="text-sm">AI Copilot</p>
        <IconX onClick={onClose} className="cursor-pointer" />
      </div>
      <div className={cn(contentClass)}>{children}</div>
    </div>
  )
}
export function AIChat({ onClose }: { onClose: () => void }) {
  const { data: userProfile } = useProfile()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastMessagePlaceholderRef = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  useEffect(() => {
    if (lastMessagePlaceholderRef.current) {
      lastMessagePlaceholderRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function autosize(event: any) {
    const el = event.target

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(event)

      return
    }

    setTimeout(() => {
      el.style.cssText = 'height:auto;'
      el.style.cssText = `height:${el.scrollHeight}px`
    }, 0)
  }

  const formHeight = textareaRef.current?.style.height

  return (
    <AiChatSidebarWrapper
      contentClass="relative flex flex-col w-full h-[calc(100%_-_40px)]"
      onClose={onClose}>
      <ScrollShadow
        hideScrollBar
        isEnabled
        orientation="vertical"
        className="w-full p-1 flex-auto"
        style={{
          height: `calc(100% - ${formHeight})`,
        }}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`text-sm mb-1 whitespace-pre-wrap p-4 rounded-md ${
              m.role === 'user'
                ? 'bg-primary/20 text-right self-end'
                : 'bg-gray-100 text-gray-800 text-left self-start'
            }`}>
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}
        <div ref={lastMessagePlaceholderRef} />
      </ScrollShadow>
      <form
        onSubmit={handleSubmit}
        className="flex-none flex justify-start items-end p-1 border-2 border-gray-300 bg-white m-1 rounded-md">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onKeyDown={autosize}
          placeholder={`Hey ${userProfile?.first_name}! how can I help?`}
          className="overflow-hidden w-[calc(100%_-_4rem)] p-2 block text-sm resize-none bg-transparent border-none focus:outline-none flex-auto"
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className={cn(
            'flex-none p-2.5 flex justify-center items-center transition-all rounded-md',
            {
              'bg-gray-100 text-black': !input,
              'bg-black text-white': input,
            }
          )}>
          <LuArrowUp />
        </button>
      </form>
    </AiChatSidebarWrapper>
  )
}
