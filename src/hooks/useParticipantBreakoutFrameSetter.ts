import { useEffect } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'

import { useBreakoutRooms } from './useBreakoutRooms'
import { useSharedState } from './useSharedState'

import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'

export const useParticipantBreakoutFrameSetter = () => {
  const { isCurrentDyteMeetingInABreakoutRoom } = useBreakoutRooms()
  const [sharedState] = useSharedState<{
    slideAssignedToRooms: { [x: string]: string }
  }>()
  const { meeting } = useDyteMeeting()
  const { getFrameById } = useEventContext()
  const { setCurrentFrame } = useEventSession()

  useEffect(() => {
    if (!isCurrentDyteMeetingInABreakoutRoom) return
    if (Object.keys(sharedState?.slideAssignedToRooms || {}).length) {
      const activityId =
        sharedState?.slideAssignedToRooms[
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
    sharedState?.slideAssignedToRooms,
  ])
}
