import { useContext } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoEaselOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn, KeyboardShortcuts } from '@/utils/utils'

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

  useHotkeys('w', handleWhiteBoard, [whiteboardPlugin])

  if (!isHost) return null

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        size: 'sm',
        variant: 'flat',
        className: cn('bg-[#F3F4F6] text-[#444444]', {
          'bg-black text-white': isWhiteboardActive,
        }),
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.whiteboard.label,
        actionKey: KeyboardShortcuts.Live.whiteboard.key,
      }}
      onClick={handleWhiteBoard}>
      <IoEaselOutline size={20} />
    </ControlButton>
  )
}
