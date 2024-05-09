import { useDyteSelector } from '@dytesdk/react-web-core'
import { IoEasel } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

const DYTE_WHITEBOARD_PLUGIN_ID = 'ae79b269-24ca-4f8a-8112-f96084c8c19a'

export function WhiteBoardToggle() {
  const whiteboardPlugin = useDyteSelector((m) =>
    m.plugins.all.get(DYTE_WHITEBOARD_PLUGIN_ID)
  )

  const isWhiteboardActive = whiteboardPlugin?.active

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        variant: 'light',
        className: cn('transition-all duration-300', {
          'bg-black text-white': isWhiteboardActive,
        }),
      }}
      tooltipProps={{
        content: isWhiteboardActive ? 'Close whiteboard' : 'Open whiteboard',
      }}
      onClick={async () => {
        if (!whiteboardPlugin) return

        if (whiteboardPlugin.active) {
          await whiteboardPlugin.deactivate()

          return
        }

        await whiteboardPlugin.activate()
      }}>
      <IoEasel size={20} />
    </ControlButton>
  )
}
