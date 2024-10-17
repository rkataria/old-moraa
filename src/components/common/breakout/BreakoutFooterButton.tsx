import { useEffect } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import { VscMultipleWindows } from 'react-icons/vsc'

import { BreakoutToggleButton } from './BreakoutToggleButton'
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

export function BreakoutFooterButton() {
  const dyteMeeting = useDyteMeeting()
  const {
    isHost,
    currentFrame,
    presentationStatus,
    setCurrentFrame,
    realtimeChannel,
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
      await breakoutRoomsInstance?.startBreakoutRooms({
        /*
         * Because the breakoutRooms array only exist on breakout room type so it won't get sent for a breakout group type
         * And the `participantPerGroup` only exist on breakout group type so it won't get sent for a breakout room type
         */
        roomsCount: breakoutConfig.roomsCount,
        participantsPerRoom: breakoutConfig.participantsPerRoom,
        roomNames: breakoutConfig.activities?.map((activity) => activity.name),
      })
      dispatch(
        updateMeetingSessionDataAction({
          breakoutFrameId:
            presentationStatus === PresentationStatuses.STARTED
              ? breakoutConfig.breakoutFrameId
              : null,
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
      try {
        await SessionService.deleteAllExistingBreakoutSessions({ meetingId })
      } catch {
        /* empty */
      }

      SessionService.createSessionForBreakouts({
        dyteMeetings: dyteMeeting.meeting.connectedMeetings.meetings.map(
          (meet, index) => ({
            connected_dyte_meeting_id: meet.id!,
            data: {
              currentFrameId:
                breakoutConfig.activities?.[index]?.activityId ||
                breakoutConfig.activityId,
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
            <VscMultipleWindows size={22} className="text-white" />
          </ControlButton>
        )
      }
    }

    return (
      <BreakoutToggleButton
        key="end-breakout"
        label="End breakout"
        onEndBreakoutClick={onBreakoutEnd}
      />
    )
  }

  if (presentationStatus === PresentationStatuses.STOPPED) {
    return (
      <BreakoutToggleButton
        key="start-breakout-1"
        label="Start breakout"
        onStartBreakoutClick={(breakoutConfig) =>
          onBreakoutStartOnBreakoutSlide({
            ...breakoutConfig,
          })
        }
      />
    )
  }

  if (
    currentFrame &&
    (currentFrame?.content?.breakoutFrameId ||
      currentFrame?.type === FrameType.BREAKOUT)
  ) {
    return (
      <BreakoutToggleButton
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
