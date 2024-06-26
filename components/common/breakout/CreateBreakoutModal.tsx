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

import { FontSizeControl } from '../content-types/Canvas/FontSizeControl'

import { useBreakoutRoomsManagerWithLatestMeetingState } from '@/contexts/BreakoutRoomsManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { PresentationStatuses } from '@/types/event-session.type'

export type CreateBreakoutModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  defaultParticipantsPerRoom?: number
}

export function CreateBreakoutModal({
  open,
  setOpen,
  defaultParticipantsPerRoom,
}: CreateBreakoutModalProps) {
  const { meeting } = useDyteMeeting()

  const totalParticipants = meeting.participants.count
  const [participantsPerRoom, setParticipantsPerRoom] = useState(
    defaultParticipantsPerRoom ||
      (totalParticipants / 5 > 1 ? totalParticipants / 5 : 1)
  )

  const { currentFrame, presentationStatus, setBreakoutSlideId } =
    useEventSession()

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
            className="flex items-center justify-between mb-4 pr-10"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}>
            <p>Min. participants per group</p>
            <div className="w-10">
              <FontSizeControl
                size={5.0}
                onFontSizeChange={(count) => setParticipantsPerRoom(count)}
                fullWidth
              />
            </div>
          </div>
          <div
            className="flex items-center justify-between mb-4 pr-10"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}>
            <p>Duration</p>
            <div className="w-10">
              <FontSizeControl
                size={5.0}
                onFontSizeChange={(count) => setParticipantsPerRoom(count)}
                isTime
                fullWidth
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            variant="solid"
            onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="primary" variant="solid" onClick={startBreakoutRooms}>
            Start Breakout
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
