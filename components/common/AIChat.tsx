/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactNode, useContext, useEffect, useRef, useState } from 'react'

import { useActions, useUIState } from 'ai/rsc'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { LuArrowUp } from 'react-icons/lu'
import { RiUnpinLine } from 'react-icons/ri'
import { RxCross1 } from 'react-icons/rx'
import { v4 as uuidv4 } from 'uuid'

import { Button, ScrollShadow } from '@nextui-org/react'

import { ClientMessage } from '@/app/action'
import { EventContext } from '@/contexts/EventContext'
import { useEnrollment } from '@/hooks/useEnrollment'
import { useEvent } from '@/hooks/useEvent'
import { useProfile } from '@/hooks/useProfile'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function AIChat({ onClose }: { onClose: () => void }) {
  const eventId = useParams().eventId as string
  const { event, meeting } = useEvent({ id: eventId })
  const { enrollment } = useEnrollment({ eventId })
  const [input, setInput] = useState<string>('')
  const [conversation, setConversation] = useUIState()
  const { continueConversation } = useActions()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastMessagePlaceholderRef = useRef<HTMLDivElement>(null)
  const { data: userProfile } = useProfile()
  const { currentFrame, currentSectionId, sections } = useContext(
    EventContext
  ) as EventContextType

  useEffect(() => {
    if (lastMessagePlaceholderRef.current) {
      lastMessagePlaceholderRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [conversation])

  const handleGeneratePoll = async () => {
    let content = currentFrame?.content?.blocks
      ?.reduce((acc, block) => {
        if ('html' in block.data) {
          return `${acc}${block.data.html}.`
        }

        return acc
      }, '')
      .trim()
    if (!content || content.length < 10) {
      content = `${event.name}, ${event.description}`
    }
    const topic = `"${content}"`
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: uuidv4(), role: 'user', display: 'Generate Poll for me' },
      {
        id: uuidv4(),
        role: 'assistant',
        display: 'Generating Poll. Please wait!!',
      },
    ])
    const message = await generatePoll(topic)
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: uuidv4(), role: 'assistant', display: message },
    ])
  }

  async function generatePoll(topic: string): Promise<any> {
    try {
      // We need section id to put the poll in
      const sectionId =
        currentSectionId ||
        currentFrame?.section_id ||
        (sections?.at(-1)?.id as string)

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/generations/generate-poll`

      await axios.post(url, null, {
        params: {
          topic,
          section_id: sectionId,
        },
      })

      return 'Created a poll!! Want to create more? Go ahead and tell me'
    } catch (error) {
      console.error('Error generating poll:', error)

      return 'Some error occurred while creating the poll. Please try again later.'
    }
  }

  const handleSummarizeSection = async () => {
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: uuidv4(), role: 'user', display: 'Summarize current section' },
      {
        id: uuidv4(),
        role: 'assistant',
        display: 'Creating a summary frame. Please wait!!',
      },
    ])
    const sectionId = currentSectionId ?? sections[0].id
    const message = await summarizeSection(sectionId, meeting.id)
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: uuidv4(), role: 'assistant', display: message },
    ])
  }

  async function summarizeSection(
    sectionId: string,
    meetingId: string
  ): Promise<any> {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/generations/summarize-section`

      await axios.post(url, null, {
        params: {
          section_id: sectionId,
          meeting_id: meetingId,
        },
      })

      return 'Created summary frame!! Want to create more? Go ahead and tell me'
    } catch (error) {
      console.error('Error creating frame:', error)

      return 'Some error occurred while creating the frame. Please try again later.'
    }
  }

  const handleSubmit = async (topic: string = input, _input = input) => {
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: uuidv4(), role: 'user', display: _input },
    ])

    const message = await continueConversation(topic)

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      message,
    ])

    setInput('')
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function autosize(e: any) {
    const el = e.target

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
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
      contentClass="relative flex flex-col w-full h-[calc(100%_-_48px)]"
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
      <div className="flex-none flex justify-start items-end">
        {/* TODO: use roles from enum */}
        {enrollment &&
          ['Host', 'Moderator'].includes(enrollment.event_role) && (
            <div>
              <Button
                variant="bordered"
                color="primary"
                onClick={handleGeneratePoll}>
                Generate Poll
              </Button>
              <Button
                variant="bordered"
                color="primary"
                onClick={handleSummarizeSection}>
                Summarize section
              </Button>
            </div>
          )}
      </div>
      <div className="flex-none flex justify-start items-end p-1 border-2 border-gray-300 bg-white m-1 rounded-md">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onKeyDown={autosize}
          placeholder={`Hey ${userProfile?.first_name}! how can I help?`}
          className="overflow-hidden w-[calc(100%_-_4rem)] p-2 block text-sm resize-none bg-transparent border-none focus:outline-none flex-auto"
          onChange={(e) => {
            setInput(e.target.value)
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
          onClick={() => handleSubmit()}>
          <LuArrowUp />
        </button>
      </div>
    </AiChatSidebarWrapper>
  )
}

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
    <div className={cn('w-full h-full')}>
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
