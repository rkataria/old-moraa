import { useEffect } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import { VscMultipleWindows } from 'react-icons/vsc'

import { AppsDropdownMenuItem } from '@/components/event-session/AppsDropdownMenuItem'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { SessionService } from '@/services/session.service'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { PresentationStatuses } from '@/types/event-session.type'

export const useOnUnplannedBreakoutSessionUpdate = () => {
  const dyteMeeting = useDyteMeeting()
  const { isBreakoutActive } = useBreakoutRooms()
  const dispatch = useStoreDispatch()
  const { isHost, presentationStatus } = useEventSession()

  const meetingId = useStoreSelector(
    (store) => store.event.currentEvent.meetingState.meeting.data?.id
  )

  useEffect(() => {
    if (presentationStatus !== PresentationStatuses.STOPPED) return
    if (!isHost) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    dispatch(
      updateMeetingSessionDataAction({
        breakoutType: 'unplanned',
      })
    )
    dyteMeeting.meeting.connectedMeetings
      .getConnectedMeetings()
      .then(({ meetings }) => {
        if (meetings.length) {
          SessionService.createSessionForBreakouts({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dyteMeetings: meetings.map((meet: any) => ({
              connected_dyte_meeting_id: meet.id!,
              data: {
                currentFrameId: null,
                presentationStatus: PresentationStatuses.STOPPED,
              },
              meeting_id: meetingId!,
            })),
          })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBreakoutActive])

  return null
}

export function UnplannedBreakoutButton({ onClick }: { onClick?: () => void }) {
  const { isHost, setDyteStates, presentationStatus } = useEventSession()

  const sessionBreakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId || null
  )

  const { isBreakoutActive, isCurrentDyteMeetingInABreakoutRoom } =
    useBreakoutRooms()

  if (!isHost) return null
  if (isCurrentDyteMeetingInABreakoutRoom) return null

  if (
    (isBreakoutActive && sessionBreakoutFrameId) ||
    (!isBreakoutActive && presentationStatus !== PresentationStatuses.STOPPED)
  ) {
    return (
      <AppsDropdownMenuItem
        icon={<VscMultipleWindows size={24} />}
        title="Start Breakout"
        description="Start unplanned breakout session"
        disabled
        onClick={() => {}}
      />
    )
  }

  return (
    <AppsDropdownMenuItem
      icon={<VscMultipleWindows size={24} />}
      title={isBreakoutActive ? 'Open Manager' : 'Start Breakout'}
      description={
        isBreakoutActive
          ? 'Manage the breakout session'
          : 'Start a breakout session'
      }
      onClick={() => {
        onClick?.()
        setDyteStates((state) => ({
          ...state,
          activeBreakoutRoomsManager: {
            active: true,
            mode: 'create',
          },
        }))
      }}
    />
  )
}
