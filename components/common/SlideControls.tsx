import { useContext } from 'react'

import { IconChevronUp, IconChevronDown } from '@tabler/icons-react'

import { cn } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { useHotkeys } from '@/hooks/useHotkeys'
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

  const handlePrevious = () => {
    if (eventMode === 'present') onPrevious?.()

    const previousSlide = getPreviousSlide({ sections, currentSlide })

    if (previousSlide) setCurrentSlide(previousSlide)
  }

  const handleNext = () => {
    if (eventMode === 'present') onNext?.()

    const nextSlide = getNextSlide({ sections, currentSlide })

    if (nextSlide) setCurrentSlide(nextSlide)
  }

  const arrowUp = useHotkeys('ArrowUp', handlePrevious)

  const arrowDown = useHotkeys('ArrowDown', handleNext)

  return (
    <div>
      {getPreviousSlide({ sections, currentSlide }) && (
        <div className="absolute left-[50%] top-0 z-10">
          <IconChevronUp
            className={cn(
              'w-8 h-8 text-[#575656] hover:opacity-100  cursor-pointer',
              {
                ' opacity-20': !arrowUp,
              }
            )}
            onClick={onPrevious}
          />
        </div>
      )}
      {getNextSlide({ sections, currentSlide }) && (
        <div className="absolute left-[50%] bottom-0 z-10">
          <IconChevronDown
            className={cn(
              'w-8 h-8 text-[#575656] hover:opacity-100  cursor-pointer',
              {
                'text-[#575656] opacity-20': !arrowDown,
              }
            )}
            onClick={onNext}
          />
        </div>
      )}
    </div>
  )
}
