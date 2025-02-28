import { useEffect, useState } from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { Badge } from '@heroui/react'
import { useHotkeys } from 'react-hotkeys-hook'

import { ControlButton } from '../common/ControlButton'
import { ChatIcon } from '../svg'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  closeRightSidebarAction,
  setRightSidebarAction,
} from '@/stores/slices/layout/live.slice'
import { cn, KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

type ChatToggleProps = {
  showLabel?: boolean
}

export function ChatsToggle({ showLabel }: ChatToggleProps) {
  const { meeting } = useDyteMeeting()
  const selfParticipant = useDyteSelector((m) => m.self)
  const [newMessageReceived, setNewMessageReceived] = useState<boolean>(false)
  const { rightSidebarMode } = useStoreSelector((state) => state.layout.live)
  const { dyteStates, setDyteStates } = useEventSession()
  const dispatch = useStoreDispatch()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meeting.chat.on('chatUpdate', ({ message }: { message: any }) => {
      if (message.userId === selfParticipant.userId) return
      setNewMessageReceived(true)
    })
  }, [meeting, selfParticipant.userId])

  const handleToggle = () => {
    setNewMessageReceived(false)
    if (rightSidebarMode === 'chat') {
      dispatch(closeRightSidebarAction())
      setDyteStates({
        ...dyteStates,
        sidebar: null,
      })
    } else {
      setDyteStates({
        activeSidebar: true,
        sidebar: 'chat',
      })
      dispatch(setRightSidebarAction('chat'))
    }
  }

  useHotkeys('c', handleToggle, liveHotKeyProps)

  const isChatsSidebarOpen = rightSidebarMode === 'chat'

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
          isIconOnly: !showLabel,
          disableRipple: true,
          disableAnimation: true,
          className: cn('live-button', {
            active: isChatsSidebarOpen,
          }),
          startContent: (
            <ChatIcon
              className={cn({
                'text-primary': isChatsSidebarOpen,
              })}
            />
          ),
        }}
        tooltipProps={{
          label: KeyboardShortcuts.Live.chats.label,
          actionKey: KeyboardShortcuts.Live.chats.key,
        }}
        onClick={handleToggle}>
        {showLabel ? 'Chat' : null}
      </ControlButton>
    </Badge>
  )
}
