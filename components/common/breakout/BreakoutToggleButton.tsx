import { IoPeopleOutline } from 'react-icons/io5'

import { Button } from '@nextui-org/react'

import { ControlButton } from '../ControlButton'

import {
  useBreakoutRooms,
  useBreakoutRoomsManagerWithLatestMeetingState,
} from '@/contexts/BreakoutRoomsManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { IFrame } from '@/types/frame.type'
import { ContentType } from '@/utils/content.util'
import { cn } from '@/utils/utils'

export function BreakoutToggleButton({
  onClick,
  isActive,
  useTextButton,
}: {
  onClick: () => void
  isActive: boolean
  useTextButton?: boolean
}) {
  return (
    <ControlButton
      buttonProps={{
        isIconOnly: !useTextButton,
        radius: 'md',
        variant: useTextButton ? 'solid' : 'light',
        color: useTextButton ? 'success' : undefined,
        className: cn('transition-all duration-300', {
          'bg-black text-white': isActive,
        }),
        size: 'sm',
      }}
      tooltipProps={{
        content: isActive ? 'Hide Breakouts' : 'Start Breakouts',
      }}
      onClick={() => onClick()}>
      {useTextButton ? 'Start Breakout' : <IoPeopleOutline size={20} />}
    </ControlButton>
  )
}

export function BreakoutHeaderButton() {
  const {
    isHost,
    isBreakoutSlide,
    currentFrame,
    setIsBreakoutSlide,
    isCreateBreakoutOpen,
    setIsCreateBreakoutOpen,
    setCurrentFrame,
    breakoutSlideId,
  } = useEventSession()
  const { sections } = useEventContext()

  const { isBreakoutActive, isCurrentDyteMeetingInABreakoutRoom } =
    useBreakoutRooms()
  const { endBreakoutRooms, startBreakoutRooms } =
    useBreakoutRoomsManagerWithLatestMeetingState()

  const breakoutFrame = sections
    ?.map((section) => section.frames)
    .flat()
    .find((frame) => frame.id === breakoutSlideId)

  if (!isHost) return null
  if (isCurrentDyteMeetingInABreakoutRoom) return null

  if (!isBreakoutActive && currentFrame?.type === ContentType.BREAKOUT) {
    return (
      <Button
        variant="solid"
        size="sm"
        radius="md"
        className="bg-green-500 text-white"
        onClick={() =>
          startBreakoutRooms({
            roomsCount: currentFrame.content?.breakoutDetails?.length || 2,
          })
        }>
        Start Breakout
      </Button>
    )
  }

  if (!isBreakoutActive) {
    return (
      <BreakoutToggleButton
        isActive={isCreateBreakoutOpen}
        onClick={() => setIsCreateBreakoutOpen(!isCreateBreakoutOpen)}
      />
    )
  }

  if (currentFrame?.type === ContentType.BREAKOUT) {
    return (
      <Button
        color="danger"
        variant="solid"
        size="sm"
        className="!bg-red-500"
        radius="md"
        onClick={() => endBreakoutRooms()}>
        End Breakout
      </Button>
    )
  }

  if (!breakoutSlideId) {
    return (
      <BreakoutToggleButton
        isActive={isBreakoutSlide}
        onClick={() => setIsBreakoutSlide(!isBreakoutSlide)}
      />
    )
  }

  if (breakoutSlideId) {
    return (
      <BreakoutToggleButton
        isActive={currentFrame?.id === breakoutSlideId}
        onClick={() => setCurrentFrame(breakoutFrame as IFrame)}
      />
    )
  }

  return null
}
