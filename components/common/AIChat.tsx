'use client'

import { useChat } from 'ai/react'

import { Button, ScrollShadow, Textarea } from '@nextui-org/react'

export function AIChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <>
      {/* <Button isIconOnly onClick={() => setOpen(true)}>
        <Sparkles />
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Participants"
        description="Add participants to the event"> */}
      <div className="flex flex-col w-full h-screen max-w-md py-24 mx-auto stretch space-y-2 border-2 border-gray-300 right-0 top-0">
        <ScrollShadow
          hideScrollBar
          isEnabled
          orientation="vertical"
          className="w-full max-h-full">
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

        <form
          onSubmit={handleSubmit}
          className="flex items-end align-bottom h-full">
          <Textarea
            // className="flex-grow p-2 border border-gray-300 rounded shadow-xl text-black"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <Button type="submit" className="">
            Send
          </Button>
        </form>
      </div>
      {/* </Modal> */}
    </>
  )
}
