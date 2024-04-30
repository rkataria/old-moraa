import { useContext } from 'react'

import { Checkbox } from '@nextui-org/react'

import { ContentType } from './ContentTypePicker'

import { EventContext } from '@/contexts/EventContext'
import { type EventContextType } from '@/types/event-context.type'

export function ReflectionSlideSettings() {
  const { updateSlide, currentSlide } = useContext(
    EventContext
  ) as EventContextType

  if (!currentSlide || currentSlide.type !== ContentType.REFLECTION) return null

  return (
    <div className="w-full mt-4">
      <Checkbox
        className="items-baseline"
        size="sm"
        isSelected={currentSlide.config.allowAnonymously}
        onValueChange={() =>
          updateSlide({
            slidePayload: {
              config: {
                ...currentSlide.config,
                allowAnonymously: !currentSlide.config.allowAnonymously,
              },
            },
            slideId: currentSlide.id,
          })
        }>
        User can reflect anonymously
      </Checkbox>
    </div>
  )
}
