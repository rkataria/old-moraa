import { Button } from '@nextui-org/react'
import { IoPeopleOutline } from 'react-icons/io5'

import { ControlButton } from '../ControlButton'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
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
  const { isBreakoutActive } = useBreakoutRooms()

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
        content: isActive
          ? 'Hide Breakouts'
          : isBreakoutActive
            ? 'View Active Breakout'
            : 'Start Breakouts',
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
    realtimeChannel,
  } = useEventSession()
  const { sections } = useEventContext()

  const { isBreakoutActive, isCurrentDyteMeetingInABreakoutRoom } =
    useBreakoutRooms()
  const { breakoutRoomsInstance } = useBreakoutManagerContext()

  const breakoutFrame = sections
    ?.map((section) => section.frames)
    .flat()
    .find((frame) => frame?.id === breakoutSlideId)

  const onBreakoutStartOnBreakoutSlide = async () => {
    try {
      await breakoutRoomsInstance?.startBreakoutRooms({
        /*
         * Because the breakoutRooms array only exist on breakout room type so it won't get sent for a breakout group type
         * And the `participantPerGroup` only exist on breakout group type so it won't get sent for a breakout room type
         */
        roomsCount: currentFrame?.content?.breakoutRooms?.length,
        participantsPerRoom: currentFrame?.config.participantPerGroup,
      })
      if (currentFrame?.config.breakoutTime) {
        setTimeout(() => {
          realtimeChannel?.send({
            type: 'broadcast',
            event: 'timer-start-event',
            payload: {
              remainingDuration:
                (currentFrame?.config?.breakoutTime as number) * 60,
            },
          })
        }, 500)
      }
    } catch (err) {
      console.log('🚀 ~ onBreakoutStartOnBreakoutSlide ~ err:', err)
    }
  }

  const onBreakoutEnd = () => {
    breakoutRoomsInstance?.endBreakoutRooms()
    realtimeChannel?.send({
      type: 'broadcast',
      event: 'timer-stop-event',
      payload: { remainingDuration: 0 },
    })
  }

  if (!isHost) return null
  if (isCurrentDyteMeetingInABreakoutRoom) return null

  if (!isBreakoutActive && currentFrame?.type === ContentType.BREAKOUT) {
    return (
      <Button
        variant="solid"
        size="sm"
        radius="md"
        className="bg-green-500 text-white"
        onClick={onBreakoutStartOnBreakoutSlide}>
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
        onClick={onBreakoutEnd}>
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
