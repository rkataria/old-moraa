import { useDyteSelector } from '@dytesdk/react-web-core'
import { TfiBlackboard } from 'react-icons/tfi'

import { cn } from '@/utils/utils'

const DYTE_WHITEBOARD_PLUGIN_ID = 'ae79b269-24ca-4f8a-8112-f96084c8c19a'

export function WhiteboardToggleButton() {
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
      className={cn(
        'flex flex-col items-center gap-[5px] p-1 w-[84px] rounded-sm',
        {
          'bg-white text-black': whiteboardPlugin?.active,
          'hover:bg-[#1E1E1E] text-white': !whiteboardPlugin?.active,
        }
      )}>
      <TfiBlackboard className="text-2xl" />
      <p className="text-xs">Whiteboard</p>
    </button>
  )
}
