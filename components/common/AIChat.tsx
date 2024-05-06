/* eslint-disable jsx-a11y/control-has-associated-label */

'use client'

import { useChat } from 'ai/react'
import { FiSend } from 'react-icons/fi'

import { ScrollShadow, Textarea, Button } from '@nextui-org/react'

import { cn } from '@/utils/utils'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AiChatSidebarWrapper({ contentClass, children }: any) {
  return (
    <div
      className={cn(
        'w-full bg-white/95 h-full transition-all border-l bg-white'
      )}>
      <div className="flex items-center justify-between font-semibold w-full bg-slate-100 py-2 px-4">
        <p className="text-xs">AI Chat</p>
        {/* <IconX
          onClick={() => setSettingsSidebarVisible(false)}
          className="cursor-pointer"
        /> */}
      </div>
      <div className={cn(contentClass)}>{children}</div>
    </div>
  )
}
export function AIChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <AiChatSidebarWrapper contentClass="flex flex-col w-full h-full">
      <ScrollShadow
        hideScrollBar
        isEnabled
        orientation="vertical"
        className="w-full h-[calc(100vh_-_146px)] p-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap p-4 rounded-lg shadow ${
              m.role === 'user'
                ? 'bg-blue-100 text-blue-800 text-right self-end'
                : 'bg-gray-100 text-gray-800 text-left self-start'
            }`}>
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}
      </ScrollShadow>
      <div className="flex-none sticky bottom-0 left-0 w-full">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <Button
            isIconOnly
            radius="full"
            type="submit"
            className="absolute bottom-1 right-1 bg-gray-800 text-white hover:bg-black  transition-all duration-400">
            <FiSend />
          </Button>
        </form>
      </div>
    </AiChatSidebarWrapper>
  )
}
