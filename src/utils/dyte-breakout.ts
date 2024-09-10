/* eslint-disable @typescript-eslint/no-explicit-any */
import { BreakoutRoomsManager } from '@dytesdk/react-ui-kit'
import DyteClient from '@dytesdk/web-core'

import {
  createAndAutoAssignBreakoutRooms,
  moveHostToRoom,
  stopBreakoutRooms,
} from '@/services/dyte/breakout-room-manager.service'

type StartBreakoutConfig =
  | {
      participantsPerRoom?: number
      roomsCount?: never
    }
  | {
      participantsPerRoom?: never
      roomsCount?: number
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

  // private cleanup() {
  //   this.meeting.connectedMeetings.removeListener(
  //     'stateUpdate',
  //     this.updateLocalState
  //   )
  // }

  private updateLocalState = (payload: any) => {
    this.manager.updateCurrentState(payload)
  }

  /**
   * This method can be used to manually trigger the `stateUpdate` event. This help to keep the state of `this.manager` in sync with the dyte's state.
   * @returns {Promise} This promise is resolved once the connected meetings are fetched wait of 500ms is elapsed as this will trigger the `stateUpdate` event
   */
  private async getConnectedMeetings() {
    return new Promise((resolve) => {
      this.dyteClient.connectedMeetings.getConnectedMeetings().then(() => {
        setTimeout(resolve, 400)
      })
    })
  }

  async startBreakoutWithRandomParticipants() {
    await this.getConnectedMeetings()
    this.manager.addNewMeetings(3)
    this.manager.assignParticipantsRandomly()
    await this.manager.applyChanges(this.dyteClient)
  }

  async endBreakout() {
    await this.getConnectedMeetings()
    await stopBreakoutRooms({
      meeting: this.dyteClient,
      stateManager: this.manager,
    })
    await this.getConnectedMeetings()
  }

  async startBreakoutRooms({
    participantsPerRoom,
    roomsCount,
  }: StartBreakoutConfig) {
    await this.getConnectedMeetings()
    await createAndAutoAssignBreakoutRooms({
      roomsCount,
      groupSize: participantsPerRoom,
      meeting: this.dyteClient,
      stateManager: this.manager,
    })
    await this.getConnectedMeetings()
  }

  async endBreakoutRooms() {
    await this.getConnectedMeetings()
    await stopBreakoutRooms({
      meeting: this.dyteClient,
      stateManager: this.manager,
    })
    await this.getConnectedMeetings()
  }

  async joinRoom(meetId: string) {
    await this.getConnectedMeetings()
    await moveHostToRoom({
      meeting: this.dyteClient,
      stateManager: this.manager,
      destinationMeetingId: meetId,
    })
    await this.getConnectedMeetings()
  }
}
