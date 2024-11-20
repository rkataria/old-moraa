import { useEffect, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'
import { useParams } from '@tanstack/react-router'

import { NumberInput } from '../NumberInput'

import { Button } from '@/components/ui/Button'
import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { SessionService } from '@/services/session.service'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { PresentationStatuses } from '@/types/event-session.type'
import {
  notificationDuration,
  notifyBreakoutEnd,
  notifyBreakoutStart,
} from '@/utils/breakout-notify.utils'
import { StartBreakoutConfig } from '@/utils/dyte-breakout'
import { getCurrentTimestamp } from '@/utils/timer.utils'

type StartPlannedBreakoutModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function StartPlannedBreakoutModal({
  open,
  setOpen,
}: StartPlannedBreakoutModalProps) {
  const { eventRealtimeChannel, currentFrame, presentationStatus } =
    useEventSession()
  const dyteMeeting = useDyteMeeting()
  const currentParticipantCount =
    dyteMeeting.meeting.participants.joined.toArray().length
  const roomsCount = currentFrame?.content?.breakoutRooms?.length
  const participantsPerGroup = currentFrame?.config?.participantPerGroup
  const breakoutDuration = currentFrame?.config.breakoutDuration
  const [breakoutConfig, setBreakoutConfig] = useState({
    participantPerGroup:
      participantsPerGroup ||
      Math.ceil(currentParticipantCount / (roomsCount || 2)),
    roomsCount:
      roomsCount ||
      (participantsPerGroup
        ? Math.floor(currentParticipantCount / participantsPerGroup)
        : 2),
    breakoutDuration: breakoutDuration || 5,
  })
  const { breakoutRoomsInstance } = useBreakoutManagerContext()
  const meetingId = useStoreSelector(
    (store) => store.event.currentEvent.meetingState.meeting.data?.id
  )
  const { eventId } = useParams({ strict: false })
  const { event } = useEvent({
    id: eventId as string,
  })
  const dispatch = useStoreDispatch()
  const { getFrameById } = useEventContext()

  useEffect(() => {
    setBreakoutConfig({
      participantPerGroup:
        participantsPerGroup ||
        Math.ceil(currentParticipantCount / (roomsCount || 2)),
      roomsCount:
        roomsCount ||
        (participantsPerGroup
          ? Math.floor(currentParticipantCount / participantsPerGroup)
          : 2),
      breakoutDuration: breakoutDuration || 5,
    })
  }, [
    breakoutDuration,
    currentParticipantCount,
    participantsPerGroup,
    roomsCount,
  ])

  const isConfigAlreadyProvided =
    typeof roomsCount !== 'undefined' ||
    typeof participantsPerGroup !== 'undefined'

  const DurationUI = (
    <div className="grid grid-cols-[60%_40%] gap-4">
      <p>Duration (mins):</p>
      <div className="flex justify-center items-center">
        <NumberInput
          min={1}
          max={30}
          allowNegative={false}
          number={breakoutConfig.breakoutDuration}
          onNumberChange={(setNumber) =>
            setBreakoutConfig((conf) => ({
              ...conf,
              breakoutDuration: setNumber,
            }))
          }
        />
      </div>
    </div>
  )

  const ShowConfigurationsUI = {
    rooms: (
      <div className="grid grid-cols-[60%_40%] gap-4">
        <div>
          <p>Number of rooms:</p>{' '}
          <p className="text-xs text-gray-500">
            Approx {Math.ceil(currentParticipantCount / (roomsCount as number))}{' '}
            participant(s) per room.
          </p>
        </div>
        <div className="flex justify-center items-center">{roomsCount}</div>
      </div>
    ),
    participants_per_room: (
      <div className="grid grid-cols-[60%_40%] gap-4">
        <div>
          <p>Max participants per room:</p>
          <p className="text-xs text-gray-500">
            {Math.ceil(
              currentParticipantCount / (participantsPerGroup as number)
            )}{' '}
            room(s) would be created.
          </p>
        </div>
        <div className="flex justify-center items-center">
          {participantsPerGroup}
        </div>
      </div>
    ),
  }

  const ConfigureRoomsUI = (
    <div className="grid grid-cols-[60%_40%] gap-4">
      <div>
        <p>Number of rooms:</p>{' '}
        <p className="text-xs text-gray-500">
          Approx{' '}
          {Math.ceil(
            currentParticipantCount / (breakoutConfig.roomsCount as number)
          )}{' '}
          participant(s) per room.
        </p>
      </div>
      <div className="flex justify-center items-center">
        <NumberInput
          min={1}
          max={currentParticipantCount}
          allowNegative={false}
          number={breakoutConfig.roomsCount}
          onNumberChange={(setNumber) =>
            setBreakoutConfig((conf) => ({
              ...conf,
              roomsCount: setNumber,
            }))
          }
        />
      </div>
    </div>
  )

  const startBreakoutSession = async (
    config: {
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
        roomsCount: config.roomsCount,
        participantsPerRoom: config.participantsPerRoom,
      })
      const connectedMeetingsToActivitiesMap: { [x: string]: string } =
        dyteMeeting.meeting.connectedMeetings.meetings.reduce(
          (acc, meet, idx) => ({
            ...acc,
            [meet.id as string]:
              config?.activities?.[idx]?.activityId ||
              config.activityId ||
              null,
          }),
          {}
        )
      const meetingTitles = Object.entries(
        connectedMeetingsToActivitiesMap
      ).map(([meetId, activityId], index) => ({
        id: meetId,
        title: `${event.name} - ${config.activityId ? `Group ${index + 1}` : getFrameById(activityId).content?.title}`,
      }))

      await dyteMeeting.meeting.connectedMeetings.updateMeetings(meetingTitles)
      await dyteMeeting.meeting.connectedMeetings.getConnectedMeetings()

      const currentTimeStamp = getCurrentTimestamp()
      const timerDuration = config.breakoutDuration
        ? config.breakoutDuration * 60
        : null
      dispatch(
        updateMeetingSessionDataAction({
          breakoutFrameId:
            presentationStatus === PresentationStatuses.STARTED
              ? config.breakoutFrameId
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

  const startBreakout = () => {
    if (!startBreakoutSession) {
      return
    }

    if (!eventRealtimeChannel) {
      setOpen(false)
      startBreakoutSession(breakoutConfig)

      return
    }

    notifyBreakoutStart(eventRealtimeChannel)
    setOpen(false)

    setTimeout(() => {
      notifyBreakoutEnd(eventRealtimeChannel)
      startBreakoutSession(breakoutConfig)
    }, notificationDuration * 1000)
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Start Planned Breakout
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6">
                {isConfigAlreadyProvided
                  ? ShowConfigurationsUI[
                      participantsPerGroup ? 'participants_per_room' : 'rooms'
                    ]
                  : ConfigureRoomsUI}
                {DurationUI}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                size="sm"
                onPress={onClose}>
                Close
              </Button>
              <Button color="primary" size="sm" onPress={startBreakout}>
                Start
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
