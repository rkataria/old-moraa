import { useEffect } from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { VscMultipleWindows } from 'react-icons/vsc'

import { EndBreakoutButton } from './EndBreakoutButton'
import { StartBreakoutButtonWithConfirmationModal } from './StartBreakoutButtonWithConfirmationModal'
import { ControlButton } from '../ControlButton'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useRealtimeChannel } from '@/hooks/useRealtimeChannel'
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
import { StartBreakoutConfig } from '@/utils/dyte-breakout'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export function BreakoutButton() {
  const dyteMeeting = useDyteMeeting()
  const {
    isHost,
    currentFrame,
    presentationStatus,
    setCurrentFrame,
    setDyteStates,
  } = useEventSession()
  const { realtimeChannel } = useRealtimeChannel()
  const meetingId = useStoreSelector(
    (store) => store.event.currentEvent.meetingState.meeting.data?.id
  )
  const areParticipantsPresentInMeeting = useDyteSelector(
    (state) => state.participants.joined.toArray().length
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

  const onBreakoutStartOnBreakoutSlide = async (
    breakoutConfig: {
      breakoutFrameId?: string
      breakoutDuration?: number
      activities?: Array<{ activityId?: string; name: string }>
      activityId?: string
    } & StartBreakoutConfig
  ) => {
    if (!meetingId) return

    try {
      await SessionService.deleteAllExistingBreakoutSessions({ meetingId })
    } catch {
      /* empty */
    }

    try {
      await breakoutRoomsInstance?.startBreakoutRooms({
        /*
         * Because the breakoutRooms array only exist on breakout room type so it won't get sent for a breakout group type
         * And the `participantPerGroup` only exist on breakout group type so it won't get sent for a breakout room type
         */
        roomsCount: breakoutConfig.roomsCount,
        participantsPerRoom: breakoutConfig.participantsPerRoom,
      })
      const connectedMeetingsToActivitiesMap: { [x: string]: string } =
        dyteMeeting.meeting.connectedMeetings.meetings.reduce(
          (acc, meet, idx) => ({
            ...acc,
            [meet.id as string]:
              breakoutConfig?.activities?.[idx]?.activityId ||
              breakoutConfig.activityId ||
              null,
          }),
          {}
        )
      dispatch(
        updateMeetingSessionDataAction({
          breakoutFrameId:
            presentationStatus === PresentationStatuses.STARTED
              ? breakoutConfig.breakoutFrameId
              : null,
          connectedMeetingsToActivitiesMap,
        })
      )

      if (breakoutConfig.breakoutDuration && realtimeChannel) {
        realtimeChannel.send({
          type: 'broadcast',
          event: 'timer-start-event',
          payload: {
            duration: {
              total: (breakoutConfig?.breakoutDuration as number) * 60,
              remaining: (breakoutConfig?.breakoutDuration as number) * 60,
            },
          },
        })
      }

      SessionService.createSessionForBreakouts({
        dyteMeetings: dyteMeeting.meeting.connectedMeetings.meetings.map(
          (meet) => ({
            connected_dyte_meeting_id: meet.id!,
            data: {
              currentFrameId: connectedMeetingsToActivitiesMap[meet.id!],
              presentationStatus,
            },
            meeting_id: meetingId,
          })
        ),
      })
    } catch (err) {
      console.log('🚀 ~ onBreakoutStartOnBreakoutSlide ~ err:', err)
    }
  }

  const onBreakoutEnd = () => {
    breakoutRoomsInstance?.endBreakoutRooms()
    dispatch(
      updateMeetingSessionDataAction({
        breakoutFrameId: null,
        connectedMeetingsToActivitiesMap: {},
      })
    )
    realtimeChannel?.send({
      type: 'broadcast',
      event: 'timer-close-event',
      payload: { remainingDuration: 0 },
    })
  }

  const endBreakout = () => {
    if (!realtimeChannel) {
      onBreakoutEnd()

      return
    }
    notifyBreakoutStart(realtimeChannel)
    setTimeout(() => {
      notifyBreakoutEnd(realtimeChannel)
      onBreakoutEnd()
    }, notificationDuration * 1000)
  }

  useEffect(() => {
    if (!realtimeChannel) return

    realtimeChannel.on('broadcast', { event: 'time-out' }, () => {
      if (isHost) {
        onBreakoutEnd()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeChannel, isHost])

  if (!isHost) return null
  if (isCurrentDyteMeetingInABreakoutRoom) return null

  const defaultRoomsCount = currentFrame?.content?.breakoutRooms?.length
  const defaultParticipantsPerRoom = currentFrame?.config?.participantPerGroup
  const defaultBreakoutDuration = currentFrame?.config.breakoutDuration

  if (
    !sessionBreakoutFrameId &&
    presentationStatus === PresentationStatuses.STOPPED &&
    areParticipantsPresentInMeeting
  ) {
    return (
      <ControlButton
        tooltipProps={{
          content: isBreakoutActive
            ? 'Open breakout manager'
            : 'Create breakout rooms',
        }}
        buttonProps={{
          size: 'sm',
          variant: 'solid',
          className: cn('gap-2 justify-between', {
            '!bg-green-500 !text-white': isBreakoutActive,
          }),
        }}
        onClick={() =>
          setDyteStates((state) => ({
            ...state,
            activeBreakoutRoomsManager: {
              active: true,
              mode: 'create',
            },
          }))
        }>
        {isBreakoutActive ? 'Open breakout manager' : 'Create breakout rooms'}
      </ControlButton>
    )
  }

  if (isBreakoutActive) {
    if (
      currentFrame?.type !== FrameType.BREAKOUT &&
      !currentFrame?.content?.breakoutFrameId
    ) {
      if (sessionBreakoutFrameId && isBreakoutActive) {
        return (
          <ControlButton
            tooltipProps={{
              content: 'View Breakout',
            }}
            buttonProps={{
              size: 'sm',
              variant: 'solid',
              className: cn('gap-2 justify-between'),
              startContent: <VscMultipleWindows size={22} />,
            }}
            onClick={() => setCurrentFrame(sessionBreakoutFrame as IFrame)}>
            View Breakout
          </ControlButton>
        )
      }
    }

    return (
      <EndBreakoutButton key="end-breakout" onEndBreakoutClick={endBreakout} />
    )
  }

  if (
    areParticipantsPresentInMeeting &&
    currentFrame &&
    currentFrame?.type === FrameType.BREAKOUT
  ) {
    return (
      <StartBreakoutButtonWithConfirmationModal
        key="start-breakout-2"
        label="Start planned breakout"
        roomsCount={defaultRoomsCount}
        participantPerGroup={defaultParticipantsPerRoom}
        breakoutDuration={defaultBreakoutDuration}
        onStartBreakoutClick={(breakoutConfig) =>
          onBreakoutStartOnBreakoutSlide({
            ...breakoutConfig,
            breakoutFrameId: currentFrame.id,
            activityId: currentFrame?.content?.groupActivityId,
            activities: currentFrame?.content?.breakoutRooms,
          })
        }
      />
    )
  }

  return null
}
