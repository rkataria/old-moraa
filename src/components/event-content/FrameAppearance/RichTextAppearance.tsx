import { useContext } from 'react'

import { SwitchControl } from '@/components/common/SwitchControl'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function RichTextAppearance() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  return (
    <SwitchControl
      label="Allow users to collaborate"
      checked={currentFrame.config.allowToCollaborate}
      onChange={() =>
        updateFrame({
          framePayload: {
            config: {
              ...currentFrame.config,
              allowToCollaborate: !currentFrame.config.allowToCollaborate,
            },
          },
          frameId: currentFrame.id,
        })
      }
    />
  )
}
