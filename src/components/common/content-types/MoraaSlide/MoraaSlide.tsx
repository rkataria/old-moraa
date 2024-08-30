import { useContext, useEffect, useRef, useState } from 'react'

import { MoraaSlideEditor } from './Editor'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

interface MoraaSlideProps {
  frame: IFrame & {
    content: {
      defaultTemplate: string
      canvas: string
      svg: string
      objects: fabric.Object[]
    }
  }
}

const SAVE_TO_STORAGE_DELAY = 1000

export function MoraaSlide({ frame }: MoraaSlideProps) {
  // const { setRightSidebarVisiblity } = useStudioLayout()
  const { updateFrame } = useContext(EventContext) as EventContextType
  const [canvasData] = useState<string | null>(frame.content?.canvas)
  const [canvasObjects] = useState<fabric.Object[]>(frame.content?.objects)
  const [frameBackgroundColor, setFrameBackgroundColor] = useState<
    string | null
  >(frame.config?.backgroundColor)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (frame.config?.backgroundColor) {
      setFrameBackgroundColor(frame.config?.backgroundColor)
    }

    // setRightSidebarVisiblity('frame-appearance')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame.config?.backgroundColor])

  const saveToStorage = (canvas: fabric.Canvas) => {
    if (saveTimeoutRef?.current) {
      clearTimeout(saveTimeoutRef.current as NodeJS.Timeout)
    }

    const timeout = setTimeout(() => {
      const json = canvas.toJSON([
        'lockMovementX',
        'lockMovementY',
        'lockRotation',
        'lockScalingX',
        'lockScalingY',
        'lockUniScaling',
        'lockSkewingX',
        'lockSkewingY',
        'lockScalingFlip',
        'lockObject',
        'lock',
        'hoverCursor',
        'name',
      ])

      const objects = canvas.getObjects()
      const objectsJson = objects.map((object) => object.toJSON())

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
            objects: objectsJson,
          },
        },
        frameId: frame.id,
      })

      saveTimeoutRef.current = null
    }, SAVE_TO_STORAGE_DELAY)

    saveTimeoutRef.current = timeout
  }

  return (
    <MoraaSlideEditor
      key={frame.id}
      frameId={frame.id}
      frameTemplate={frame.content.defaultTemplate}
      frameCanvasData={canvasData}
      canvasObjects={canvasObjects}
      frameBackgroundColor={frameBackgroundColor}
      saveToStorage={saveToStorage}
    />
  )
}
