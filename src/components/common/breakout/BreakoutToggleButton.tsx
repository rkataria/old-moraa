import { useDyteMeeting } from '@dytesdk/react-web-core'
import { Button } from '@nextui-org/react'
import { IoPeopleOutline } from 'react-icons/io5'

import { ControlButton } from '../ControlButton'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { SessionService } from '@/services/session.service'
import {
  setIsBreakoutOverviewOpenAction,
  setIsCreateBreakoutOpenAction,
  updateMeetingSessionDataAction,
} from '@/stores/slices/event/current-event/live-session.slice'
import { PresentationStatuses } from '@/types/event-session.type'
import { IFrame } from '@/types/frame.type'
import { ContentType } from '@/utils/content.util'
import { cn } from '@/utils/utils'

export function BreakoutToggleButton({
  onClick,
  isActive,
  useTextButton,
}: {
  onClick: () => void
  isActive: boolean
  useTextButton?: boolean
}) {
  const { isBreakoutActive } = useBreakoutRooms()

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: !useTextButton,
        radius: 'md',
        variant: useTextButton ? 'solid' : 'light',
        color: useTextButton ? 'success' : undefined,
        className: cn('transition-all duration-300', {
          'bg-black text-white': isActive,
        }),
        size: 'sm',
      }}
      tooltipProps={{
        label: isActive
          ? 'Hide Breakouts'
          : isBreakoutActive
            ? 'View Active Breakout'
            : 'Start Breakouts',
      }}
      onClick={() => onClick()}>
      {useTextButton ? 'Start Breakout' : <IoPeopleOutline size={20} />}
    </ControlButton>
  )
}

export function BreakoutHeaderButton() {
  const dyteMeeting = useDyteMeeting()
  const isBreakoutOverviewOpen = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isBreakoutOverviewOpen
  )
  const isCreateBreakoutOpen = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isCreateBreakoutOpen
  )
  const { isHost, currentFrame, setCurrentFrame, realtimeChannel } =
    useEventSession()

  const meetingId = useStoreSelector(
    (store) => store.event.currentEvent.meetingState.meeting.data?.id
  )
  const breakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId || null
  )
  const dispatch = useStoreDispatch()

  const { sections } = useEventContext()

  const { isBreakoutActive, isCurrentDyteMeetingInABreakoutRoom } =
    useBreakoutRooms()
  const { breakoutRoomsInstance } = useBreakoutManagerContext()

  const breakoutFrame = sections
    ?.map((section) => section.frames)
    .flat()
    .find((frame) => frame?.id === breakoutFrameId)

  const onBreakoutStartOnBreakoutSlide = async () => {
    if (!meetingId) return
    try {
      await breakoutRoomsInstance?.startBreakoutRooms({
        /*
         * Because the breakoutRooms array only exist on breakout room type so it won't get sent for a breakout group type
         * And the `participantPerGroup` only exist on breakout group type so it won't get sent for a breakout room type
         */
        roomsCount: currentFrame?.content?.breakoutRooms?.length,
        participantsPerRoom: currentFrame?.config.participantPerGroup,
      })
      dispatch(
        updateMeetingSessionDataAction({
          breakoutFrameId: currentFrame?.id || null,
        })
      )
      if (currentFrame?.config.breakoutTime) {
        setTimeout(() => {
          realtimeChannel?.send({
            type: 'broadcast',
            event: 'timer-start-event',
            payload: {
              remainingDuration:
                (currentFrame?.config?.breakoutTime as number) * 60,
            },
          })
        }, 500)
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
                currentFrame?.content!.breakoutRooms?.[index].activityId,
              presentationStatus: PresentationStatuses.STARTED,
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
      event: 'timer-stop-event',
      payload: { remainingDuration: 0 },
    })
  }

  if (!isHost) return null
  if (isCurrentDyteMeetingInABreakoutRoom) return null

  if (!isBreakoutActive && currentFrame?.type === ContentType.BREAKOUT) {
    return (
      <Button
        variant="solid"
        size="sm"
        radius="md"
        className="bg-green-500 text-white"
        onClick={onBreakoutStartOnBreakoutSlide}>
        Start Breakout
      </Button>
    )
  }

  if (!isBreakoutActive) {
    return (
      <BreakoutToggleButton
        isActive={isCreateBreakoutOpen}
        onClick={() =>
          dispatch(setIsCreateBreakoutOpenAction(!isCreateBreakoutOpen))
        }
      />
    )
  }

  if (currentFrame?.type === ContentType.BREAKOUT) {
    return (
      <Button
        color="danger"
        variant="solid"
        size="sm"
        className="!bg-red-500"
        radius="md"
        onClick={onBreakoutEnd}>
        End Breakout
      </Button>
    )
  }

  if (!breakoutFrameId) {
    return (
      <BreakoutToggleButton
        isActive={isBreakoutOverviewOpen}
        onClick={() =>
          dispatch(setIsBreakoutOverviewOpenAction(!isBreakoutOverviewOpen))
        }
      />
    )
  }

  if (breakoutFrameId) {
    return (
      <BreakoutToggleButton
        isActive={currentFrame?.id === breakoutFrameId}
        onClick={() => setCurrentFrame(breakoutFrame as IFrame)}
      />
    )
  }

  return null
}
