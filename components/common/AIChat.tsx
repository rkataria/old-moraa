/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { ReactNode, useContext, useEffect, useRef, useState } from 'react'

import { useActions, useUIState } from 'ai/rsc'
import { LuArrowUp } from 'react-icons/lu'
import { RiUnpinLine } from 'react-icons/ri'
import { RxCross1 } from 'react-icons/rx'
import { v4 as uuidv4 } from 'uuid'

import { Button, ScrollShadow } from '@nextui-org/react'

import { ClientMessage } from '@/app/action'
import { EventContext } from '@/contexts/EventContext'
import { useProfile } from '@/hooks/useProfile'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function AIChat({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState<string>('')
  const [conversation, setConversation] = useUIState()
  const { continueConversation } = useActions()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastMessagePlaceholderRef = useRef<HTMLDivElement>(null)
  const { data: userProfile } = useProfile()
  const { currentSlide } = useContext(EventContext) as EventContextType

  useEffect(() => {
    if (lastMessagePlaceholderRef.current) {
      lastMessagePlaceholderRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [conversation])

  const handleSubmit = async () => {
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: uuidv4(), role: 'user', display: input },
    ])

    const message = await continueConversation(input, currentSlide?.section_id)

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      message,
    ])

    setInput('')
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function autosize(event: any) {
    const el = event.target

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()

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
        {conversation.map((message: any) => (
          <div
            key={message.id}
            className={`text-sm mb-1 whitespace-pre-wrap p-4 rounded-md ${
              message.role === 'user'
                ? 'bg-primary/20 text-right self-end'
                : 'bg-gray-100 text-gray-800 text-left self-start'
            }`}>
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.display}
          </div>
        ))}
        <div ref={lastMessagePlaceholderRef} />
      </ScrollShadow>

      <div className="flex-none flex justify-start items-end p-1 border-2 border-gray-300 bg-white m-1 rounded-md">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onKeyDown={autosize}
          placeholder={`Hey ${userProfile?.first_name}! how can I help?`}
          className="overflow-hidden w-[calc(100%_-_4rem)] p-2 block text-sm resize-none bg-transparent border-none focus:outline-none flex-auto"
          onChange={(event) => {
            setInput(event.target.value)
          }}
        />
        <button
          type="button"
          className={cn(
            'flex-none p-2.5 flex justify-center items-center transition-all rounded-md',
            {
              'bg-gray-100 text-black': !input,
              'bg-black text-white': input,
            }
          )}
          onClick={handleSubmit}>
          <LuArrowUp />
        </button>
      </div>
    </AiChatSidebarWrapper>
  )
}

// /* eslint-disable jsx-a11y/control-has-associated-label */

// import { ReactNode, useEffect, useRef } from 'react'

// import { IconX } from '@tabler/icons-react'
// import { useChat } from 'ai/react'
// import { LuArrowUp } from 'react-icons/lu'

// import { ScrollShadow } from '@nextui-org/react'

// import { useProfile } from '@/hooks/useProfile'
// import { cn } from '@/utils/utils'
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className={cn('w-full h-full transition-all border-l bg-[#f5f5f5]')}>
      <div className="flex items-center justify-between w-full p-2">
        <Button variant="light" isIconOnly size="sm" onClick={onClose}>
          <RxCross1 size={18} />
        </Button>
        <h3 className="text-sm font-medium text-center">AI Copilot</h3>
        <Button
          variant="light"
          isIconOnly
          size="sm"
          disabled
          className="opacity-0 pointer-events-none">
          <RiUnpinLine size={24} />
        </Button>
      </div>
      <div className={cn(contentClass)}>{children}</div>
    </div>
  )
}
