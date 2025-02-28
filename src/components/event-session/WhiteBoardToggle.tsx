import { useContext } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { Kbd } from '@heroui/react'
import { useHotkeys } from 'react-hotkeys-hook'
import { MdOutlineDraw } from 'react-icons/md'

import { ControlButton } from '../common/ControlButton'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn, liveHotKeyProps } from '@/utils/utils'

const DYTE_WHITEBOARD_PLUGIN_ID = 'ae79b269-24ca-4f8a-8112-f96084c8c19a'

export function WhiteBoardToggle() {
  const { isHost } = useContext(EventSessionContext) as EventSessionContextType

  const whiteboardPlugin = useDyteSelector((m) =>
    m.plugins.all.get(DYTE_WHITEBOARD_PLUGIN_ID)
  )

  const isWhiteboardActive = whiteboardPlugin?.active

  const handleWhiteBoard = async () => {
    if (!whiteboardPlugin) return

    if (whiteboardPlugin.active) {
      await whiteboardPlugin.deactivate()

      return
    }

    await whiteboardPlugin.activate()
  }

  useHotkeys('w', handleWhiteBoard, [whiteboardPlugin], liveHotKeyProps)

  if (!isHost) return null

  return (
    <ControlButton
      hideTooltip
      buttonProps={{
        size: 'md',
        variant: 'light',
        className: cn('gap-4 w-full justify-between pr-2', {
          'bg-red-300': isWhiteboardActive,
          'bg-transparent': !isWhiteboardActive,
        }),
      }}
      onClick={handleWhiteBoard}>
      <span className="flex items-center gap-4">
        <MdOutlineDraw size={24} className="text-gray-600" />
        {isWhiteboardActive ? 'Stop' : 'Start'} white board
      </span>
      <Kbd className="shadow-none rounded-md">w</Kbd>
    </ControlButton>
  )
}
