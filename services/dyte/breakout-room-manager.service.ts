import { type BreakoutRoomsManager } from '@dytesdk/react-ui-kit'
import chunk from 'lodash.chunk'

import type DyteClient from '@dytesdk/web-core'

type CreateAndAutoAssignBreakoutRoomsArgs = {
  groupSize?: number
  roomsCount?: number
  meeting: DyteClient
  stateManager: BreakoutRoomsManager
}

export const createAndAutoAssignBreakoutRooms = async ({
  groupSize: argGroupSize,
  roomsCount,
  meeting,
  stateManager,
}: CreateAndAutoAssignBreakoutRoomsArgs) => {
  if (argGroupSize === undefined && roomsCount === undefined) {
    throw new Error('Either groupSize or roomsCount must be provided')
  }

  stateManager.unassignParticipants(
    meeting.participants.all
      .toArray()
      .filter(
        (participant) =>
          participant.customParticipantId !== meeting.self.customParticipantId
      )
      .map((p) => p.customParticipantId!)
  )
  const participants = stateManager.unassignedParticipants.filter(
    (participant) =>
      participant.customParticipantId !== meeting.self.customParticipantId
  )
  stateManager.assignParticipantsToMeeting(
    [meeting.self.customParticipantId],
    meeting.connectedMeetings.parentMeeting.id || ''
  )

  if (participants.length === 0) return

  const getGroupSize = () => {
    if (argGroupSize) return argGroupSize

    return Math.ceil(participants.length / roomsCount!)
  }

  const groupSize = getGroupSize()

  const participantGroups = chunk(participants, groupSize)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createdMeetings = stateManager.addNewMeetings(
    roomsCount || participantGroups.length
  )

  createdMeetings.forEach((createdMeeting, index) => {
    const breakoutRoomParticipants = participantGroups[index]

    if (breakoutRoomParticipants?.length > 0) {
      stateManager.assignParticipantsToMeeting(
        breakoutRoomParticipants.map((p) => p.customParticipantId!),
        createdMeeting.id
      )
    }
  })

  // eslint-disable-next-line consistent-return
  return stateManager.applyChanges(meeting)
}

type StopBreakoutRoomsArgs = {
  meeting: DyteClient
  stateManager: BreakoutRoomsManager
}

export const stopBreakoutRooms = async ({
  meeting,
  stateManager,
}: StopBreakoutRoomsArgs) => {
  const participants: Array<string> = []
  meeting.connectedMeetings.meetings.forEach((m) =>
    m.participants.forEach((participant) =>
      participant.customParticipantId
        ? participants.push(participant.customParticipantId)
        : null
    )
  )

  stateManager.unassignAllParticipants()
  stateManager.assignParticipantsToMeeting(
    participants,
    meeting.connectedMeetings.parentMeeting.id || ''
  )

  stateManager.allConnectedMeetings.forEach((m) =>
    stateManager.deleteMeeting(m.id)
  )

  return stateManager.applyChanges(meeting)
}

export const moveHostToRoom = async ({
  meeting,
  stateManager,
  destinationMeetingId,
}: StopBreakoutRoomsArgs & { destinationMeetingId: string }) => {
  stateManager.unassignParticipants([meeting.self.customParticipantId])
  stateManager.assignParticipantsToMeeting(
    [meeting.self.customParticipantId],
    destinationMeetingId
  )

  return stateManager.applyChanges(meeting)
}
