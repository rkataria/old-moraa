import { useContext, useMemo } from 'react'

import { Button, cn } from '@nextui-org/react'
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react'

import { Tooltip } from './ShortuctTooltip'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { getNextFrame, getPreviousFrame } from '@/utils/event-session.utils'

export function FrameControls({
  onPrevious,
  onNext,
  switchPublishedFrames = false,
}: {
  onPrevious?: () => void
  onNext?: () => void
  switchPublishedFrames?: boolean
}) {
  const { sections, currentFrame, setCurrentFrame, eventMode } = useContext(
    EventContext
  ) as EventContextType

  const previousFrame = useMemo(
    () =>
      getPreviousFrame({
        sections,
        currentFrame,
        onlyPublished: switchPublishedFrames && eventMode !== 'present',
      }),
    [sections, currentFrame, switchPublishedFrames, eventMode]
  )
  const nextFrame = useMemo(
    () =>
      getNextFrame({
        sections,
        currentFrame,
        onlyPublished: switchPublishedFrames && eventMode !== 'present',
      }),
    [sections, currentFrame, switchPublishedFrames, eventMode]
  )

  const handlePrevious = () => {
    if (eventMode === 'present') onPrevious?.()

    if (previousFrame) setCurrentFrame(previousFrame)
  }

  const handleNext = () => {
    if (eventMode === 'present') onNext?.()

    if (nextFrame) setCurrentFrame(nextFrame)
  }

  return (
    <div className={cn('absolute right-2 bottom-2 flex flex-col gap-1')}>
      <Tooltip content="Previous frame" placement="left">
        <Button
          variant="flat"
          isIconOnly
          radius="full"
          className={cn('transition-all duration-200 cursor-pointer ring-0', {
            'bg-black text-white': !!previousFrame,
            'cursor-not-allowed': !previousFrame,
          })}
          disabled={!previousFrame}
          onClick={handlePrevious}>
          <IconChevronUp />
        </Button>
      </Tooltip>
      <Tooltip content="Next frame" placement="left">
        <Button
          variant="flat"
          isIconOnly
          radius="full"
          className={cn('transition-all duration-200 cursor-pointer ring-0', {
            'bg-black text-white': !!nextFrame,
            'opacity-20 cursor-not-allowed': !nextFrame,
          })}
          disabled={!nextFrame}
          onClick={handleNext}>
          <IconChevronDown />
        </Button>
      </Tooltip>
    </div>
  )
}
