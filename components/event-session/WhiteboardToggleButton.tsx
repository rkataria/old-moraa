import DyteClient from '@dytesdk/web-core'
import { TfiBlackboard } from 'react-icons/tfi'

import { cn } from '@/utils/utils'

const DYTE_WHITEBOARD_PLUGIN_ID = 'ae79b269-24ca-4f8a-8112-f96084c8c19a' // whiteboard id

export function WhiteboardToggleButton({ meeting }: { meeting: DyteClient }) {
  const whiteboard = meeting.plugins.all.get(DYTE_WHITEBOARD_PLUGIN_ID)

  const handleWhiteboard = async () => {
    if (!whiteboard) return

    if (whiteboard.active) {
      await whiteboard.deactivate()

      return
    }

    await whiteboard.activate()
  }

  return (
    <button
      type="button"
      onClick={handleWhiteboard}
      className={cn(
        'flex flex-col items-center gap-[5px] p-1 w-[84px] rounded-sm',
        {
          'bg-white text-black': whiteboard?.active,
          'hover:bg-[#1E1E1E] text-white': !whiteboard?.active,
        }
      )}>
      <TfiBlackboard className="text-2xl" />
      <p className="text-xs">Whiteboard</p>
    </button>
  )
}
