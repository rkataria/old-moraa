import { useContext } from 'react'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { FrameType } from '@/utils/frame-picker.util'

export function CommonAppearance() {
  const { currentFrame } = useContext(EventContext) as EventContextType

  if (!currentFrame) return null

  if (currentFrame.type === FrameType.MORAA_SLIDE) {
    return null
  }

  return null
}
