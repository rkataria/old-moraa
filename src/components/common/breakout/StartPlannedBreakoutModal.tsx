/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'
import toast from 'react-hot-toast'

import {
  AssignmentOption,
  AssignmentOptionSelector,
} from './AssignmentOptionSelector'
import { AssignParticipantsModal } from './AssignParticipantsModal/AssignParticipantsModal'
import { BREAKOUT_TYPES } from '../BreakoutTypePicker'
import { NumberInput } from '../NumberInput'

import { Button } from '@/components/ui/Button'
import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
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
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false)
  const { updateFrame } = useEventContext()
  const { eventRealtimeChannel, currentFrame, presentationStatus } =
    useEventSession()
  const dyteMeeting = useDyteMeeting()
  const currentParticipantCount =
    dyteMeeting.meeting.participants.joined.toArray().length
  const roomsCount = currentFrame?.content?.breakoutRooms?.length
  const participantsPerGroup = currentFrame?.config?.participantPerGroup
  const breakoutDuration = currentFrame?.config.breakoutDuration
  const assignmentOption = currentFrame?.config
    .assignmentOption as AssignmentOption
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
    assignmentOption: assignmentOption || 'auto',
  })
  const { breakoutRoomsInstance } = useBreakoutManagerContext()
  const meetingId = useStoreSelector(
    (store) => store.event.currentEvent.meetingState.meeting.data?.id
  )
  const dispatch = useStoreDispatch()

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
      assignmentOption: assignmentOption || 'auto',
    })
  }, [
    breakoutDuration,
    currentParticipantCount,
    participantsPerGroup,
    roomsCount,
    assignmentOption,
  ])

  const isConfigAlreadyProvided =
    typeof roomsCount !== 'undefined' ||
    typeof participantsPerGroup !== 'undefined'

  const DurationUI = (
    <div className="grid grid-cols-[50%_50%] gap-2">
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

  const AssignmentOptionUI = (
    <AssignmentOptionSelector
      label="How participants can join"
      layout="columns"
      assignmentOption={breakoutConfig.assignmentOption}
      disabled={currentFrame?.config.breakoutType === BREAKOUT_TYPES.GROUPS}
      onChange={(value) => {
        if (!currentFrame) return

        // Update the frame with the new breakout join method
        updateFrame({
          framePayload: {
            config: {
              ...currentFrame.config,
              assignmentOption: value,
            },
          },
          frameId: currentFrame.id,
        })

        // Update the local state
        setBreakoutConfig((conf) => ({
          ...conf,
          assignmentOption: value,
        }))
      }}
    />
  )

  const ShowConfigurationsUI = {
    rooms: (
      <div className="grid grid-cols-[50%_50%] gap-2">
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
          {breakoutConfig.roomsCount}
        </div>
      </div>
    ),
    participants_per_room: (
      <div className="grid grid-cols-[50%_50%] gap-2">
        <div>
          <p>Max participants per room:</p>
          <p className="text-xs text-gray-500">
            {Math.ceil(
              currentParticipantCount / breakoutConfig.participantPerGroup
            )}{' '}
            room(s) would be created.
          </p>
        </div>
        <div className="flex justify-center items-center">
          <NumberInput
            min={1}
            max={30}
            allowNegative={false}
            number={participantsPerGroup}
            onNumberChange={(setNumber) =>
              setBreakoutConfig((conf) => ({
                ...conf,
                participantPerGroup: setNumber,
                roomsCount: Math.floor(currentParticipantCount / setNumber),
              }))
            }
          />
        </div>
      </div>
    ),
  }

  const ConfigureRoomsUI = (
    <div className="grid grid-cols-[50%_50%] gap-2">
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
      await breakoutRoomsInstance?.startBreakoutRooms({
        /*
         * Because the breakoutRooms array only exist on breakout room type so it won't get sent for a breakout group type
         * And the `participantPerGroup` only exist on breakout group type so it won't get sent for a breakout room type
         */
        roomsCount: config.roomsCount,
        participantsPerRoom: config.participantsPerRoom,
        assignmentOption: config.assignmentOption || 'auto',
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
        title: config.activities
          ? `${config.activities.find((activity) => activity.activityId === activityId)?.name}`
          : `Breakout group ${index + 1}`,
      }))

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
          meetingTitles,
          breakoutType: 'planned',
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
              meetingTitles,
            },
            meeting_id: meetingId,
          })
        ),
      })
    } catch (err) {
      console.log('🚀 ~ onBreakoutStartOnBreakoutSlide ~ err:', err)
    }
  }

  const isParticipantJoined = (participantId: string) =>
    dyteMeeting.meeting.participants.active
      .toArray()
      .some((p) => p.customParticipantId === participantId)

  const startBreakout = () => {
    if (!startBreakoutSession) {
      return
    }

    if (!eventRealtimeChannel) {
      setOpen(false)
      startBreakoutSession({
        ...breakoutConfig,
        activities: currentFrame?.content?.breakoutRooms,
        activityId: currentFrame?.content?.groupActivityId,
        breakoutFrameId: currentFrame?.id,
      })

      return
    }

    notifyBreakoutStart(eventRealtimeChannel)
    setOpen(false)

    setTimeout(() => {
      notifyBreakoutEnd(eventRealtimeChannel)
      startBreakoutSession({
        ...breakoutConfig,
        activities: currentFrame?.content?.breakoutRooms,
        activityId: currentFrame?.content?.groupActivityId,
        breakoutFrameId: currentFrame?.id,
      })
    }, notificationDuration * 1000)
  }

  const moveParticipantsToMainRoom = async (
    newBreakoutRoomAssignments: Record<string, string[]>
  ) => {
    updateFrame({
      framePayload: {
        content: {
          ...currentFrame?.content,
          breakoutRoomAssignments: newBreakoutRoomAssignments,
        },
      },
      frameId: currentFrame?.id as string,
    })
  }

  const applyAssigParticipantsConfig = async () => {
    const breakoutRoomAssignments = (currentFrame?.content
      ?.breakoutRoomAssignments || {}) as Record<string, string[]>
    const meetings = Array.from(dyteMeeting.meeting.connectedMeetings.meetings)
    const newBreakoutRoomAssignments: Record<string, string[]> = JSON.parse(
      JSON.stringify(breakoutRoomAssignments)
    )

    if (!breakoutRoomAssignments) return

    Object.keys(breakoutRoomAssignments).forEach((roomId, index) => {
      const participants = breakoutRoomAssignments[roomId] || []
      const meetingToJoin = meetings[index]

      if (!meetingToJoin?.id) return

      if (participants.length === 0) return

      participants.forEach((participantId: string) => {
        if (!participantId) return

        if (!isParticipantJoined(participantId)) {
          newBreakoutRoomAssignments[roomId] = newBreakoutRoomAssignments[
            roomId
          ].filter((id) => id !== participantId)

          return
        }

        breakoutRoomsInstance?.moveParticipantToAnotherRoom(
          participantId,
          meetingToJoin.id!
        )
      })
    })

    await moveParticipantsToMainRoom(newBreakoutRoomAssignments)

    toast.success('Participants assigned successfully')
  }

  return (
    <>
      <Modal size="lg" isOpen={open} onOpenChange={setOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Start Breakout
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-6">
                  {isConfigAlreadyProvided
                    ? ShowConfigurationsUI[
                        participantsPerGroup ? 'participants_per_room' : 'rooms'
                      ]
                    : ConfigureRoomsUI}
                  {DurationUI}
                  {AssignmentOptionUI}
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
                <Button
                  color="primary"
                  size="sm"
                  onPress={() => {
                    if (assignmentOption === 'manual') {
                      setOpenAssignmentModal(true)

                      return
                    }

                    startBreakout()
                  }}>
                  Start
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <AssignParticipantsModal
        open={openAssignmentModal}
        actions={
          <div className="flex justify-between items-center w-full">
            <p className="text-gray-600 text-xs">
              Inactive participants will be moved to the main room if they are
              assigned to any breakout room.
            </p>
            <div className="flex justify-end items-center gap-2">
              <Button
                color="danger"
                size="sm"
                onPress={() => {
                  startBreakout()
                  setOpenAssignmentModal(false)
                }}>
                Skip
              </Button>
              <Button
                color="primary"
                size="sm"
                onPress={() => {
                  startBreakout()
                  setTimeout(() => {
                    applyAssigParticipantsConfig()
                  }, 6000)
                  setOpenAssignmentModal(false)
                }}>
                Use this configuration
              </Button>
            </div>
          </div>
        }
        setOpen={setOpenAssignmentModal}
      />
    </>
  )
}
