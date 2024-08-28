import { useEffect } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'

import { useBreakoutRooms } from './useBreakoutRooms'
import { useStoreSelector } from './useRedux'

import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'

export const useParticipantBreakoutFrameSetter = () => {
  const { isCurrentDyteMeetingInABreakoutRoom } = useBreakoutRooms()
  const activeSessionData = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
  )
  const { meeting } = useDyteMeeting()
  const { getFrameById } = useEventContext()
  const { setCurrentFrame } = useEventSession()

  useEffect(() => {
    if (!isCurrentDyteMeetingInABreakoutRoom) return
    if (Object.keys(activeSessionData?.slideAssignedToRooms || {}).length) {
      const activityId =
        activeSessionData?.slideAssignedToRooms?.[
          meeting.connectedMeetings.currentMeetingId
        ]
      if (!activityId) return
      const activityFrame = getFrameById(activityId)
      if (!activityFrame) return
      setCurrentFrame(activityFrame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isCurrentDyteMeetingInABreakoutRoom,
    meeting.connectedMeetings.currentMeetingId,
    activeSessionData?.slideAssignedToRooms,
  ])
}
