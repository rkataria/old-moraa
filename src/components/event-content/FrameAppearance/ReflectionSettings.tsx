import { useContext } from 'react'

import { CommonImageSettings } from './CommonImageSettings'

import { LabelWithInlineControl } from '@/components/common/LabelWithInlineControl'
import { SwitchControl } from '@/components/common/SwitchControl'
import { TwoWayNumberCounter } from '@/components/frames/frame-types/MoraaSlide/FontSizeControl'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function ReflectionSettings() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  return (
    <>
      <LabelWithInlineControl
        label="Max Reflections"
        control={
          <TwoWayNumberCounter
            defaultCount={currentFrame?.config?.maxReflectionsPerUser as number}
            onCountChange={(count) => {
              updateFrame({
                framePayload: {
                  config: {
                    ...currentFrame?.config,
                    maxReflectionsPerUser: count,
                  },
                },
                frameId: currentFrame?.id,
              })
            }}
            noNegative
          />
        }
      />
      <SwitchControl
        label="User can reflect anonymously"
        checked={currentFrame.config.allowAnonymously}
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
      <CommonImageSettings frame={currentFrame} />
    </>
  )
}
