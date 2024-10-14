/* eslint-disable @typescript-eslint/no-explicit-any */
import { BreakoutRoomsManager } from '@dytesdk/react-ui-kit'
import DyteClient from '@dytesdk/web-core'
import chunk from 'lodash.chunk'

import {
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
    const parentMeetingId = this.dyteClient.connectedMeetings.parentMeeting.id
    this.dyteClient.connectedMeetings.meetings.forEach((meeting) => {
      this.dyteClient.connectedMeetings.moveParticipants(
        meeting.id || '',
        parentMeetingId || '',
        meeting.participants.map((participant) => participant.id || '')
      )
    })
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
      sourceMeeting?.id || '',
      destinationMeetingId,
      [participantId]
    )

    return this.cleanupBreakoutManagerInstance()
  }

  async startBreakoutRooms({
    participantsPerRoom,
    roomsCount,
  }: StartBreakoutConfig) {
    const parentMeetingId = this.dyteClient.connectedMeetings.parentMeeting.id

    const participants = this.dyteClient.participants.joined.toArray()
    const getGroupSize = () => {
      if (participantsPerRoom) return participantsPerRoom

      return Math.ceil(participants.length / roomsCount!)
    }
    const groupSize = getGroupSize()

    const participantGroups = chunk(participants, groupSize)

    const createdMeetings =
      await this.dyteClient.connectedMeetings.createMeetings(
        new Array(roomsCount || participantGroups.length)
          .fill('')
          .map((_, idx) => ({
            title: `Room ${idx + 1}`,
          }))
      )

    createdMeetings.forEach(async (createdMeeting, index) => {
      const breakoutRoomParticipants = participantGroups[index]

      if (breakoutRoomParticipants?.length > 0) {
        await this.dyteClient.connectedMeetings.moveParticipants(
          parentMeetingId || '',
          createdMeeting.id,
          breakoutRoomParticipants.map((p) => p.customParticipantId!)
        )
      }
    })
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
