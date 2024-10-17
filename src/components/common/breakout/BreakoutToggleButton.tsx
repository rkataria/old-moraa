import { useState } from 'react'

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
import { VscMultipleWindows } from 'react-icons/vsc'

import { ControlButton } from '../ControlButton'

import { cn } from '@/utils/utils'

export function BreakoutToggleButton({
  onStartBreakoutClick,
  onEndBreakoutClick,
  label,
  roomsCount,
  participantPerGroup,
  breakoutDuration,
}: {
  onStartBreakoutClick?: (breakoutConfig: {
    roomsCount: number
    participantPerGroup: number
    breakoutDuration: number
  }) => void
  onEndBreakoutClick?: () => void
  label: string
  roomsCount?: number
  participantPerGroup?: number
  breakoutDuration?: number
}) {
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

  const bgColor = {
    danger: '!bg-red-500 hover:!bg-red-500',
    success: '',
    none: '',
  }[onStartBreakoutClick ? 'success' : onEndBreakoutClick ? 'danger' : 'none']

  const isConfigAlreadyProvided =
    typeof roomsCount !== 'undefined' ||
    typeof participantPerGroup !== 'undefined'

  const DurationUI = (
    <div className="grid grid-cols-2 gap-4">
      <p>Duration:</p>
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
          <p>Breakout Rooms:</p>{' '}
          <p className="text-xs text-gray-500">
            Approx {Math.ceil(currentParticipantCount / (roomsCount as number))}{' '}
            participant per room.
          </p>
        </div>
        <div>{roomsCount}</div>
      </div>
    ),
    participants_per_room: (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>Participants per room:</p>
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
        <p>Breakout Rooms:</p>{' '}
        <p className="text-xs text-gray-500">
          Approx{' '}
          {Math.ceil(
            currentParticipantCount / (breakoutConfig.roomsCount as number)
          )}{' '}
          participant per room.
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

  return (
    <div>
      <ControlButton
        tooltipProps={{
          content: label,
        }}
        buttonProps={{
          size: 'sm',
          variant: 'solid',
          isIconOnly: true,
          className: cn('gap-2 p-1 justify-between live-button', bgColor),
        }}
        onClick={() =>
          onStartBreakoutClick ? setOpen(true) : onEndBreakoutClick?.()
        }>
        <VscMultipleWindows size={22} className="text-white" />
      </ControlButton>
      {!!onStartBreakoutClick && (
        <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Start Breakout Meeting
                </ModalHeader>
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
                  <Button
                    color="primary"
                    size="sm"
                    onPress={() => onStartBreakoutClick(breakoutConfig)}>
                    Start
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  )
}
