import { useContext } from 'react'

import { SwitchControl } from '@/components/common/SwitchControl'
import { EventContext } from '@/contexts/EventContext'
import { FrameStatus } from '@/types/enums'
import { EventContextType } from '@/types/event-context.type'

export function CommonConfiguration() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  const updateFrameStatus = (value: boolean) => {
    updateFrame({
      framePayload: {
        status: value ? FrameStatus.PUBLISHED : FrameStatus.DRAFT,
      },
      frameId: currentFrame.id,
    })
  }

  return (
    <SwitchControl
      label="Share with participants"
      checked={currentFrame.status === FrameStatus.PUBLISHED}
      onChange={updateFrameStatus}
    />
  )
}
