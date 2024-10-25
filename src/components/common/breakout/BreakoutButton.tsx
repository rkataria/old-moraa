import { useEffect } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import { VscMultipleWindows } from 'react-icons/vsc'

import { BreakoutButtonWithConfirmationModal } from './BreakoutButtonWithConfirmationModal'
import { ControlButton } from '../ControlButton'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { SessionService } from '@/services/session.service'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { PresentationStatuses } from '@/types/event-session.type'
import { IFrame } from '@/types/frame.type'
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
    realtimeChannel,
    setDyteStates,
  } = useEventSession()

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
    presentationStatus === PresentationStatuses.STOPPED
  ) {
    return (
      <ControlButton
        tooltipProps={{
          content: isBreakoutActive ? 'View Breakout' : 'Start Breakout',
        }}
        buttonProps={{
          size: 'sm',
          variant: 'solid',
          // isIconOnly: true,
          className: cn('gap-2 justify-between live-button', {
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
        Breakout
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
              isIconOnly: true,
              className: cn('gap-2 p-1 justify-between live-button'),
            }}
            onClick={() => setCurrentFrame(sessionBreakoutFrame as IFrame)}>
            <VscMultipleWindows size={22} />
          </ControlButton>
        )
      }
    }

    return (
      <BreakoutButtonWithConfirmationModal
        key="end-breakout"
        label="End breakout"
        onEndBreakoutClick={onBreakoutEnd}
      />
    )
  }

  if (
    currentFrame &&
    (currentFrame?.content?.breakoutFrameId ||
      currentFrame?.type === FrameType.BREAKOUT)
  ) {
    return (
      <BreakoutButtonWithConfirmationModal
        key="start-breakout-2"
        label="Start breakout"
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
