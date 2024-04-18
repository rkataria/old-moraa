import { useContext } from 'react'

import { Checkbox, Spacer } from '@nextui-org/react'

import { ContentType } from '@/components/common/ContentTypePicker'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function PollSlideSettings() {
  const { updateSlide, currentSlide } = useContext(
    EventContext
  ) as EventContextType

  if (!currentSlide || currentSlide.type !== ContentType.POLL) return null

  return (
    <div className="w-full mt-4">
      <Checkbox
        size="sm"
        className="items-baseline"
        isSelected={currentSlide.config.allowVoteOnMultipleOptions}
        onValueChange={() =>
          updateSlide({
            slidePayload: {
              config: {
                ...currentSlide.config,
                allowVoteOnMultipleOptions:
                  !currentSlide.config.allowVoteOnMultipleOptions,
              },
            },
            slideId: currentSlide.id,
          })
        }>
        User can vote on multiple options
      </Checkbox>
      <Spacer y={4} />
      <Checkbox
        size="sm"
        className="items-baseline"
        isSelected={currentSlide.config.allowVoteAnonymously}
        onValueChange={() =>
          updateSlide({
            slidePayload: {
              config: {
                ...currentSlide.config,
                allowVoteAnonymously: !currentSlide.config.allowVoteAnonymously,
              },
            },
            slideId: currentSlide.id,
          })
        }>
        Allow user to vote anonymously
      </Checkbox>
    </div>
  )
}
