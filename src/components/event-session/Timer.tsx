import { useState, useEffect } from 'react'

import { MeetingStatusContainer } from './MeetingScreen/MeetingStatusBar/MeetingStatusContainer'
import { AskForHelpButton } from '../common/breakout/AskForHelpButton'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { Button } from '../ui/Button'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useRealtimeChannel } from '@/contexts/RealtimeChannelContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { getRemainingTimestamp } from '@/utils/timer.utils'
import { cn, zeroPad } from '@/utils/utils'

export function Timer({
  showEndBreakout,
  onEndBreakout,
}: {
  showEndBreakout?: boolean
  onEndBreakout: () => void
}) {
  const { eventRealtimeChannel } = useRealtimeChannel()
  const { isHost, setDyteStates } = useEventSession()
  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data!
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
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )
  const [remainingTimeInSeconds, setRemainingTimeInSeconds] = useState(0)
  const dispatch = useStoreDispatch()

  useEffect(() => {
    if (!session?.data?.timerDuration) return
    const initialRemainingTime = session?.data?.timerStartedStamp
      ? getRemainingTimestamp(
          session.data.timerStartedStamp,
          session.data.timerDuration
        )
      : 0
    setRemainingTimeInSeconds(initialRemainingTime)
  }, [session?.data?.timerDuration, session?.data?.timerStartedStamp])

  useEffect(() => {
    if (!remainingTimeInSeconds) return
    if (remainingTimeInSeconds <= 0) return

    const timer = setInterval(() => {
      setRemainingTimeInSeconds(remainingTimeInSeconds - 1)
      if (!isHost) return
      if (remainingTimeInSeconds - 1 !== 0) return
      // At last second
      dispatch(
        updateMeetingSessionDataAction({
          timerStartedStamp: null,
        })
      )
      if (isBreakoutActive) {
        eventRealtimeChannel?.send({
          type: 'broadcast',
          event: 'time-out',
        })
      }
    }, 1000)

    // eslint-disable-next-line consistent-return
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [
    eventRealtimeChannel,
    isHost,
    dispatch,
    isBreakoutActive,
    remainingTimeInSeconds,
  ])

  const stopTimer = () => {
    dispatch(
      updateMeetingSessionDataAction({
        timerStartedStamp: null,
      })
    )
  }

  if (!remainingTimeInSeconds || remainingTimeInSeconds <= 0) return null
  if (!session?.data?.timerDuration) return null

  const getMessage = () => {
    if (isBreakoutActive) {
      if (isInBreakoutMeeting) {
        return `You are in a ${breakoutType === 'planned' ? 'planned breakout' : 'breakout'} session`
      }

      return `${breakoutType === 'planned' ? 'Planned breakout session is about to end in' : 'Breakout session is in progress'}`
    }

    return 'Timer is about to end in'
  }

  return (
    <MeetingStatusContainer
      title={
        <div className="flex justify-center items-center gap-2">
          <span>{getMessage()}</span>
          <div
            className={cn(
              'flex justify-center items-center gap-2 w-16 h-7 rounded-md font-semibold',
              {
                'bg-red-500 text-white': remainingTimeInSeconds < 15,
                'bg-gray-100 text-gray-700': remainingTimeInSeconds >= 15,
                'animate-pulse': remainingTimeInSeconds < 15,
              }
            )}>
            {zeroPad(Math.floor(remainingTimeInSeconds / 60), 2)}:
            {zeroPad(remainingTimeInSeconds % 60, 2)}s
          </div>
        </div>
      }
      styles={{
        container: cn('relative gap-2'),
        title: cn('text-sm font-medium', {
          'text-red-400': remainingTimeInSeconds < 15,
        }),
      }}
      actions={[
        <RenderIf isTrue={!isHost}>
          <AskForHelpButton />
        </RenderIf>,
        <RenderIf isTrue={isHost && !isBreakoutActive}>
          <Button className="bg-red-500 text-white" onClick={stopTimer}>
            Stop
          </Button>
        </RenderIf>,
        <RenderIf
          isTrue={isHost && breakoutType !== 'planned' && !!showEndBreakout}>
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
        <RenderIf isTrue={!!showEndBreakout}>
          <Button className="bg-red-500 text-white" onClick={onEndBreakout}>
            End Breakout
          </Button>
        </RenderIf>,
      ]}
    />
  )
}
