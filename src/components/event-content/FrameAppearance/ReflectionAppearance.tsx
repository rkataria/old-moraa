import { useContext } from 'react'

import { SwitchControl } from '@/components/common/SwitchControl'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function ReflectionAppearance() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  return (
    <SwitchControl
      label="User can reflect anonymously"
      checked={currentFrame.config.allowVoteOnMultipleOptions}
      onChange={() =>
        updateFrame({
          framePayload: {
            config: {
              ...currentFrame.config,
              allowAnonymously: !currentFrame.config.allowAnonymously,
            },
          },
          frameId: currentFrame.id,
        })
      }
    />
  )
}
