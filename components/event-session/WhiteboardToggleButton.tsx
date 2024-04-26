import { useDyteSelector } from '@dytesdk/react-web-core'
import { TfiBlackboard } from 'react-icons/tfi'

import { cn } from '@/utils/utils'

const DYTE_WHITEBOARD_PLUGIN_ID = 'ae79b269-24ca-4f8a-8112-f96084c8c19a'

export function WhiteboardToggleButton({
  showLabel = false,
}: {
  showLabel?: boolean
}) {
  const whiteboardPlugin = useDyteSelector((m) =>
    m.plugins.all.get(DYTE_WHITEBOARD_PLUGIN_ID)
  )

  const handleWhiteboard = async () => {
    if (!whiteboardPlugin) return

    if (whiteboardPlugin.active) {
      await whiteboardPlugin.deactivate()

      return
    }

    await whiteboardPlugin.activate()
  }

  return (
    <button
      type="button"
      onClick={handleWhiteboard}
      style={{
        backgroundColor:
          'var(--dyte-controlbar-button-background-color, rgb(var(--dyte-colors-background-1000, 8 8 8)))',
      }}
      className={cn(
        'flex flex-col justify-center items-center gap-[5px] w-14 h-10 rounded-sm',
        {
          'bg-white text-black': whiteboardPlugin?.active,
          'hover:bg-[#1E1E1E] text-white': !whiteboardPlugin?.active,
        }
      )}>
      <TfiBlackboard className="text-2xl" />
      {showLabel && <p className="text-xs">Whiteboard</p>}
    </button>
  )
}
