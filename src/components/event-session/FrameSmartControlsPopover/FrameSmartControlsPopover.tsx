/* eslint-disable jsx-a11y/control-has-associated-label */

import { CommonControls } from './CommonControls'
import { Controls, getControls } from './Controls'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { EventSessionMode } from '@/types/event-session.type'
import { FrameType } from '@/utils/frame-picker.util'

export function FrameSmartControls() {
  const currentFrame = useCurrentFrame()
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )
  const { eventSessionMode, isHost } = useEventSession()
  const controls = getControls(currentFrame?.type as FrameType)

  if (!controls || !isHost || isInBreakoutMeeting) return null

  if (
    eventSessionMode === EventSessionMode.PRESENTATION ||
    eventSessionMode === EventSessionMode.PEEK
  ) {
    return (
      <div className="h-full px-1.5 absolute w-[77%] top-[-51px] left-[-20%] rounded-lg z-10">
        <div className="h-full flex justify-center items-center gap-2">
          <Controls />
          <CommonControls />
        </div>
      </div>
    )
  }
}
