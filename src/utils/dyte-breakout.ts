/* eslint-disable @typescript-eslint/no-explicit-any */
import { BreakoutRoomsManager } from '@dytesdk/react-ui-kit'
import DyteClient from '@dytesdk/web-core'
import chunk from 'lodash.chunk'

export type StartBreakoutConfig = {
  participantsPerRoom?: number
  roomsCount?: number
  roomNames?: string[]
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

  async startBreakoutWithRandomParticipants() {
    await this.cleanupBreakoutManagerInstance()
    await this.manager.addNewMeetings(3)
    await this.manager.assignParticipantsRandomly()
    await this.manager.applyChanges(this.dyteClient)
    await this.cleanupBreakoutManagerInstance()
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
    participantsPerRoom,
    roomsCount,
  }: StartBreakoutConfig) {
    await this.cleanupBreakoutManagerInstance()
    if (participantsPerRoom === undefined && roomsCount === undefined) {
      throw new Error(
        'Either participantsPerRoom or roomsCount must be provided'
      )
    }

    this.manager.unassignParticipants(
      this.dyteClient.participants.all
        .toArray()
        .filter(
          (participant) =>
            participant.customParticipantId !==
            this.dyteClient.self.customParticipantId
        )
        .map((p) => p.customParticipantId!)
    )

    const participants = this.manager.unassignedParticipants.filter(
      (participant) =>
        participant.customParticipantId !==
        this.dyteClient.self.customParticipantId
    )

    this.manager.assignParticipantsToMeeting(
      [this.dyteClient.self.customParticipantId],
      this.dyteClient.connectedMeetings.parentMeeting.id || ''
    )

    if (participants.length === 0) return

    const getGroupSize = () => {
      if (participantsPerRoom) return participantsPerRoom

      return Math.ceil(participants.length / roomsCount!)
    }

    const groupSize = getGroupSize()

    const participantGroups = chunk(participants, groupSize)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const createdMeetings = this.manager.addNewMeetings(
      roomsCount || participantGroups.length
    )

    createdMeetings.forEach((createdMeeting, index) => {
      const breakoutRoomParticipants = participantGroups[index]
      this.manager.updateMeetingTitle(createdMeeting.id, 'Breakout Room')

      if (breakoutRoomParticipants?.length > 0) {
        this.manager.assignParticipantsToMeeting(
          breakoutRoomParticipants.map((p) => p.customParticipantId!),
          createdMeeting.id
        )
      }
    })

    // eslint-disable-next-line consistent-return
    await this.manager.applyChanges(this.dyteClient)
    await this.cleanupBreakoutManagerInstance()
  }

  async endBreakoutRooms() {
    await this.cleanupBreakoutManagerInstance()

    this.manager.unassignAllParticipants()
    this.manager.allConnectedMeetings.forEach((m) =>
      this.manager.deleteMeeting(m.id)
    )

    this.manager.applyChanges(this.dyteClient)
    await this.cleanupBreakoutManagerInstance()
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
