import { useContext, useEffect, useState } from 'react'

import { CanvasEditor } from './Editor'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

interface CanvasProps {
  frame: IFrame & {
    content: {
      defaultTemplateKey: string
      canvas: string
      svg: string
    }
  }
}

export function MoraaSlide({ frame }: CanvasProps) {
  const { updateFrame } = useContext(EventContext) as EventContextType
  const [canvasData] = useState<string | null>(frame.content?.canvas)
  const [frameBackgroundColor, setFrameBackgroundColor] = useState<
    string | null
  >(frame.config?.backgroundColor)

  useEffect(() => {
    if (frame.config?.backgroundColor) {
      setFrameBackgroundColor(frame.config?.backgroundColor)
    }
  }, [frame.config?.backgroundColor])

  const saveToStorage = (canvas: fabric.Canvas) => {
    const json = canvas.toJSON()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json.objects.forEach((object: any) => {
      if (object.uuid) return

      // eslint-disable-next-line no-param-reassign
      object.uuid = Math.random().toString(36).substring(7)
    })

    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          canvas: JSON.stringify({
            ...json,
            width: canvas.getWidth(),
            height: canvas.getHeight(),
            zoom: canvas.getZoom(),
          }),
          svg: canvas.toSVG({
            suppressPreamble: true,
            width: canvas.getWidth(),
            height: canvas.getHeight(),
            viewBox: {
              x: 0,
              y: 0,
              width: canvas.getWidth(),
              height: canvas.getHeight(),
            },
          }),
        },
      },
      frameId: frame.id,
    })
  }

  return (
    <CanvasEditor
      key={frame.id}
      frameId={frame.id}
      frameCanvasData={canvasData}
      frameBackgroundColor={frameBackgroundColor}
      saveToStorage={saveToStorage}
    />
  )
}
