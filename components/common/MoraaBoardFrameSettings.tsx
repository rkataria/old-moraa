import { useContext } from 'react'

import { Checkbox, Spacer } from '@nextui-org/react'

import { ContentType } from './ContentTypePicker'

import { EventContext } from '@/contexts/EventContext'
import { type EventContextType } from '@/types/event-context.type'

export function MoraaBoardFrameSettings() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame || currentFrame.type !== ContentType.MORAA_BOARD) {
    return null
  }

  return (
    <div className="w-full mt-4">
      <Checkbox
        size="sm"
        className="items-baseline"
        isSelected={currentFrame.config.allowToDraw}
        onValueChange={() =>
          updateFrame({
            framePayload: {
              config: {
                ...currentFrame.config,
                allowToDraw: !currentFrame.config.allowToDraw,
              },
            },
            frameId: currentFrame.id,
          })
        }>
        User can draw on the board
      </Checkbox>
      <Spacer y={4} />
    </div>
  )
}
