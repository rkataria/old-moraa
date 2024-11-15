import { useEffect, useState } from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { Badge } from '@nextui-org/react'
import { useHotkeys } from 'react-hotkeys-hook'
import { BsChatRightText, BsChatRightTextFill } from 'react-icons/bs'

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
          size: 'sm',
          variant: 'light',
          disableRipple: true,
          disableAnimation: true,
          className: cn('live-button', {
            active: isChatsSidebarOpen,
          }),
          startContent: isChatsSidebarOpen ? (
            <BsChatRightTextFill size={16} />
          ) : (
            <BsChatRightText size={16} />
          ),
        }}
        tooltipProps={{
          label: KeyboardShortcuts.Live.chats.label,
          actionKey: KeyboardShortcuts.Live.chats.key,
        }}
        onClick={handleChat}>
        Chats
      </ControlButton>
    </Badge>
  )
}
