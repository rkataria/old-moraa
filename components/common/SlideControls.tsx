import { useContext } from 'react'

import { IconChevronUp, IconChevronDown } from '@tabler/icons-react'

import { cn } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useHotkeys } from '@/hooks/useHotkeys'
import { EventContextType } from '@/types/event-context.type'
import { EventSessionContextType } from '@/types/event-session.type'
import { getNextSlide, getPreviousSlide } from '@/utils/event-session.utils'

export function SlideControls() {
  const { sections } = useContext(EventContext) as EventContextType
  const { currentSlide, nextSlide, previousSlide, isHost } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const arrowUp = useHotkeys('ArrowUp', () => {
    previousSlide()
  })

  const arrowDown = useHotkeys('ArrowDown', () => {
    nextSlide()
  })

  if (!isHost) return null

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
            onClick={() => previousSlide()}
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
            onClick={() => nextSlide()}
          />
        </div>
      )}
    </div>
  )
}
