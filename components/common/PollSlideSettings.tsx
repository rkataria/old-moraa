import { useContext } from 'react'

import { Checkbox } from '@nextui-org/react'

import { ContentType } from '@/components/common/ContentTypePicker'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function PollSlideSettings() {
  const { updateSlide, currentSlide } = useContext(
    EventContext
  ) as EventContextType

  if (!currentSlide || currentSlide.type !== ContentType.POLL) return null

  return (
    <div className="w-full">
      <Checkbox
        isSelected={currentSlide.config.allowVoteOnMultipleOptions}
        onValueChange={() =>
          updateSlide({
            ...currentSlide,
            config: {
              ...currentSlide.config,
              allowVoteOnMultipleOptions:
                !currentSlide.config.allowVoteOnMultipleOptions,
            },
          })
        }>
        User can vote on multiple options
      </Checkbox>
    </div>
  )
}
