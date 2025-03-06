/* eslint-disable @typescript-eslint/no-explicit-any */
import { BreakoutRoomsManager } from '@dytesdk/react-ui-kit'
import DyteClient from '@dytesdk/web-core'
// eslint-disable-next-line import/no-extraneous-dependencies

import { shuffleAndGroup } from './shuffle-array'

import { AssignmentOption } from '@/components/frames/frame-types/Breakout/AssignmentOptionSelector'

export type StartBreakoutConfig = {
  participantPerGroup?: number
  roomsCount?: number
  assignmentOption: AssignmentOption
}

export class BreakoutRooms {
  private manager: BreakoutRoomsManager
  private dyteClient: DyteClient

  constructor(dyteClient: DyteClient) {
    this.manager = new BreakoutRoomsManager()
    this.dyteClient = dyteClient
  }

  private updateLocalState = (payload: any) => {
    this.manager.updateCurrentState(payload)
  }

  /**
   * This method can be used to manually trigger the `stateUpdate` event. This help to keep the state of `this.manager` in sync with the dyte's state.
   * @returns {Promise} This promise is resolved once the connected meetings are fetched wait of 400ms is elapsed as this will trigger the `stateUpdate` event
   */
  private async cleanupBreakoutManagerInstance() {
    this.dyteClient.connectedMeetings.removeListener(
      'stateUpdate',
      this.updateLocalState
    )
    this.manager = new BreakoutRoomsManager()
    this.dyteClient.connectedMeetings.addListener(
      'stateUpdate',
      this.updateLocalState
    )
    await this.dyteClient.connectedMeetings.getConnectedMeetings()
  }

  async moveParticipantToAnotherRoom(
    customParticipantId: string,
    destinationMeetingId: string
  ) {
    await this.cleanupBreakoutManagerInstance()
    const allMeetings = [
      ...this.dyteClient.connectedMeetings.meetings,
      this.dyteClient.connectedMeetings.parentMeeting,
    ]

    const sourceMeeting = allMeetings.find((meet) =>
      meet.participants.some(
        (participant) => participant.customParticipantId === customParticipantId
      )
    )
    const participantId = allMeetings
      .find((meet) => meet.id === sourceMeeting?.id)
      ?.participants.find(
        (participant) => participant.customParticipantId === customParticipantId
      )?.id as string

    this.dyteClient.connectedMeetings.moveParticipants(
      sourceMeeting?.id ||
        this.dyteClient.connectedMeetings.parentMeeting.id ||
        '',
      destinationMeetingId,
      [participantId]
    )

    await this.cleanupBreakoutManagerInstance()
  }

  async startBreakoutRooms({
    participantPerGroup,
    roomsCount,
    assignmentOption,
  }: StartBreakoutConfig) {
    await this.cleanupBreakoutManagerInstance()

    if (participantPerGroup === undefined && roomsCount === undefined) {
      throw new Error(
        'Either participantPerGroup or roomsCount must be provided'
      )
    }

    const existingConnectedMeetings =
      await this.dyteClient.connectedMeetings.getConnectedMeetings()
    if (existingConnectedMeetings.meetings.length > 0) {
      await this.endBreakoutRooms()
    }

    const participants = this.dyteClient.participants.joined.toArray()

    if (participants.length === 0) return

    const getGroupSize = () => {
      if (participantPerGroup) return participantPerGroup

      return Math.ceil(participants.length / roomsCount!) || 1
    }

    const groupSize = getGroupSize()

    const participantGroups = shuffleAndGroup(
      participants.map((p) => p.customParticipantId!).sort(),
      groupSize
    )

    this.manager.addNewMeetings(roomsCount || participantGroups.length)

    await this.manager.applyChanges(this.dyteClient)

    await this.cleanupBreakoutManagerInstance()

    this.dyteClient.connectedMeetings.meetings.forEach(
      (createdMeeting, index) => {
        if (!createdMeeting.id) return

        const breakoutRoomParticipants = participantGroups[index]
        this.manager.updateMeetingTitle(createdMeeting.id, 'Breakout Room')

        if (
          breakoutRoomParticipants?.length > 0 &&
          assignmentOption === 'auto'
        ) {
          this.manager.assignParticipantsToMeeting(
            breakoutRoomParticipants.map((p) => p),
            createdMeeting.id
          )
        }
      }
    )

    await this.manager.applyChanges(this.dyteClient)

    await this.cleanupBreakoutManagerInstance()
  }

  async endBreakoutRooms() {
    await this.cleanupBreakoutManagerInstance()

    this.manager.unassignAllParticipants()
    this.manager.applyChanges(this.dyteClient)
    await this.cleanupBreakoutManagerInstance()

    if (
      this.dyteClient.connectedMeetings.parentMeeting.id !==
      this.dyteClient.meta.meetingId
    ) {
      this.dyteClient.connectedMeetings.once('meetingChanged', async () => {
        this.manager.allConnectedMeetings.forEach((m) =>
          this.manager.deleteMeeting(m.id)
        )
        this.manager.applyChanges(this.dyteClient)
        await this.cleanupBreakoutManagerInstance()
      })
    } else {
      this.manager.allConnectedMeetings.forEach((m) =>
        this.manager.deleteMeeting(m.id)
      )
      this.manager.applyChanges(this.dyteClient)
      await this.cleanupBreakoutManagerInstance()
    }
  }

  async joinRoom(destinationMeetId: string) {
    await this.cleanupBreakoutManagerInstance()
    this.manager.assignParticipantsToMeeting(
      [this.dyteClient.self.customParticipantId],
      destinationMeetId
    )
    await this.manager.applyChanges(this.dyteClient)
    await this.cleanupBreakoutManagerInstance()
  }
}
