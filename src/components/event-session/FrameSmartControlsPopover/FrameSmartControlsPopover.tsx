/* eslint-disable jsx-a11y/control-has-associated-label */

import { CommonControls } from './CommonControls'
import { Controls, getControls } from './Controls'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { EventSessionMode } from '@/types/event-session.type'
import { FrameType } from '@/utils/frame-picker.util'

export function FrameSmartControls() {
  const currentFrame = useCurrentFrame()
  const { eventSessionMode } = useEventSession()
  const controls = getControls(currentFrame?.type as FrameType)

  if (!controls) return null

  if (
    eventSessionMode === EventSessionMode.PRESENTATION ||
    eventSessionMode === EventSessionMode.PEEK
  ) {
    return (
      <div className="p-2 h-11 absolute top-[-51px] left-[50%] translate-x-[-50%] rounded-lg z-10">
        <div className="flex justify-start items-center gap-2">
          <Controls />
          <CommonControls />
        </div>
      </div>
    )
  }
}
