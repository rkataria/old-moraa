import { useContext } from 'react'

import { FontFamilyControl } from './FontFamilyControl'
import { FrameBackgroundControl } from './FrameBackgroundControl'

import { SwitchControl } from '@/components/common/SwitchControl'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function CommonAppearance() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  return (
    <>
      <FrameBackgroundControl />
      <FontFamilyControl />
      <SwitchControl
        label="Show Title"
        checked={currentFrame.config.showTitle}
        onChange={(value) => {
          updateFrame({
            framePayload: {
              config: {
                ...currentFrame.config,
                showTitle: value,
              },
            },
            frameId: currentFrame.id,
          })
        }}
      />
      <SwitchControl
        label="Show Description"
        checked={currentFrame.config.showDescription}
        onChange={(value) => {
          updateFrame({
            framePayload: {
              config: {
                ...currentFrame.config,
                showDescription: value,
              },
            },
            frameId: currentFrame.id,
          })
        }}
      />
    </>
  )
}
