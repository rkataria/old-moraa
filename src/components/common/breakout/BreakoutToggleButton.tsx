import { useEffect } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import { VscMultipleWindows } from 'react-icons/vsc'

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
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export function BreakoutToggleButton({
  onClick,
  label,
  color,
}: {
  onClick: () => void
  label: string
  color?: 'success' | 'danger'
}) {
  const bgColor = {
    danger: '!bg-red-500 hover:!bg-red-500',
    success: '!bg-green-500 hover:!bg-green-500',
    none: '',
  }[color || 'none']

  return (
    <ControlButton
      tooltipProps={{
        content: label,
      }}
      buttonProps={{
        size: 'sm',
        variant: 'solid',
        isIconOnly: true,
        className: cn('gap-2 p-1 justify-between live-button', bgColor),
      }}
      onClick={onClick}>
      <VscMultipleWindows size={22} className="text-white" />
    </ControlButton>
  )
}

export function BreakoutHeaderButton() {
  const dyteMeeting = useDyteMeeting()
  const {
    isHost,
    currentFrame,
    presentationStatus,
    setCurrentFrame,
    realtimeChannel,
  } = useEventSession()

  const { getFrameById } = useEventContext()

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

  const onBreakoutStartOnBreakoutSlide = async (breakoutFrame: IFrame) => {
    if (!meetingId) return

    try {
      await breakoutRoomsInstance?.startBreakoutRooms({
        /*
         * Because the breakoutRooms array only exist on breakout room type so it won't get sent for a breakout group type
         * And the `participantPerGroup` only exist on breakout group type so it won't get sent for a breakout room type
         */
        roomsCount: breakoutFrame?.content?.breakoutRooms?.length,
        participantsPerRoom: breakoutFrame?.config.participantPerGroup,
      })
      dispatch(
        updateMeetingSessionDataAction({
          breakoutFrameId:
            presentationStatus === PresentationStatuses.STARTED
              ? breakoutFrame?.id
              : null,
        })
      )
      if (breakoutFrame?.config.breakoutDuration && realtimeChannel) {
        realtimeChannel.send({
          type: 'broadcast',
          event: 'timer-start-event',
          payload: {
            duration: {
              total: (breakoutFrame?.config?.breakoutDuration as number) * 60,
              remaining:
                (breakoutFrame?.config?.breakoutDuration as number) * 60,
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
              currentFrameId: breakoutFrame?.content!.breakoutRooms?.[index]
                .activityId
                ? breakoutFrame?.content!.breakoutRooms?.[index].activityId
                : breakoutFrame?.content!.groupActivityId,
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

  if (
    currentFrame?.type !== FrameType.BREAKOUT &&
    !currentFrame?.content?.breakoutFrameId
  ) {
    if (sessionBreakoutFrameId && isBreakoutActive) {
      return (
        <BreakoutToggleButton
          label="View breakout"
          onClick={() => setCurrentFrame(sessionBreakoutFrame as IFrame)}
        />
      )
    }

    return null
  }

  // This condition is for any frame which is part of breakout. Basically activity frame.
  if (!isBreakoutActive && currentFrame?.content?.breakoutFrameId) {
    return (
      <BreakoutToggleButton
        label="Start breakout"
        onClick={() =>
          onBreakoutStartOnBreakoutSlide(
            getFrameById(currentFrame?.content?.breakoutFrameId as string)
          )
        }
      />
    )
  }

  if (!isBreakoutActive) {
    return (
      <BreakoutToggleButton
        label="Start breakout"
        onClick={() => onBreakoutStartOnBreakoutSlide(currentFrame)}
      />
    )
  }

  if (
    currentFrame?.content?.breakoutFrameId ||
    currentFrame?.content?.breakoutFrameId === sessionBreakoutFrameId
  ) {
    return (
      <BreakoutToggleButton
        label="End breakout"
        color="danger"
        onClick={onBreakoutEnd}
      />
    )
  }

  if (!sessionBreakoutFrameId) {
    return (
      <BreakoutToggleButton
        label="End breakout"
        color="danger"
        onClick={onBreakoutEnd}
      />
    )
  }

  if (sessionBreakoutFrameId === currentFrame?.id) {
    return (
      <BreakoutToggleButton
        label="End breakout"
        color="danger"
        onClick={onBreakoutEnd}
      />
    )
  }

  return null
}
