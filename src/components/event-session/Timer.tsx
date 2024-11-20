import { useState, useEffect } from 'react'

import { MeetingStatusContainer } from './MeetingScreen/MeetingStatusBar/MeetingStatusContainer'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { Button } from '../ui/Button'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useRealtimeChannel } from '@/contexts/RealtimeChannelContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { getRemainingTimestamp } from '@/utils/timer.utils'
import { cn, zeroPad } from '@/utils/utils'

export function Timer() {
  const { eventRealtimeChannel } = useRealtimeChannel()
  const { isHost } = useEventSession()
  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data!
  )

  const isBreakoutActive = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.breakout.isBreakoutActive
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

  return (
    <MeetingStatusContainer
      title={
        <div className="flex justify-center items-center gap-2">
          {zeroPad(Math.floor(remainingTimeInSeconds / 60), 2)}:
          {zeroPad(remainingTimeInSeconds % 60, 2)}s
        </div>
      }
      styles={{
        container: cn('relative gap-2', {
          'animate-pulse': remainingTimeInSeconds < 15,
        }),
        title: cn(
          'text-xl font-semibold text-primary tracking-wide min-w-[5rem] text-center',
          {
            'text-red-400': remainingTimeInSeconds < 15,
          }
        ),
      }}
      actions={[
        <RenderIf isTrue={isHost}>
          <Button className="bg-red-500 text-white" onClick={stopTimer}>
            Stop
          </Button>
        </RenderIf>,
      ]}
    />
  )
}
