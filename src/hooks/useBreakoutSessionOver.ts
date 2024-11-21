import { useEffect } from 'react'

import { useBreakoutRooms } from './useBreakoutRooms'
import { useStoreDispatch } from './useRedux'

import { useEventSession } from '@/contexts/EventSessionContext'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'

export const useBreakoutSessionOver = () => {
  const dispatch = useStoreDispatch()
  const { isBreakoutActive } = useBreakoutRooms()
  const { isHost } = useEventSession()

  useEffect(() => {
    if (!isHost) return

    if (isBreakoutActive) return

    dispatch(
      updateMeetingSessionDataAction({
        breakoutFrameId: null,
        connectedMeetingsToActivitiesMap: null,
        timerStartedStamp: null,
        timerDuration: null,
        meetingTitles: null,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBreakoutActive])

  return null
}
