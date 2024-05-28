import { useContext, useMemo } from 'react'

import { IconChevronUp, IconChevronDown } from '@tabler/icons-react'
import { useHotkeys } from 'react-hotkeys-hook'

import { Button, Tooltip, cn } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { getNextSlide, getPreviousSlide } from '@/utils/event-session.utils'

export function SlideControls({
  onPrevious,
  onNext,
}: {
  onPrevious?: () => void
  onNext?: () => void
}) {
  const { sections, currentSlide, setCurrentSlide, eventMode } = useContext(
    EventContext
  ) as EventContextType

  const previousSlide = useMemo(
    () => getPreviousSlide({ sections, currentSlide }),
    [sections, currentSlide]
  )
  const nextSlide = useMemo(
    () => getNextSlide({ sections, currentSlide }),
    [sections, currentSlide]
  )

  const handlePrevious = () => {
    if (eventMode === 'present') onPrevious?.()

    if (previousSlide) setCurrentSlide(previousSlide)
  }

  const handleNext = () => {
    if (eventMode === 'present') onNext?.()

    if (nextSlide) setCurrentSlide(nextSlide)
  }

  const arrowUp = useHotkeys('ArrowUp', handlePrevious)
  const arrowDown = useHotkeys('ArrowDown', handleNext)

  return (
    <div className={cn('absolute right-2 bottom-2 flex flex-col gap-1')}>
      <Tooltip content="Previous slide" placement="left">
        <Button
          variant="flat"
          isIconOnly
          radius="full"
          className={cn('transition-all duration-200 cursor-pointer ring-0', {
            'bg-black text-white': !!previousSlide && arrowUp,
            'opacity-20 cursor-not-allowed': !previousSlide,
          })}
          disabled={!previousSlide}
          onClick={handlePrevious}>
          <IconChevronUp />
        </Button>
      </Tooltip>
      <Tooltip content="Next slide" placement="left">
        <Button
          variant="flat"
          isIconOnly
          radius="full"
          className={cn('transition-all duration-200 cursor-pointer ring-0', {
            'bg-black text-white': !!nextSlide && arrowDown,
            'opacity-20 cursor-not-allowed': !nextSlide,
          })}
          disabled={!nextSlide}
          onClick={handleNext}>
          <IconChevronDown />
        </Button>
      </Tooltip>
    </div>
  )
}
