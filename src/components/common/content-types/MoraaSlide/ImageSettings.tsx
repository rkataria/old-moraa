import { fabric } from 'fabric'

import { MediaPicker } from '../../MediaPicker/MediaPicker'

import { Button } from '@/components/ui/Button'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function ImageSettings() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Image

  if (!activeObject) return null

  return (
    <div className="pt-4">
      <MediaPicker
        trigger={
          <Button size="sm" fullWidth>
            Replace Image
          </Button>
        }
        placement="left"
        onSelectCallback={(img) => {
          if (!img) return

          activeObject.setElement(img)
          activeObject.setCoords()
          canvas.renderAll()
          canvas.fire('object:modified', { target: activeObject })
        }}
      />
    </div>
  )
}
