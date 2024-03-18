import { useContext } from 'react'

import { Checkbox } from '@nextui-org/react'

import { ContentType } from '../event-content/ContentTypePicker'

import { SlideManagerContext } from '@/contexts/SlideManagerContext'
import { SlideManagerContextType } from '@/types/slide.type'

export function PollSlideSettings() {
  const { updateSlide, currentSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

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
