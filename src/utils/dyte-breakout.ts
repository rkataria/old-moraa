/* eslint-disable @typescript-eslint/no-explicit-any */
import { BreakoutRoomsManager } from '@dytesdk/react-ui-kit'
import DyteClient from '@dytesdk/web-core'

import {
  createAndAutoAssignBreakoutRooms,
  moveHostToRoom,
  stopBreakoutRooms,
} from '@/services/dyte/breakout-room-manager.service'

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

    this.dyteClient.connectedMeetings.addListener(
      'stateUpdate',
      this.updateLocalState
    )
    this.dyteClient.connectedMeetings.getConnectedMeetings()
  }

  private updateLocalState = (payload: any) => {
    this.manager.updateCurrentState(payload)
  }

  /**
   * This method can be used to manually trigger the `stateUpdate` event. This help to keep the state of `this.manager` in sync with the dyte's state.
   * @returns {Promise} This promise is resolved once the connected meetings are fetched wait of 400ms is elapsed as this will trigger the `stateUpdate` event
   */
  private async cleanupBreakoutManagerInstance() {
    this.manager = new BreakoutRoomsManager()

    return new Promise((resolve) => {
      this.dyteClient.connectedMeetings.getConnectedMeetings().then(() => {
        setTimeout(resolve, 400)
      })
    })
  }

  async startBreakoutWithRandomParticipants() {
    await this.cleanupBreakoutManagerInstance()
    this.manager.addNewMeetings(3)
    this.manager.assignParticipantsRandomly()
    await this.manager.applyChanges(this.dyteClient)
  }

  async endBreakout() {
    await this.cleanupBreakoutManagerInstance()
    await stopBreakoutRooms({
      meeting: this.dyteClient,
      stateManager: this.manager,
    })
    await this.cleanupBreakoutManagerInstance()
  }

  async moveParticipantToAnotherRoom(
    participantId: string,
    destinationMeetingId: string
  ) {
    const sourceMeeting = this.dyteClient.connectedMeetings.meetings.find(
      (meet) =>
        meet.participants.some(
          (participant) => participant.id === participantId
        )
    )
    this.dyteClient.connectedMeetings.moveParticipants(
      sourceMeeting?.id ||
        this.dyteClient.connectedMeetings.parentMeeting.id ||
        '',
      destinationMeetingId,
      [participantId]
    )

    return this.cleanupBreakoutManagerInstance()
  }

  async startBreakoutRooms({
    participantsPerRoom,
    roomsCount,
  }: StartBreakoutConfig) {
    await this.cleanupBreakoutManagerInstance()
    await createAndAutoAssignBreakoutRooms({
      roomsCount,
      groupSize: participantsPerRoom,
      meeting: this.dyteClient,
      stateManager: this.manager,
    })
    await this.cleanupBreakoutManagerInstance()
  }

  async endBreakoutRooms() {
    await this.cleanupBreakoutManagerInstance()
    await stopBreakoutRooms({
      meeting: this.dyteClient,
      stateManager: this.manager,
    })
    await this.cleanupBreakoutManagerInstance()
  }

  async joinRoom(meetId: string) {
    await this.cleanupBreakoutManagerInstance()
    await moveHostToRoom({
      meeting: this.dyteClient,
      stateManager: this.manager,
      destinationMeetingId: meetId,
    })
    await this.cleanupBreakoutManagerInstance()
  }
}
