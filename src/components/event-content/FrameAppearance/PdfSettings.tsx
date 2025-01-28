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
    <>
      <SwitchControl
        label="Container scroll"
        checked={currentFrame.config.allowedAutoScroll}
        onChange={() =>
          updateFrame({
            framePayload: {
              config: {
                ...currentFrame.config,
                allowedAutoScroll: !currentFrame.config.allowedAutoScroll,
              },
            },
            frameId: currentFrame.id,
          })
        }
      />
      <SwitchControl
        label="Allow participants to download"
        checked={currentFrame.config.allowedDownloading}
        onChange={() =>
          updateFrame({
            framePayload: {
              config: {
                ...currentFrame.config,
                allowedDownloading: !currentFrame.config.allowedDownloading,
              },
            },
            frameId: currentFrame.id,
          })
        }
      />
    </>
  )
}
