import { useContext } from 'react'

import { SwitchControl } from '@/components/common/SwitchControl'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function PollConfiguration() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  return (
    <>
      <SwitchControl
        label="Allow votes on multiple options"
        checked={currentFrame.config.allowVoteOnMultipleOptions}
        onChange={() =>
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
        }
      />
      <SwitchControl
        label="Allow anonymous votes"
        checked={currentFrame.config.allowVoteAnonymously}
        onChange={() =>
          updateFrame({
            framePayload: {
              config: {
                ...currentFrame.config,
                allowVoteAnonymously: !currentFrame.config.allowVoteAnonymously,
              },
            },
            frameId: currentFrame.id,
          })
        }
      />
    </>
  )
}
