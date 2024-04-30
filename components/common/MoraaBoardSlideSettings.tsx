import { useContext } from 'react'

import { Checkbox, Spacer } from '@nextui-org/react'

import { ContentType } from './ContentTypePicker'

import { EventContext } from '@/contexts/EventContext'
import { type EventContextType } from '@/types/event-context.type'

export function MoraaBoardSlideSettings() {
  const { currentSlide, updateSlide } = useContext(
    EventContext
  ) as EventContextType

  if (!currentSlide || currentSlide.type !== ContentType.MORAA_BOARD) {
    return null
  }

  return (
    <div className="w-full mt-4">
      <Checkbox
        size="sm"
        className="items-baseline"
        isSelected={currentSlide.config.allowToDraw}
        onValueChange={() =>
          updateSlide({
            slidePayload: {
              config: {
                ...currentSlide.config,
                allowToDraw: !currentSlide.config.allowToDraw,
              },
            },
            slideId: currentSlide.id,
          })
        }>
        User can draw on the board
      </Checkbox>
      <Spacer y={4} />
    </div>
  )
}
