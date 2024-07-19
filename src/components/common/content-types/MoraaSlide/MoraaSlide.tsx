import { useContext, useEffect, useRef, useState } from 'react'

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

const SAVE_TO_STORAGE_DELAY = 1000

export function MoraaSlide({ frame }: CanvasProps) {
  // const { setRightSidebarVisiblity } = useStudioLayout()
  const { updateFrame } = useContext(EventContext) as EventContextType
  const [canvasData] = useState<string | null>(frame.content?.canvas)
  const [frameBackgroundColor, setFrameBackgroundColor] = useState<
    string | null
  >(frame.config?.backgroundColor)
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (frame.config?.backgroundColor) {
      setFrameBackgroundColor(frame.config?.backgroundColor)
    }

    // setRightSidebarVisiblity('frame-appearance')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame.config?.backgroundColor])

  const saveToStorage = (canvas: fabric.Canvas) => {
    if (saveTimeout?.current) {
      clearTimeout(saveTimeout.current as NodeJS.Timeout)
    }

    const timeout = setTimeout(() => {
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

      saveTimeout.current = null
    }, SAVE_TO_STORAGE_DELAY)

    saveTimeout.current = timeout
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
