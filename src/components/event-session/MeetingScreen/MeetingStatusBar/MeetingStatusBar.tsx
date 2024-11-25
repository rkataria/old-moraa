/* eslint-disable jsx-a11y/no-static-element-interactions */

import { MeetingStatusContainer } from './MeetingStatusContainer'
import { Timer } from '../../Timer'

import { AskForHelpButton } from '@/components/common/breakout/AskForHelpButton'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Button } from '@/components/ui/Button'
import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useRealtimeChannel } from '@/contexts/RealtimeChannelContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import { EventSessionMode } from '@/types/event-session.type'
import {
  notificationDuration,
  notifyBreakoutEnd,
  notifyBreakoutStart,
} from '@/utils/breakout-notify.utils'
import { getRemainingTimestamp } from '@/utils/timer.utils'

/* eslint-disable jsx-a11y/click-events-have-key-events */
export function MeetingStatusBar() {
  const { eventSessionMode, startPresentation, isHost, setDyteStates } =
    useEventSession()
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
  const breakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId || null
  )
  const isBreakoutActive = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.breakout.isBreakoutActive
  )
  const breakoutType = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutType
  )
  const { eventRealtimeChannel } = useRealtimeChannel()
  const { breakoutRoomsInstance } = useBreakoutManagerContext()

  const timerActive =
    session?.data?.timerStartedStamp &&
    session.data.timerDuration &&
    getRemainingTimestamp(
      session.data.timerStartedStamp,
      session.data.timerDuration
    ) > 0

  const endBreakoutSession = () => {
    breakoutRoomsInstance?.endBreakoutRooms()
  }

  const handleBreakoutEnd = () => {
    if (!eventRealtimeChannel) {
      endBreakoutSession()

      return
    }
    notifyBreakoutStart(eventRealtimeChannel)
    setTimeout(() => {
      notifyBreakoutEnd(eventRealtimeChannel)
      endBreakoutSession()
    }, notificationDuration * 1000)
  }

  if (timerActive) {
    return (
      <Timer
        showEndBreakout={
          isHost && isBreakoutActive && currentFrame?.id !== breakoutFrameId
        }
        onEndBreakout={handleBreakoutEnd}
      />
    )
  }
  if (isInBreakoutMeeting) {
    return (
      <MeetingStatusContainer
        description="You are in a breakout session"
        styles={{
          description: 'text-sm font-medium',
        }}
        actions={[
          <RenderIf isTrue={!isHost}>
            <AskForHelpButton />
          </RenderIf>,
          <RenderIf isTrue={isHost && breakoutType !== 'planned'}>
            <Button
              onClick={() => {
                setDyteStates((state) => ({
                  ...state,
                  activeBreakoutRoomsManager: {
                    active: true,
                    mode: 'create',
                  },
                }))
              }}>
              Manage
            </Button>
          </RenderIf>,
          <RenderIf isTrue={isHost && isBreakoutActive}>
            <Button
              className="bg-red-500 text-white"
              onClick={handleBreakoutEnd}>
              End Breakout
            </Button>
          </RenderIf>,
        ]}
      />
    )
  }
  if (isHost && isBreakoutStarted) {
    return (
      <MeetingStatusContainer
        description={
          breakoutType === 'planned'
            ? 'Your planned breakout session is in progress'
            : 'Your breakout session is in progress'
        }
        styles={{
          description: 'text-sm font-medium',
        }}
        actions={[
          <RenderIf isTrue={breakoutType !== 'planned'}>
            <Button
              onClick={() => {
                setDyteStates((state) => ({
                  ...state,
                  activeBreakoutRoomsManager: {
                    active: true,
                    mode: 'create',
                  },
                }))
              }}>
              Manage
            </Button>
          </RenderIf>,
          <RenderIf isTrue={isBreakoutActive}>
            <Button
              className="bg-red-500 text-white"
              onClick={handleBreakoutEnd}>
              End Breakout
            </Button>
          </RenderIf>,
        ]}
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
