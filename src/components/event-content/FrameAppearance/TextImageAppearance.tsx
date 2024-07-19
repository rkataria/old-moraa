import { useContext } from 'react'

import { FrameLayout, FrameLayoutControl } from './FrameLayoutControl'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export enum LayoutTypes {
  NO_IMAGE = 'no-image',
  IMAGE_LEFT = 'image-left',
  IMAGE_RIGHT = 'image-right',
  IMAGE_BEHIND = 'image-behind',
}

const FRAME_LAYOUTS: FrameLayout[] = [
  {
    key: LayoutTypes.NO_IMAGE,
    name: 'No Image',
  },
  {
    key: LayoutTypes.IMAGE_LEFT,
    name: 'Image Left',
  },
  {
    key: LayoutTypes.IMAGE_RIGHT,
    name: 'Image Right',
  },

  {
    key: LayoutTypes.IMAGE_BEHIND,
    name: 'Image Behind',
  },
]

export function TextImageAppearance() {
  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  if (!currentFrame) return null

  return (
    <FrameLayoutControl
      currentLayoutKey={currentFrame.config.layoutType}
      layouts={FRAME_LAYOUTS}
      onLayoutChange={(layoutKey) => {
        updateFrame({
          framePayload: {
            config: {
              ...currentFrame.config,
              layoutType: layoutKey,
            },
          },
          frameId: currentFrame.id,
        })
      }}
    />
  )
}
