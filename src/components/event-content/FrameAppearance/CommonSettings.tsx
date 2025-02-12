import { useContext } from 'react'

import { SwitchControl } from '@/components/common/SwitchControl'
import { EventContext } from '@/contexts/EventContext'
import { FrameStatus } from '@/types/enums'
import { EventContextType } from '@/types/event-context.type'

export function CommonSettings() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  return (
    <SwitchControl
      label="Share with learners"
      checked={currentFrame.status === FrameStatus.PUBLISHED}
      onChange={() =>
        updateFrame({
          framePayload: {
            ...currentFrame,
            status:
              currentFrame.status === FrameStatus.PUBLISHED
                ? FrameStatus.DRAFT
                : FrameStatus.PUBLISHED,
          },
          frameId: currentFrame.id,
        })
      }
    />
  )
}
