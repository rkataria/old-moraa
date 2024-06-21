import { useContext } from 'react'

import { LabelWithInlineControl } from '@/components/common/LabelWithInlineControl'
import { NumberInput } from '@/components/common/NumberInput'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function PdfConfiguration() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  return (
    <LabelWithInlineControl
      label="Initial Page"
      control={
        <NumberInput
          min={1}
          number={+(currentFrame?.config?.defaultPage || 1)}
          onNumberChange={(updateValue) => {
            updateFrame({
              framePayload: {
                config: {
                  ...currentFrame.config,
                  defaultPage: updateValue,
                },
              },
              frameId: currentFrame.id,
            })
          }}
        />
      }
    />
  )
}
