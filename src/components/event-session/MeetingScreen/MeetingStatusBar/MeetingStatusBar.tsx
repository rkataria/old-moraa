/* eslint-disable jsx-a11y/no-static-element-interactions */

import { MeetingStatusContainer } from './MeetingStatusContainer'
import { Timer } from '../../Timer'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import { EventSessionMode } from '@/types/event-session.type'
import { getRemainingTimestamp } from '@/utils/timer.utils'

/* eslint-disable jsx-a11y/click-events-have-key-events */
export function MeetingStatusBar() {
  const { eventSessionMode, startPresentation, isHost } = useEventSession()
  const { setCurrentFrame, getFrameById } = useEventContext()
  const dispatch = useStoreDispatch()
  const currentFrame = useCurrentFrame()
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )
  const isBreakoutStarted = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isBreakoutActive
  )
  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data!
  )
  const sessionBreakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId || null
  )

  const visibleBackToBreakout =
    sessionBreakoutFrameId && sessionBreakoutFrameId !== currentFrame?.id

  const timerActive =
    session?.data?.timerStartedStamp &&
    session.data.timerDuration &&
    getRemainingTimestamp(
      session.data.timerStartedStamp,
      session.data.timerDuration
    ) > 0

  if (timerActive) {
    return <Timer />
  }
  if (isHost && isBreakoutStarted) {
    return (
      <MeetingStatusContainer
        description="Your planned breakout session is in progress."
        styles={{
          description: 'text-sm font-medium',
        }}
        actions={[
          <RenderIf isTrue={!!visibleBackToBreakout}>
            <Button
              className="bg-danger-500 text-white mx-2 h-6"
              onClick={() => {
                setCurrentFrame(getFrameById(sessionBreakoutFrameId as string))
              }}>
              View Breakout
            </Button>
          </RenderIf>,
        ]}
      />
    )
  }
  if (isInBreakoutMeeting) {
    return (
      <MeetingStatusContainer
        description="You are in a breakout session and you can see the shared frames."
        styles={{
          description: 'text-sm font-medium',
        }}
      />
    )
  }
  if (eventSessionMode === EventSessionMode.PEEK) {
    return (
      <MeetingStatusContainer
        description="Frames are not being shared with participants"
        styles={{
          description: 'text-sm font-medium',
        }}
        actions={[
          <RenderIf isTrue={!!currentFrame}>
            <Button
              variant="flat"
              onClick={() => {
                if (!currentFrame) return
                startPresentation(currentFrame.id)
              }}>
              Share Frame
            </Button>
          </RenderIf>,
          <Button
            color="danger"
            onClick={() => {
              dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
            }}>
            Go to Lobby
          </Button>,
        ]}
      />
    )
  }

  return null
}
