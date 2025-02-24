import { useEffect } from 'react'

import { useBreakoutRooms } from './useBreakoutRooms'
import { useStoreDispatch } from './useRedux'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'

export const useBreakoutSessionOver = () => {
  const dispatch = useStoreDispatch()
  const { isBreakoutActive } = useBreakoutRooms()
  const { isHost, eventRealtimeChannel } = useEventSession()
  const { handleBreakoutEndWithTimerDialog } = useBreakoutManagerContext()

  useEffect(() => {
    if (!isHost || !eventRealtimeChannel) return

    if (isBreakoutActive) {
      eventRealtimeChannel?.on(
        'broadcast',
        { event: 'breakout-time-ended' },
        () => {
          if (!isHost) return

          handleBreakoutEndWithTimerDialog()
        }
      )

      return
    }

    dispatch(
      updateMeetingSessionDataAction({
        breakoutFrameId: null,
        connectedMeetingsToActivitiesMap: null,
        timerStartedStamp: null,
        timerDuration: null,
        meetingTitles: null,
        breakoutType: null,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBreakoutActive, eventRealtimeChannel])

  return null
}
