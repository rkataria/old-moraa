import { useEffect, useState } from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { Badge } from '@nextui-org/react'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoChatbubblesOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

export function ChatsToggle({
  isChatsSidebarOpen,
  onClick,
}: {
  isChatsSidebarOpen: boolean
  onClick: () => void
}) {
  const { meeting } = useDyteMeeting()
  const selfParticipant = useDyteSelector((m) => m.self)
  const [newMessageReceived, setNewMessageReceived] = useState<boolean>(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meeting.chat.on('chatUpdate', ({ message }: { message: any }) => {
      if (message.userId === selfParticipant.userId) return
      setNewMessageReceived(true)
    })
  }, [meeting, selfParticipant.userId])

  const handleChat = () => {
    setNewMessageReceived(false)
    onClick()
  }

  useHotkeys('c', handleChat)

  return (
    <Badge
      content=""
      color="danger"
      size="sm"
      isDot
      isInvisible={!newMessageReceived}>
      <ControlButton
        buttonProps={{
          isIconOnly: true,
          radius: 'md',
          size: 'sm',
          variant: 'light',
          className: cn('transition-all duration-300 text-[#444444]', {
            'bg-black text-white hover:bg-black': isChatsSidebarOpen,
          }),
        }}
        tooltipProps={{
          content: isChatsSidebarOpen ? 'Hide Chats' : 'Show Chats',
        }}
        onClick={handleChat}>
        <IoChatbubblesOutline size={20} />
      </ControlButton>
    </Badge>
  )
}
