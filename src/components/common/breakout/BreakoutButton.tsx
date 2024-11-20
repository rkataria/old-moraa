import { useEffect } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import { VscMultipleWindows } from 'react-icons/vsc'

import { AppsDropdownMenuItem } from '@/components/event-session/AppsDropdownMenuItem'
import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useRealtimeChannel } from '@/contexts/RealtimeChannelContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { SessionService } from '@/services/session.service'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { PresentationStatuses } from '@/types/event-session.type'
import { IFrame } from '@/types/frame.type'
import {
  notificationDuration,
  notifyBreakoutEnd,
  notifyBreakoutStart,
} from '@/utils/breakout-notify.utils'

export function BreakoutButton({
  disabled,
  onClick,
}: {
  disabled?: boolean
  onClick?: () => void
}) {
  const dyteMeeting = useDyteMeeting()
  const {
    isHost,
    currentFrame,
    presentationStatus,
    setCurrentFrame,
    setDyteStates,
  } = useEventSession()
  const { eventRealtimeChannel } = useRealtimeChannel()
  const meetingId = useStoreSelector(
    (store) => store.event.currentEvent.meetingState.meeting.data?.id
  )

  const sessionBreakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId || null
  )
  const dispatch = useStoreDispatch()

  const { sections } = useEventContext()

  const { isBreakoutActive, isCurrentDyteMeetingInABreakoutRoom } =
    useBreakoutRooms()
  const { breakoutRoomsInstance } = useBreakoutManagerContext()

  const sessionBreakoutFrame = sections
    ?.map((section) => section.frames)
    .flat()
    .find((frame) => frame?.id === sessionBreakoutFrameId)

  useEffect(() => {
    if (presentationStatus !== PresentationStatuses.STOPPED) return () => {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onNewMeetingsCreated = (meeting: any) => {
      if (meeting.meetings.length) {
        SessionService.createSessionForBreakouts({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dyteMeetings: meeting.meetings.map((meet: any) => ({
            connected_dyte_meeting_id: meet.id!,
            data: {
              currentFrameId: null,
              presentationStatus: PresentationStatuses.STOPPED,
            },
            meeting_id: meetingId!,
          })),
        })
      }
    }
    dyteMeeting.meeting.connectedMeetings.on(
      'stateUpdate',
      onNewMeetingsCreated
    )

    return () =>
      dyteMeeting.meeting.connectedMeetings.off(
        'stateUpdate',
        onNewMeetingsCreated
      )
  }, [dyteMeeting, meetingId, presentationStatus])

  const onBreakoutEnd = () => {
    onClick?.()
    breakoutRoomsInstance?.endBreakoutRooms()
    dispatch(
      updateMeetingSessionDataAction({
        breakoutFrameId: null,
        connectedMeetingsToActivitiesMap: {},
        timerStartedStamp: null,
      })
    )
  }

  const endBreakout = () => {
    onClick?.()
    if (!eventRealtimeChannel) {
      onBreakoutEnd()

      return
    }
    notifyBreakoutStart(eventRealtimeChannel)
    setTimeout(() => {
      notifyBreakoutEnd(eventRealtimeChannel)
      onBreakoutEnd()
    }, notificationDuration * 1000)
  }

  useEffect(() => {
    if (!eventRealtimeChannel) return

    eventRealtimeChannel.on('broadcast', { event: 'time-out' }, () => {
      if (isHost) {
        onBreakoutEnd()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventRealtimeChannel, isHost])

  if (!isHost) return null
  if (isCurrentDyteMeetingInABreakoutRoom) return null

  // Show the disabled state if planned breakout is active
  if (disabled) {
    return (
      <AppsDropdownMenuItem
        icon={<VscMultipleWindows size={24} />}
        title="Start Breakout"
        description="Start a breakout session"
        disabled
        onClick={() => {}}
      />
    )
  }

  if (
    !sessionBreakoutFrameId &&
    presentationStatus === PresentationStatuses.STOPPED
  ) {
    return (
      <AppsDropdownMenuItem
        icon={<VscMultipleWindows size={24} />}
        title={isBreakoutActive ? 'Open Manager' : 'Start Breakout'}
        description={
          isBreakoutActive
            ? 'Manage the breakout sessions'
            : 'Start a breakout session'
        }
        onClick={() => {
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

  if (isBreakoutActive) {
    if (!currentFrame?.content?.breakoutFrameId) {
      if (sessionBreakoutFrameId && isBreakoutActive) {
        return (
          <AppsDropdownMenuItem
            icon={<VscMultipleWindows size={24} />}
            title="View Breakout"
            description="View the breakout session"
            onClick={() => setCurrentFrame(sessionBreakoutFrame as IFrame)}
          />
        )
      }
    }

    return (
      <AppsDropdownMenuItem
        icon={<VscMultipleWindows size={24} />}
        title="End Breakout"
        description="End the breakout session"
        onClick={endBreakout}
      />
    )
  }

  return null
}
