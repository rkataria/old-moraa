import { useContext } from 'react'

import { SwitchControl } from '@/components/common/SwitchControl'
import { EventContext } from '@/contexts/EventContext'
import { useFlags } from '@/flags/client'
import { EventContextType } from '@/types/event-context.type'

export function MoraaBoardConfiguration() {
  const { flags } = useFlags()

  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  if (!flags?.enable_drawing_on_board) return null

  return (
    <SwitchControl
      label="Allow users to draw on the board"
      checked={currentFrame.config.allowToDraw}
      onChange={() =>
        updateFrame({
          framePayload: {
            config: {
              ...currentFrame.config,
              allowToDraw: !currentFrame.config.allowToDraw,
            },
          },
          frameId: currentFrame.id,
        })
      }
    />
  )
}
