/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { MdGroups, MdOutlineContentCopy } from 'react-icons/md'

import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from '@nextui-org/react'

import {
  useBreakoutRooms,
  useBreakoutRoomsManagerWithLatestMeetingState,
} from '@/contexts/BreakoutRoomsManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { createAndAutoAssignBreakoutRooms } from '@/services/dyte/breakout-room-manager.service'

function GroupSizeModalContent() {
  const { meeting: dyteMeeting } = useDyteMeeting()
  const { breakoutRoomsManager } =
    useBreakoutRoomsManagerWithLatestMeetingState()

  const [groupSize, setGroupSize] = useState(2)

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader>Start breakouts with fixed group size</ModalHeader>
          <ModalBody>
            <div className="flex items-center justify-center">
              <div className="w-1/2 flex items-center gap-2">
                <Button
                  className="flex-1"
                  variant="flat"
                  onPress={() => setGroupSize(Math.max(1, groupSize - 1))}>
                  <FaMinus />
                </Button>
                <Input
                  className="flex-1 flex-shrink"
                  type="text"
                  min={1}
                  label={null}
                  value={`${groupSize}`}
                />
                <Button
                  className="flex-1"
                  variant="flat"
                  onPress={() => setGroupSize(groupSize + 1)}>
                  <FaPlus />
                </Button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose} variant="light" color="danger">
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              onPress={() => {
                createAndAutoAssignBreakoutRooms({
                  groupSize,
                  meeting: dyteMeeting,
                  stateManager: breakoutRoomsManager,
                })
                onClose()
              }}>
              Start Breakout
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  )
}

function RoomsCountModalContent() {
  const { meeting: dyteMeeting } = useDyteMeeting()
  const { breakoutRoomsManager } =
    useBreakoutRoomsManagerWithLatestMeetingState()

  const [roomsCount, setRoomsCount] = useState(2)

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader>Start breakouts with fixed group size</ModalHeader>
          <ModalBody>
            <div className="flex items-center justify-center">
              <div className="w-1/2 flex items-center gap-2">
                <Button
                  className="flex-1"
                  variant="flat"
                  onPress={() => setRoomsCount(Math.max(1, roomsCount - 1))}>
                  <FaMinus />
                </Button>
                <Input
                  className="flex-1 flex-shrink"
                  type="text"
                  min={1}
                  label={null}
                  value={`${roomsCount}`}
                />
                <Button
                  className="flex-1"
                  variant="flat"
                  onPress={() => setRoomsCount(roomsCount + 1)}>
                  <FaPlus />
                </Button>
              </div>
            </div>
            {dyteMeeting.participants.joined.toArray().length < roomsCount && (
              <div>
                Number of rooms exceeds the participants. Empty rooms will not
                be created
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose} variant="light" color="danger">
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              onPress={() => {
                createAndAutoAssignBreakoutRooms({
                  roomsCount,
                  meeting: dyteMeeting,
                  stateManager: breakoutRoomsManager,
                })
                onClose()
              }}>
              Start Breakout
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  )
}

function StartBreakoutModal() {
  const [breakoutMode, setBreakoutMode] = useState<
    'group-size' | 'room-count' | 'selector'
  >('selector')

  if (breakoutMode === 'selector') {
    return (
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>How do you want to split the learners?</ModalHeader>
            <ModalBody>
              <div className="w-full flex gap-2 justify-between">
                <div
                  className="w-full cursor-pointer border rounded-xs p-4 flex flex-1 justify-center items-center border-gray-300 hover:border-purple-600 hover:shadow-md hover:bg-purple-50"
                  onClick={() => setBreakoutMode('group-size')}>
                  <div className="w-full h-full flex flex-col gap-2">
                    <div className="w-full flex items-center justify-center py-4">
                      <MdGroups className="w-12 h-12" />
                    </div>
                    <div className="text-xl font-bold">Group Size</div>
                    <div className="text-sm">
                      Quickly split up into randomised groups. Set the number of
                      participants you need per group and distribute
                      automatically
                    </div>
                  </div>
                </div>
                <div
                  className="w-full cursor-pointer border rounded-xs p-4 flex flex-1 justify-center items-center border-gray-300 hover:border-purple-600 hover:shadow-md hover:bg-purple-50"
                  onClick={() => setBreakoutMode('room-count')}>
                  <div className="w-full h-full flex-1 flex flex-col gap-2">
                    <div className="w-full flex items-center justify-center py-4">
                      <MdOutlineContentCopy className="w-12 h-12" />
                    </div>
                    <div className="text-xl font-bold">Number of Rooms</div>
                    <div className="text-sm">
                      Set up the number of rooms you need. Automatically allot
                      the participants into the rooms.{' '}
                      <div className="text-gray-400">
                        (Coming Soon: 1. Allot participants manually to rooms.
                        2. Allow participants to choose which room they want to
                        go to )
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose} variant="light" color="primary">
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    )
  }

  if (breakoutMode === 'group-size') {
    return <GroupSizeModalContent />
  }

  return <RoomsCountModalContent />
}

export function StartBreakoutRoomsButtonWithModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const { isHost } = useEventSession()
  const { isBreakoutActive, isCurrentDyteMeetingInABreakoutRoom } =
    useBreakoutRooms()

  if (isCurrentDyteMeetingInABreakoutRoom) return null
  if (!isHost) return null
  if (isBreakoutActive) return null

  return (
    <>
      <Button onPress={onOpen} variant="ghost" color="primary">
        Start Breakout
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <StartBreakoutModal />
      </Modal>
    </>
  )
}
