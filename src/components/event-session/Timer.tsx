import { useState, useEffect } from 'react'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useRealtimeChannel } from '@/hooks/useRealtimeChannel'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { getRemainingTimestamp } from '@/utils/timer.utils'
import { cn, zeroPad } from '@/utils/utils'

export function Timer() {
  const { realtimeChannel } = useRealtimeChannel()
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
        realtimeChannel?.send({
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
    realtimeChannel,
    isHost,
    dispatch,
    isBreakoutActive,
    remainingTimeInSeconds,
  ])

  if (!remainingTimeInSeconds || remainingTimeInSeconds <= 0) return null
  if (!session?.data?.timerDuration) return null

  return (
    <div className="relative bg-gray-200 px-6 rounded-lg overflow-hidden w-30">
      <div
        style={{
          width: `${(remainingTimeInSeconds / session.data.timerDuration) * 100}%`,
        }}
        className={cn(
          'absolute w-full left-0 top-0 h-full bg-primary-100 duration-1000',
          {
            'bg-red-400': remainingTimeInSeconds < 15,
          }
        )}
      />
      <TimerViewElement time={remainingTimeInSeconds} size="sm" />
    </div>
  )
}

function TimerViewElement({
  time,
  size = 'lg',
}: {
  time: number
  size?: 'sm' | 'lg'
}) {
  return (
    <h2 className="flex items-baseline text-md font-extrabold text-gray-700 relative">
      <span
        className={cn('inline-block text-center w-fit text-white-border', {
          'text-4xl': size === 'lg',
          'text-2xl': size === 'sm',
        })}>
        {zeroPad(Math.floor(time / 60), 2)}
      </span>
      :
      <span className="inline-block text-center text-white-border">
        {zeroPad(time % 60, 2)}s
      </span>
    </h2>
  )
}
