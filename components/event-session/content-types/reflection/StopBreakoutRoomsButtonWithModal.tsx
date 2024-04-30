'use client'

import { useDyteMeeting } from '@dytesdk/react-web-core'

import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react'

import {
  useBreakoutRooms,
  useBreakoutRoomsManagerWithLatestMeetingState,
} from '@/contexts/BreakoutRoomsManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { stopBreakoutRooms } from '@/services/dyte/breakout-room-manager.service'

function StopBreakoutModal() {
  const { meeting: dyteMeeting } = useDyteMeeting()
  const { breakoutRoomsManager } =
    useBreakoutRoomsManagerWithLatestMeetingState()

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader>Start Breakout</ModalHeader>
          <ModalBody>This will stop the breakout rooms</ModalBody>
          <ModalFooter>
            <Button onPress={onClose} variant="light" color="danger">
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              onPress={() => {
                stopBreakoutRooms({
                  meeting: dyteMeeting,
                  stateManager: breakoutRoomsManager,
                })
                onClose()
              }}>
              Stop Breakout
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  )
}

export function StopBreakoutRoomsButtonWithModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const { isHost } = useEventSession()

  const { isBreakoutActive, isCurrentDyteMeetingInABreakoutRoom } =
    useBreakoutRooms()

  if (isCurrentDyteMeetingInABreakoutRoom) return null
  if (!isHost) return null
  if (!isBreakoutActive) return null

  return (
    <>
      <Button onPress={onOpen} variant="ghost" color="danger">
        Stop Breakout
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <StopBreakoutModal />
      </Modal>
    </>
  )
}
