import { useEffect } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import { useParams } from '@tanstack/react-router'
import { VscMultipleWindows } from 'react-icons/vsc'

import { StartBreakoutButtonWithConfirmationModal } from './StartBreakoutButtonWithConfirmationModal'

import { AppsDropdownMenuItem } from '@/components/event-session/AppsDropdownMenuItem'
import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useRealtimeChannel } from '@/contexts/RealtimeChannelContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useEvent } from '@/hooks/useEvent'
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
import { getCurrentTimestamp } from '@/utils/timer.utils'

export function BreakoutButton({ onClick }: { onClick?: () => void }) {
  const dyteMeeting = useDyteMeeting()
  const {
    isHost,
    currentFrame,
    presentationStatus,
    setCurrentFrame,
    setDyteStates,
  } = useEventSession()
  const { getFrameById } = useEventContext()
  const { eventId } = useParams({ strict: false })
  const { event } = useEvent({
    id: eventId as string,
  })
  const { eventRealtimeChannel } = useRealtimeChannel()
  const meetingId = useStoreSelector(
    (store) => store.event.currentEvent.meetingState.meeting.data?.id
  )
  // const areParticipantsPresentInMeeting = useDyteSelector(
  //   (state) => state.participants.joined.toArray().length
  // )
  const areParticipantsPresentInMeeting = true

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
    onClick?.()
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
      const meetingTitles = Object.entries(
        connectedMeetingsToActivitiesMap
      ).map(([meetId, activityId], index) => ({
        id: meetId,
        title: `${event.name} - ${breakoutConfig.activityId ? `Group ${index + 1}` : getFrameById(activityId).content?.title}`,
      }))

      await dyteMeeting.meeting.connectedMeetings.updateMeetings(meetingTitles)
      await dyteMeeting.meeting.connectedMeetings.getConnectedMeetings()

      const currentTimeStamp = getCurrentTimestamp()
      const timerDuration = breakoutConfig.breakoutDuration
        ? breakoutConfig.breakoutDuration * 60
        : null
      dispatch(
        updateMeetingSessionDataAction({
          breakoutFrameId:
            presentationStatus === PresentationStatuses.STARTED
              ? breakoutConfig.breakoutFrameId
              : null,
          connectedMeetingsToActivitiesMap,
          timerStartedStamp: currentTimeStamp,
          timerDuration,
        })
      )

      SessionService.createSessionForBreakouts({
        dyteMeetings: dyteMeeting.meeting.connectedMeetings.meetings.map(
          (meet) => ({
            connected_dyte_meeting_id: meet.id!,
            data: {
              currentFrameId: connectedMeetingsToActivitiesMap[meet.id!],
              presentationStatus,
              timerStartedStamp: currentTimeStamp,
              timerDuration,
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

  const defaultRoomsCount = currentFrame?.content?.breakoutRooms?.length
  const defaultParticipantsPerRoom = currentFrame?.config?.participantPerGroup
  const defaultBreakoutDuration = currentFrame?.config.breakoutDuration

  if (
    !sessionBreakoutFrameId &&
    presentationStatus === PresentationStatuses.STOPPED &&
    areParticipantsPresentInMeeting
  ) {
    return (
      <AppsDropdownMenuItem
        icon={<VscMultipleWindows size={24} />}
        title={isBreakoutActive ? 'Open Manager' : 'Start Breakout'}
        description={
          isBreakoutActive
            ? 'Manage breakout sessions and participants'
            : 'Start a breakout for participants'
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

    // return (
    //   <ControlButton
    //     tooltipProps={{
    //       content: isBreakoutActive
    //         ? 'Open breakout manager'
    //         : 'Create breakout rooms',
    //     }}
    //     buttonProps={{
    //       size: 'sm',
    //       variant: 'solid',
    //       className: cn('gap-2 justify-between', {
    //         '!bg-green-500 !text-white': isBreakoutActive,
    //       }),
    //     }}
    //     onClick={() =>
    //       setDyteStates((state) => ({
    //         ...state,
    //         activeBreakoutRoomsManager: {
    //           active: true,
    //           mode: 'create',
    //         },
    //       }))
    //     }>
    //     {isBreakoutActive ? 'Open breakout manager' : 'Create breakout rooms'}
    //   </ControlButton>
    // )
  }

  if (isBreakoutActive) {
    if (
      currentFrame?.type !== FrameType.BREAKOUT &&
      !currentFrame?.content?.breakoutFrameId
    ) {
      if (sessionBreakoutFrameId && isBreakoutActive) {
        return (
          <AppsDropdownMenuItem
            icon={<VscMultipleWindows size={24} />}
            title="View Breakout"
            description="View the breakout session"
            onClick={() => setCurrentFrame(sessionBreakoutFrame as IFrame)}
          />
        )

        // return (
        //   <ControlButton
        //     tooltipProps={{
        //       content: 'View Breakout',
        //     }}
        //     buttonProps={{
        //       size: 'sm',
        //       variant: 'solid',
        //       className: cn('gap-2 justify-between'),
        //       startContent: <VscMultipleWindows size={22} />,
        //     }}
        //     onClick={() => setCurrentFrame(sessionBreakoutFrame as IFrame)}>
        //     View Breakout
        //   </ControlButton>
        // )
      }
    }

    return (
      <AppsDropdownMenuItem
        icon={<VscMultipleWindows size={24} />}
        title="End Breakout"
        description="View the breakout session"
        onClick={endBreakout}
      />
    )

    // return (
    //   <EndBreakoutButton key="end-breakout" onEndBreakoutClick={endBreakout} />
    // )
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
        onStartBreakoutClick={(breakoutConfig) => {
          onClick?.()
          onBreakoutStartOnBreakoutSlide({
            ...breakoutConfig,
            breakoutFrameId: currentFrame.id,
            activityId: currentFrame?.content?.groupActivityId,
            activities: currentFrame?.content?.breakoutRooms,
          })
        }}
      />
    )
  }

  return null
}
