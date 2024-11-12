import { useContext } from 'react'

import { SwitchControl } from '@/components/common/SwitchControl'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function PdfSettings() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  return (
    <div className="flex flex-col gap-4">
      {/* <LabelWithInlineControl
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
      /> */}
      <SwitchControl
        label="Lanscape"
        checked={currentFrame.config.landcapeView}
        onChange={() =>
          updateFrame({
            framePayload: {
              config: {
                ...currentFrame.config,
                landcapeView: !currentFrame.config.landcapeView,
              },
            },
            frameId: currentFrame.id,
          })
        }
      />
    </div>
  )
}
