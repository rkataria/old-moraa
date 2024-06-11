import { useContext } from 'react'

import { Checkbox, Spacer } from '@nextui-org/react'

import { ContentType } from '@/components/common/ContentTypePicker'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function PollFrameSettings() {
  const { updateFrame, currentFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame || currentFrame.type !== ContentType.POLL) return null

  return (
    <div className="w-full mt-4">
      <Checkbox
        size="sm"
        className="items-baseline"
        isSelected={currentFrame.config.allowVoteOnMultipleOptions}
        onValueChange={() =>
          updateFrame({
            framePayload: {
              config: {
                ...currentFrame.config,
                allowVoteOnMultipleOptions:
                  !currentFrame.config.allowVoteOnMultipleOptions,
              },
            },
            frameId: currentFrame.id,
          })
        }>
        User can vote on multiple options
      </Checkbox>
      <Spacer y={4} />
      <Checkbox
        size="sm"
        className="items-baseline"
        isSelected={currentFrame.config.allowVoteAnonymously}
        onValueChange={() =>
          updateFrame({
            framePayload: {
              config: {
                ...currentFrame.config,
                allowVoteAnonymously: !currentFrame.config.allowVoteAnonymously,
              },
            },
            frameId: currentFrame.id,
          })
        }>
        Allow user to vote anonymously
      </Checkbox>
    </div>
  )
}
