import { useContext } from 'react'

import { ColorPicker } from '@/components/common/ColorPicker'
import { LabelWithInlineControl } from '@/components/common/LabelWithInlineControl'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function FrameBackgroundControl() {
  const { updateFrame, currentFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  return (
    <LabelWithInlineControl
      label="Background color"
      control={
        <ColorPicker
          className="border-1 border-black/50 rounded-full"
          defaultColor={currentFrame.config?.backgroundColor}
          onChange={(color) => {
            if (currentFrame.config?.backgroundColor === color) return

            updateFrame({
              framePayload: {
                config: {
                  ...currentFrame.config,
                  backgroundColor: color,
                },
              },
              frameId: currentFrame.id,
            })
          }}
        />
      }
    />
  )
}
