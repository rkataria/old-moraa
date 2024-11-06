/* eslint-disable react/no-unstable-nested-components */

import { useEffect, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'

import { ControlButton } from '../ControlButton'

import { useEventSession } from '@/contexts/EventSessionContext'
import {
  notificationDuration,
  notifyBreakoutEnd,
  notifyBreakoutStart,
} from '@/utils/breakout-notify.utils'
import { cn } from '@/utils/utils'

export function StartBreakoutButtonWithConfirmationModal({
  onStartBreakoutClick,
  label = 'Breakout',
  roomsCount,
  participantPerGroup,
  breakoutDuration,
}: {
  onStartBreakoutClick: (breakoutConfig: {
    roomsCount: number
    participantPerGroup: number
    breakoutDuration: number
  }) => void
  label: string
  roomsCount?: number
  participantPerGroup?: number
  breakoutDuration?: number
}) {
  const { realtimeChannel } = useEventSession()
  const [isOpen, setOpen] = useState(false)
  const dyteMeeting = useDyteMeeting()
  const currentParticipantCount =
    dyteMeeting.meeting.participants.joined.toArray().length

  const [breakoutConfig, setBreakoutConfig] = useState({
    participantPerGroup:
      participantPerGroup ||
      Math.ceil(currentParticipantCount / (roomsCount || 2)),
    roomsCount:
      roomsCount ||
      (participantPerGroup
        ? Math.floor(currentParticipantCount / participantPerGroup)
        : 2),
    breakoutDuration: breakoutDuration || 5,
  })

  useEffect(() => {
    setBreakoutConfig({
      participantPerGroup:
        participantPerGroup ||
        Math.ceil(currentParticipantCount / (roomsCount || 2)),
      roomsCount:
        roomsCount ||
        (participantPerGroup
          ? Math.floor(currentParticipantCount / participantPerGroup)
          : 2),
      breakoutDuration: breakoutDuration || 5,
    })
  }, [
    breakoutDuration,
    currentParticipantCount,
    participantPerGroup,
    roomsCount,
  ])

  const isConfigAlreadyProvided =
    typeof roomsCount !== 'undefined' ||
    typeof participantPerGroup !== 'undefined'

  const DurationUI = (
    <div className="grid grid-cols-2 gap-4">
      <p>Duration (mins):</p>
      <ButtonGroup
        variant="bordered"
        size="sm"
        style={{ justifyContent: 'start' }}>
        <Button
          style={{ minWidth: '42px' }}
          disabled={breakoutConfig.breakoutDuration === 1}
          onClick={() =>
            setBreakoutConfig((conf) => ({
              ...conf,
              breakoutDuration: conf.breakoutDuration - 1,
            }))
          }>
          -
        </Button>
        <Button style={{ minWidth: '42px' }} disabled>
          {breakoutConfig.breakoutDuration}
        </Button>
        <Button
          style={{ minWidth: '42px' }}
          onClick={() =>
            setBreakoutConfig((conf) => ({
              ...conf,
              breakoutDuration: conf.breakoutDuration + 1,
            }))
          }>
          +
        </Button>
      </ButtonGroup>
    </div>
  )

  const ShowConfigurationsUI = {
    rooms: (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>Number of rooms:</p>{' '}
          <p className="text-xs text-gray-500">
            Approx {Math.ceil(currentParticipantCount / (roomsCount as number))}{' '}
            participant(s) per room.
          </p>
        </div>
        <div>{roomsCount}</div>
      </div>
    ),
    participants_per_room: (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>Max participants per room:</p>
          <p className="text-xs text-gray-500">
            {Math.ceil(
              currentParticipantCount / (participantPerGroup as number)
            )}{' '}
            room(s) would be created.
          </p>
        </div>
        <div>{participantPerGroup}</div>
      </div>
    ),
  }

  const ConfigureRoomsUI = (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p>Number of rooms:</p>{' '}
        <p className="text-xs text-gray-500">
          Approx{' '}
          {Math.ceil(
            currentParticipantCount / (breakoutConfig.roomsCount as number)
          )}{' '}
          participant(s) per room.
        </p>
      </div>
      <ButtonGroup
        variant="bordered"
        size="sm"
        style={{ justifyContent: 'start' }}>
        <Button
          style={{ minWidth: '42px' }}
          disabled={breakoutConfig.roomsCount === 1}
          onClick={() =>
            setBreakoutConfig((conf) => ({
              ...conf,
              roomsCount: conf.roomsCount - 1,
            }))
          }>
          -
        </Button>
        <Button style={{ minWidth: '42px' }} disabled>
          {breakoutConfig.roomsCount}
        </Button>
        <Button
          style={{ minWidth: '42px' }}
          disabled={breakoutConfig.roomsCount >= currentParticipantCount}
          onClick={() =>
            setBreakoutConfig((conf) => ({
              ...conf,
              roomsCount: conf.roomsCount + 1,
            }))
          }>
          +
        </Button>
      </ButtonGroup>
    </div>
  )

  const startBreakout = () => {
    if (!onStartBreakoutClick) {
      return
    }

    if (!realtimeChannel) {
      setOpen(false)
      onStartBreakoutClick(breakoutConfig)

      return
    }

    notifyBreakoutStart(realtimeChannel)
    setOpen(false)

    setTimeout(() => {
      notifyBreakoutEnd(realtimeChannel)
      onStartBreakoutClick(breakoutConfig)
    }, notificationDuration * 1000)
  }

  return (
    <div>
      <ControlButton
        tooltipProps={{
          content: label,
        }}
        buttonProps={{
          size: 'sm',
          variant: 'solid',
          // isIconOnly: true,
          className: cn('gap-2 justify-between live-button'),
        }}
        onClick={() => setOpen(true)}>
        {label}
      </ControlButton>
      <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{label}</ModalHeader>
              <ModalBody>
                {isConfigAlreadyProvided
                  ? ShowConfigurationsUI[
                      participantPerGroup ? 'participants_per_room' : 'rooms'
                    ]
                  : ConfigureRoomsUI}
                {DurationUI}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  size="sm"
                  onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" size="sm" onPress={startBreakout}>
                  Start
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
