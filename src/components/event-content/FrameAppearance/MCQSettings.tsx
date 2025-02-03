import { useContext } from 'react'

import { CommonImageSettings } from './CommonImageSettings'

import { SwitchControl } from '@/components/common/SwitchControl'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function MCQSettings() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  return (
    <>
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
      <CommonImageSettings frame={currentFrame} />
    </>
  )
}
