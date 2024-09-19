/* eslint-disable jsx-a11y/control-has-associated-label */
import { ReactNode, useContext, useEffect, useRef, useState } from 'react'

import { Button, ScrollShadow } from '@nextui-org/react'
import { useParams } from '@tanstack/react-router'
import axios from 'axios'
import { BsTrash3 } from 'react-icons/bs'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { HiOutlineChartBarSquare } from 'react-icons/hi2'
import { LuArrowUp } from 'react-icons/lu'
import { RxCross1 } from 'react-icons/rx'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import { Converstations } from './AiChat/Converstations'
import { RenderIf } from './RenderIf/RenderIf'

import { EventContext } from '@/contexts/EventContext'
import { useEvent } from '@/hooks/useEvent'
import { useProfile } from '@/hooks/useProfile'
import { useStoreSelector } from '@/hooks/useRedux'
import {
  addMessageInBulkAction,
  setInputAction,
  setMessagesAction,
  updateMessageAction,
} from '@/stores/slices/ai/ai.slice'
import { RootState } from '@/stores/store'
import { fetchChatThunk } from '@/stores/thunks/ai.thunk'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function AIChat({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch()
  const { messages, input } = useStoreSelector(
    (state: RootState) => state.ai.chat
  )

  const { eventId } = useParams({ strict: false })
  const { event, meeting } = useEvent({ id: eventId! })
  const [inputVal, setInputVal] = useState<string>('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastMessagePlaceholderRef = useRef<HTMLDivElement>(null)
  const { data: userProfile } = useProfile()
  const { currentFrame, currentSectionId, sections, overviewOpen } = useContext(
    EventContext
  ) as EventContextType

  const sectionId =
    currentSectionId || currentFrame?.section_id || sections[0].id

  useEffect(() => {
    if (lastMessagePlaceholderRef.current) {
      lastMessagePlaceholderRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

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
    const processingMessageId = uuidv4()
    dispatch(
      addMessageInBulkAction([
        { id: uuidv4(), role: 'user', content: 'Generate Poll for me' },
        {
          id: processingMessageId,
          role: 'assistant',
          content: 'Generating Poll. Please wait...',
          status: 'processing',
        },
      ])
    )

    const message = await generatePoll(topic)
    if (message) {
      dispatch(
        updateMessageAction({
          id: processingMessageId,
          content: message,
          status: 'processed',
          role: 'assistant',
        })
      )
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function generatePoll(topic: string): Promise<any> {
    try {
      // We need section id to put the poll in

      const url = `${import.meta.env.VITE_API_BASE_URL}/generations/generate-poll`

      await axios.post(url, null, {
        params: {
          topic,
          current_frame_id: currentFrame?.id ?? '',
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
    const processingMessageId = uuidv4()
    dispatch(
      addMessageInBulkAction([
        { id: uuidv4(), role: 'user', content: 'Summarize current section' },
        {
          id: processingMessageId,
          role: 'assistant',
          content: 'Creating a summary frame. Please wait...',
          status: 'processing',
        },
      ])
    )

    const message = await summarizeSection(meeting.id)

    dispatch(
      updateMessageAction({
        id: processingMessageId,
        content: message,
        status: 'processed',
        role: 'assistant',
      })
    )
  }

  async function summarizeSection(
    meetingId: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/generations/summarize-section`

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

  const handleSend = async () => {
    dispatch(
      addMessageInBulkAction([
        { id: uuidv4(), role: 'user', content: inputVal },
      ])
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(fetchChatThunk(inputVal) as any)
    dispatch(setInputAction(''))
    setInputVal('')
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function autosize(e: any) {
    const el = e.target

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()

      return
    }

    setTimeout(() => {
      el.style.cssText = 'height:auto;'
      el.style.cssText = `height:${el.scrollHeight}px`
    }, 0)
  }

  const formHeight = textareaRef.current?.style.height

  const getAIContent = () => {
    if (messages.length === 0) {
      return (
        <div className="w-full h-full grid place-items-center">
          <div className="grid place-items-center gap-8">
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[80px] h-[80px] text-gray-100">
              <path
                d="M13.088 6.41145C12.7435 5.96674 12.2747 5.63435 11.741 5.45645L10.363 5.00845C10.2572 4.97079 10.1657 4.90132 10.1009 4.80956C10.0362 4.7178 10.0014 4.60825 10.0014 4.49595C10.0014 4.38366 10.0362 4.27411 10.1009 4.18235C10.1657 4.09059 10.2572 4.02111 10.363 3.98345L11.741 3.53545C12.1488 3.39464 12.5191 3.16278 12.8239 2.85748C13.1287 2.55218 13.3599 2.18146 13.5 1.77345L13.511 1.73945L13.959 0.362454C13.9962 0.255967 14.0657 0.163693 14.1577 0.0984058C14.2497 0.0331183 14.3597 -0.00195312 14.4725 -0.00195312C14.5853 -0.00195312 14.6953 0.0331183 14.7873 0.0984058C14.8793 0.163693 14.9488 0.255967 14.986 0.362454L15.433 1.73945C15.5727 2.158 15.8081 2.53822 16.1203 2.84997C16.4326 3.16172 16.8132 3.39642 17.232 3.53545L18.609 3.98345L18.637 3.99045C18.7428 4.02811 18.8343 4.09759 18.8991 4.18935C18.9638 4.28111 18.9986 4.39066 18.9986 4.50295C18.9986 4.61525 18.9638 4.7248 18.8991 4.81656C18.8343 4.90832 18.7428 4.97779 18.637 5.01545L17.259 5.46345C16.8404 5.60262 16.46 5.83738 16.1479 6.14912C15.8358 6.46086 15.6006 6.84102 15.461 7.25945L15.013 8.63645L15 8.67045C14.9568 8.77108 14.8842 8.85632 14.7918 8.91503C14.6993 8.97374 14.5913 9.00318 14.4819 8.99951C14.3724 8.99584 14.2666 8.95922 14.1784 8.89444C14.0901 8.82966 14.0234 8.73975 13.987 8.63645L13.539 7.25945C13.4389 6.95299 13.2867 6.66611 13.089 6.41145M20.784 10.2125L20.018 9.96445C19.7856 9.88675 19.5744 9.75603 19.4012 9.58265C19.228 9.40926 19.0975 9.19796 19.02 8.96545L18.77 8.20145C18.7493 8.14238 18.7107 8.09121 18.6597 8.055C18.6086 8.0188 18.5476 7.99935 18.485 7.99935C18.4224 7.99935 18.3614 8.0188 18.3103 8.055C18.2592 8.09121 18.2207 8.14238 18.2 8.20145L17.952 8.96545C17.8759 9.19647 17.7476 9.40682 17.5769 9.58009C17.4062 9.75337 17.1978 9.88491 16.968 9.96445L16.203 10.2125C16.1439 10.2332 16.0928 10.2717 16.0565 10.3228C16.0203 10.3738 16.0009 10.4349 16.0009 10.4975C16.0009 10.56 16.0203 10.6211 16.0565 10.6721C16.0928 10.7232 16.1439 10.7617 16.203 10.7825L16.968 11.0315C17.2011 11.1092 17.4129 11.2402 17.5865 11.4142C17.7601 11.5881 17.8907 11.8002 17.968 12.0335L18.216 12.7975C18.2367 12.8565 18.2753 12.9077 18.3263 12.9439C18.3774 12.9801 18.4384 12.9996 18.501 12.9996C18.5636 12.9996 18.6246 12.9801 18.6757 12.9439C18.7268 12.9077 18.7653 12.8565 18.786 12.7975L19.035 12.0335C19.1126 11.8008 19.2432 11.5895 19.4166 11.4161C19.59 11.2427 19.8014 11.112 20.034 11.0345L20.799 10.7865C20.8581 10.7657 20.9092 10.7272 20.9454 10.6761C20.9817 10.6251 21.0011 10.564 21.0011 10.5015C21.0011 10.4389 20.9817 10.3778 20.9454 10.3268C20.9092 10.2757 20.8581 10.2372 20.799 10.2165L20.784 10.2125ZM2.25 2.99945H10.047C9.74083 3.10937 9.47399 3.30733 9.28 3.56845C9.09236 3.84223 8.99451 4.16759 9 4.49945H2.25C2.05109 4.49945 1.86032 4.57847 1.71967 4.71912C1.57902 4.85978 1.5 5.05054 1.5 5.24945V17.7495C1.5 18.7155 2.284 19.4995 3.25 19.4995H12.5V7.32645C12.5347 7.39845 12.5647 7.47245 12.59 7.54845L13 8.99845C13.106 9.30845 13.305 9.57745 13.57 9.76845C13.7033 9.86045 13.8467 9.93045 14 9.97845V13.9995H18V17.7495C18 18.6114 17.6576 19.4381 17.0481 20.0476C16.4386 20.657 15.612 20.9995 14.75 20.9995H3.25C2.38805 20.9995 1.5614 20.657 0.951903 20.0476C0.34241 19.4381 0 18.6114 0 17.7495V5.24945C0 4.65272 0.237053 4.08042 0.65901 3.65846C1.08097 3.23651 1.65326 2.99945 2.25 2.99945ZM14 19.4995H14.75C15.2141 19.4995 15.6592 19.3151 15.9874 18.9869C16.3156 18.6587 16.5 18.2136 16.5 17.7495V15.4995H14V19.4995ZM4.25 6.99945C4.05109 6.99945 3.86032 7.07847 3.71967 7.21912C3.57902 7.35978 3.5 7.55054 3.5 7.74945C3.5 7.94837 3.57902 8.13913 3.71967 8.27978C3.86032 8.42044 4.05109 8.49945 4.25 8.49945H9.75C9.94891 8.49945 10.1397 8.42044 10.2803 8.27978C10.421 8.13913 10.5 7.94837 10.5 7.74945C10.5 7.55054 10.421 7.35978 10.2803 7.21912C10.1397 7.07847 9.94891 6.99945 9.75 6.99945H4.25ZM3.5 11.7495C3.5 11.5505 3.57902 11.3598 3.71967 11.2191C3.86032 11.0785 4.05109 10.9995 4.25 10.9995H9.75C9.94891 10.9995 10.1397 11.0785 10.2803 11.2191C10.421 11.3598 10.5 11.5505 10.5 11.7495C10.5 11.9484 10.421 12.1391 10.2803 12.2798C10.1397 12.4204 9.94891 12.4995 9.75 12.4995H4.25C4.05109 12.4995 3.86032 12.4204 3.71967 12.2798C3.57902 12.1391 3.5 11.9484 3.5 11.7495ZM4.25 14.9995C4.05109 14.9995 3.86032 15.0785 3.71967 15.2191C3.57902 15.3598 3.5 15.5505 3.5 15.7495C3.5 15.9484 3.57902 16.1391 3.71967 16.2798C3.86032 16.4204 4.05109 16.4995 4.25 16.4995H7.25C7.44891 16.4995 7.63968 16.4204 7.78033 16.2798C7.92098 16.1391 8 15.9484 8 15.7495C8 15.5505 7.92098 15.3598 7.78033 15.2191C7.63968 15.0785 7.44891 14.9995 7.25 14.9995H4.25Z"
                fill="#B592F1"
              />
            </svg>

            <div className="text-center">
              <p className="text-base font-semibold tracking-tight">
                Optimize Your Presentation with AI
              </p>
              <p className="text-sm text-black/70 text-center px-10 mt-2">
                Leverage AI to refine and perfect your slide content. Ask
                questions and get real-time suggestions to make your
                presentations shine.
              </p>
            </div>
            <div className="grid gap-3">
              <Button
                variant="bordered"
                className="justify-start h-[2.0625rem] px-2 text-black/80 border-1 border-primary-400 bg-primary-100"
                onClick={handleGeneratePoll}
                startContent={
                  <HiOutlineChartBarSquare className="text-[1.5rem] shrink-0" />
                }>
                Generate{' '}
                {overviewOpen ? 'a poll in 1st section' : 'interactive poll'}
              </Button>
              <Button
                variant="bordered"
                className="justify-start h-[2.0625rem] px-2 text-black/80 border-1 border-primary-400 bg-primary-100"
                onClick={handleSummarizeSection}
                startContent={
                  <HiOutlineDocumentText className="text-[1.5rem] shrink-0" />
                }>
                Summarize {overviewOpen ? '1st' : ''} section
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return <Converstations />
  }

  return (
    <AiChatSidebarWrapper
      contentClass="relative flex flex-col w-full h-[calc(100%_-_75px)]"
      onClose={onClose}>
      <ScrollShadow
        hideScrollBar
        isEnabled
        orientation="vertical"
        className="w-full p-1 flex-auto"
        style={{
          height: `calc(100% - ${formHeight})`,
        }}>
        {getAIContent()}

        <div ref={lastMessagePlaceholderRef} />
      </ScrollShadow>
      <div className="flex-none flex justify-start items-end">
        {/* TODO: use roles from enum */}
      </div>
      <div className="p-1 border-1 border-gray-300 bg-white rounded-md mx-4 mb-2">
        <RenderIf isTrue={messages.length > 0}>
          <div className="flex items-center gap-2 p-2">
            <Button
              variant="bordered"
              className="justify-start text-xs  h-[2.0625rem] px-2 border-1 border-primary-400"
              onClick={handleGeneratePoll}
              startContent={
                <HiOutlineChartBarSquare className="text-[1.5rem] shrink-0" />
              }>
              Generate{' '}
              {overviewOpen ? 'poll in 1st section' : 'interactive poll'}
            </Button>
            <Button
              variant="bordered"
              className="justify-start text-xs h-[2.0625rem] px-2 border-1 border-primary-400"
              onClick={handleSummarizeSection}
              startContent={
                <HiOutlineDocumentText className="text-[1.5rem] shrink-0" />
              }>
              Summarize {overviewOpen ? '1st' : ''} section
            </Button>
          </div>
        </RenderIf>

        <div className="flex-none flex justify-start items-center">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputVal}
            onKeyDown={autosize}
            placeholder={`Hey ${userProfile?.first_name}! how can I help?`}
            className="overflow-hidden w-[calc(100%_-_4rem)] p-2 block text-sm resize-none bg-transparent border-none focus:outline-none flex-auto"
            onChange={(e) => {
              setInputVal(e.target.value)
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
            onClick={handleSend}>
            <LuArrowUp />
          </button>
        </div>
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
  const dispatch = useDispatch()

  return (
    <div className={cn('w-full h-full')}>
      <div className="flex items-center justify-between w-full p-4">
        <h3 className="text-lg font-semibold text-center tracking-tight">
          Moraa Assist
        </h3>
        <div>
          <Button
            variant="light"
            isIconOnly
            onClick={() => dispatch(setMessagesAction([]))}>
            <BsTrash3 size={18} />
          </Button>
          <Button variant="light" isIconOnly onClick={onClose}>
            <RxCross1 size={18} />
          </Button>
        </div>
      </div>
      <div className={cn(contentClass)}>{children}</div>
    </div>
  )
}
