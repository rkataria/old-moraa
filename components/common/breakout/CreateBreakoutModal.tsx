/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'

import { TwoWayNumberCounter } from '../content-types/MoraaSlide/FontSizeControl'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
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
  const {
    currentFrame,
    presentationStatus,
    setBreakoutSlideId,
    realtimeChannel,
  } = useEventSession()

  const totalParticipants = meeting.participants.count

  const defaultParticipantsPerRoom = distributeParticipants(
    totalParticipants,
    (currentFrame?.content?.breakoutRooms?.length as number) ||
      Math.ceil(totalParticipants / 10)
  )

  const [participantsPerRoom, setParticipantsPerRoom] = useState(
    defaultParticipantsPerRoom
  )
  const [breakoutDuration, setBreakoutDuration] = useState(5)

  const { breakoutRoomsInstance } = useBreakoutManagerContext()

  useEffect(() => {
    if (!realtimeChannel || !breakoutRoomsInstance) return
    realtimeChannel.on('broadcast', { event: 'timer-stop-event' }, () => {
      breakoutRoomsInstance?.endBreakout()
    })
  }, [breakoutRoomsInstance, realtimeChannel])

  const startBreakoutRooms = async () => {
    try {
      await breakoutRoomsInstance?.startBreakoutRooms({ participantsPerRoom })
      if (presentationStatus === PresentationStatuses.STARTED) {
        setBreakoutSlideId(currentFrame?.id || null)
      }
      setTimeout(() => {
        realtimeChannel?.send({
          type: 'broadcast',
          event: 'timer-start-event',
          payload: { remainingDuration: breakoutDuration * 60 },
        })
      }, 2000)
      setOpen(false)
    } catch (err) {
      console.log('🚀 ~ startBreakoutRooms ~ err:', err)
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
            <p>Participants per group</p>
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
                incrementStep={1}
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
