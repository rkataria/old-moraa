import { type BreakoutRoomsManager } from '@dytesdk/react-ui-kit'
import chunk from 'lodash.chunk'

import { participantIdentifier } from './breakout-room.service'

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
  const participants = meeting.participants.joined.toArray()

  // TODO: participants does not include the host, so calculating participantsWithoutSelf is not required
  const participantsWithoutSelf = participants.filter(
    (p) => participantIdentifier(p) !== participantIdentifier(meeting.self)
  )

  if (participantsWithoutSelf.length === 0) return

  const getGroupSize = () => {
    if (argGroupSize) return argGroupSize

    return Math.ceil(participantsWithoutSelf.length / roomsCount!)
  }

  const groupSize = getGroupSize()

  const participantGroups = chunk(participantsWithoutSelf, groupSize)

  const createdMeetings = stateManager.addNewMeetings(participantGroups.length)

  createdMeetings.forEach((createdMeeting, index) => {
    const breakoutRoomParticipants = participantGroups[index]

    stateManager.assignParticipantsToMeeting(
      breakoutRoomParticipants.map((p) => p.customParticipantId!),
      createdMeeting.id
    )
  })

  await stateManager.applyChanges(meeting)
}

type StopBreakoutRoomsArgs = {
  meeting: DyteClient
  stateManager: BreakoutRoomsManager
}

export const stopBreakoutRooms = async ({
  meeting,
  stateManager,
}: StopBreakoutRoomsArgs) => {
  stateManager.allConnectedMeetings.forEach((m) =>
    stateManager.deleteMeeting(m.id)
  )

  await stateManager.applyChanges(meeting)
}
