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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleWhiteBoard = async (e: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return

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
        size: 'sm',
        className: cn({
          'bg-primary-100': isWhiteboardActive,
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
