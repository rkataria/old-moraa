/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'

import { TwoWayNumberCounter } from '../content-types/Canvas/FontSizeControl'

import { useBreakoutRoomsManagerWithLatestMeetingState } from '@/contexts/BreakoutRoomsManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { PresentationStatuses } from '@/types/event-session.type'

export type CreateBreakoutModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

function distributeParticipants(participants: number, rooms: number) {
  if (participants <= rooms) return 1

  return Math.floor(participants / rooms)
}

export function CreateBreakoutModal({
  open,
  setOpen,
}: CreateBreakoutModalProps) {
  const { meeting } = useDyteMeeting()
  const { currentFrame, presentationStatus, setBreakoutSlideId } =
    useEventSession()

  const totalParticipants = meeting.participants.count

  const defaultParticipantsPerRoom = distributeParticipants(
    totalParticipants,
    (currentFrame?.content?.breakoutDetails?.length as number) ||
      Math.ceil(totalParticipants / 10)
  )

  const [participantsPerRoom, setParticipantsPerRoom] = useState(
    defaultParticipantsPerRoom
  )
  const [breakoutDuration, setBreakoutDuration] = useState(5)

  const { startBreakoutRooms: _startBreakoutRooms } =
    useBreakoutRoomsManagerWithLatestMeetingState()

  const startBreakoutRooms = () => {
    _startBreakoutRooms({ participantsPerRoom })
    if (presentationStatus === PresentationStatuses.STARTED) {
      setBreakoutSlideId(currentFrame?.id || null)
    }
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen} isDismissable={false}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Breakout Configuration
        </ModalHeader>
        <ModalBody>
          <div
            className="flex items-center justify-between mb-4 pr-12"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}>
            <p>Min. participants per group</p>
            <div className="w-10">
              <TwoWayNumberCounter
                defaultCount={participantsPerRoom}
                onCountChange={(count) => setParticipantsPerRoom(count)}
                incrementStep={1}
                fullWidth
              />
            </div>
          </div>
          <div
            className="flex items-center justify-between mb-4 pr-12"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}>
            <p>Duration</p>
            <div className="w-10">
              <TwoWayNumberCounter
                defaultCount={breakoutDuration}
                onCountChange={(count) => setBreakoutDuration(count)}
                postfixLabel=" Min"
                incrementStep={5}
                fullWidth
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="bordered" onClick={() => setOpen(false)} size="sm">
            Cancel
          </Button>
          <Button
            color="primary"
            variant="solid"
            onClick={startBreakoutRooms}
            size="sm">
            Start Breakout
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
