import { useContext } from 'react'

import { Checkbox } from '@nextui-org/react'

import { ContentType } from './ContentTypePicker'

import { EventContext } from '@/contexts/EventContext'
import { type EventContextType } from '@/types/event-context.type'

export function ReflectionFrameSettings() {
  const { updateFrame, currentFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame || currentFrame.type !== ContentType.REFLECTION) return null

  return (
    <div className="w-full mt-4">
      <Checkbox
        className="items-baseline"
        size="sm"
        isSelected={currentFrame.config.allowAnonymously}
        onValueChange={() =>
          updateFrame({
            framePayload: {
              config: {
                ...currentFrame.config,
                allowAnonymously: !currentFrame.config.allowAnonymously,
              },
            },
            frameId: currentFrame.id,
          })
        }>
        User can reflect anonymously
      </Checkbox>
    </div>
  )
}
