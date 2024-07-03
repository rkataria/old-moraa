/* eslint-disable @typescript-eslint/no-explicit-any */
import { BreakoutRoomsManager } from '@dytesdk/react-ui-kit'
import DyteClient from '@dytesdk/web-core'

import {
  createAndAutoAssignBreakoutRooms,
  moveHostToRoom,
  stopBreakoutRooms,
} from '@/services/dyte/breakout-room-manager.service'

export class BreakoutRooms {
  private manager: BreakoutRoomsManager
  private meeting: DyteClient

  constructor(meeting: DyteClient) {
    this.manager = new BreakoutRoomsManager()
    this.meeting = meeting

    this.meeting.connectedMeetings.addListener(
      'stateUpdate',
      this.updateLocalState
    )
    this.meeting.connectedMeetings.getConnectedMeetings()
  }

  private cleanup() {
    this.meeting.connectedMeetings.removeListener(
      'stateUpdate',
      this.updateLocalState
    )
  }

  private updateLocalState = (payload: any) => {
    this.manager.updateCurrentState(payload)
  }

  async startBreakoutWithRandomParticipants() {
    await this.meeting.connectedMeetings.getConnectedMeetings()
    this.manager.addNewMeetings(3)

    // assign participants randomly to the three rooms
    this.manager.assignParticipantsRandomly()

    // start breakout session
    await this.manager.applyChanges(this.meeting)
  }

  async endBreakout() {
    await this.meeting.connectedMeetings.getConnectedMeetings()
    await stopBreakoutRooms({
      meeting: this.meeting,
      stateManager: this.manager,
    })
    await this.meeting.connectedMeetings.getConnectedMeetings()
    this.cleanup()
  }

  async startBreakoutRooms({ participantsPerRoom = 1, roomsCount = 2 }) {
    await this.meeting.connectedMeetings.getConnectedMeetings()
    await createAndAutoAssignBreakoutRooms({
      groupSize: participantsPerRoom,
      meeting: this.meeting,
      stateManager: this.manager,
      roomsCount,
    })
    await this.meeting.connectedMeetings.getConnectedMeetings()
  }

  async endBreakoutRooms() {
    await this.meeting.connectedMeetings.getConnectedMeetings()
    await stopBreakoutRooms({
      meeting: this.meeting,
      stateManager: this.manager,
    })
    await this.meeting.connectedMeetings.getConnectedMeetings()
  }

  async joinRoom(meetId: string) {
    await this.meeting.connectedMeetings.getConnectedMeetings()
    await moveHostToRoom({
      meeting: this.meeting,
      stateManager: this.manager,
      destinationMeetingId: meetId,
    })
    await this.meeting.connectedMeetings.getConnectedMeetings()
  }
}
