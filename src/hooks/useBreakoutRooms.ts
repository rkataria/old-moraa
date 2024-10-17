import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'

export const useBreakoutRooms = () => {
  const parentMeetingId = useDyteSelector(
    (meeting) => meeting.connectedMeetings.parentMeeting?.id
  )
  const isBreakoutActive = useDyteSelector((m) => m.connectedMeetings.isActive)
  const { meeting } = useDyteMeeting()

  const isCurrentDyteMeetingInABreakoutRoom =
    parentMeetingId !== meeting.meta.meetingId

  return {
    isBreakoutActive,
    isCurrentDyteMeetingInABreakoutRoom,
    currentMeetingId: meeting.meta.meetingId,
    parentMeetingId,
  }
}
