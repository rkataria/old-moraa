import { useDyteSelector } from '@dytesdk/react-web-core'

import { useSyncValueInRedux } from './syncValueInRedux'

import { setIsBreakoutActiveAction } from '@/stores/slices/event/current-event/live-session.slice'

export const useBreakoutRooms = () => {
  const parentMeetingId = useDyteSelector(
    (meeting) => meeting.connectedMeetings.parentMeeting?.id
  )
  const isBreakoutActive = useDyteSelector((m) => m.connectedMeetings.isActive)
  const currentMeetingId = useDyteSelector((m) => m.meta.meetingId)

  useSyncValueInRedux({
    value: isBreakoutActive,
    reduxStateSelector: (state) =>
      state.event.currentEvent.liveSessionState.breakout.isBreakoutActive,
    actionFn: setIsBreakoutActiveAction,
  })

  const isCurrentDyteMeetingInABreakoutRoom =
    parentMeetingId !== currentMeetingId

  return {
    isBreakoutActive,
    isCurrentDyteMeetingInABreakoutRoom,
    currentMeetingId,
    parentMeetingId,
  }
}
