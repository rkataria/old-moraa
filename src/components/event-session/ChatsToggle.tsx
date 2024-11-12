import { useEffect, useState } from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { Badge } from '@nextui-org/react'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoChatbubbles, IoChatbubblesOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn, KeyboardShortcuts } from '@/utils/utils'

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChat = (e: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return

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
          size: 'md',
          variant: 'light',
          disableRipple: true,
          disableAnimation: true,
          className: cn('live-button -mx-2', {
            active: isChatsSidebarOpen,
          }),
        }}
        tooltipProps={{
          label: KeyboardShortcuts.Live.chats.label,
          actionKey: KeyboardShortcuts.Live.chats.key,
        }}
        onClick={handleChat}>
        <div className="flex flex-col justify-center items-center py-1">
          {isChatsSidebarOpen ? (
            <IoChatbubbles size={20} />
          ) : (
            <IoChatbubblesOutline size={20} />
          )}
          Chats
        </div>
      </ControlButton>
    </Badge>
  )
}
