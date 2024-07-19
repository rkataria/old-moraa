import { useContext } from 'react'

import { fabric } from 'fabric'

import { FileUploader } from '@/components/event-content/FileUploader'
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
      <FileUploader
        title="Replace Image"
        triggerProps={{
          fullWidth: true,
        }}
        onFilesUploaded={(urls) => {
          const url = urls?.[0]?.signedUrl

          if (!url) return

          activeObject.setSrc(url, () => {
            canvas.setActiveObject(activeObject)
            canvas?.renderAll()
            canvas?.fire('object:modified', { target: activeObject })
          })
        }}
      />
    </div>
  )
}
