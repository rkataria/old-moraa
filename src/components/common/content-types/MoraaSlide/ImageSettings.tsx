import { useContext } from 'react'

import { Button } from '@nextui-org/react'
import { fabric } from 'fabric'

import { MediaPicker } from '../../MediaPicker/MediaPicker'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function ImageSettings() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Image

  if (!activeObject || activeObject.type !== 'image') return null

  return (
    <div className="pt-4">
      <MediaPicker
        trigger={<Button fullWidth>Replace Image</Button>}
        placement="left"
        onSelectCallback={(img) => {
          if (!img) return

          activeObject.setElement(img)
          activeObject.setCoords()
          canvas?.renderAll()
          canvas?.fire('object:modified', { target: activeObject })
        }}
      />
    </div>
  )
}
