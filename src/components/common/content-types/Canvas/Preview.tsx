import { useEffect, useRef, useState } from 'react'

import { fabric } from 'fabric'
import ResizeObserver from 'rc-resize-observer'

import { CANVAS_TEMPLATE_TYPES } from '../../BreakoutTypePicker'
import { ContentLoading } from '../../ContentLoading'

import { IFrame } from '@/types/frame.type'
import { loadTemplate } from '@/utils/canvas-templates'

interface CanvasProps {
  frame: IFrame & {
    content: {
      defaultTemplate: CANVAS_TEMPLATE_TYPES
      canvas: string
      svg: string
    }
  }
}

export function CanvasPreview({ frame }: CanvasProps) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (frame?.config?.backgroundColor) {
      canvas?.setBackgroundColor(`${frame.config.backgroundColor}E6`, () => {
        canvas?.renderAll()
      })
    }
  }, [canvas, frame.config.backgroundColor])

  useEffect(() => {
    const canvasInstance = canvas || new fabric.Canvas(`canvas-${frame.id}`)

    if (frame.content.canvas) {
      const json = JSON.parse(frame.content.canvas)

      canvasInstance.loadFromJSON(
        json,
        () => {
          canvasInstance.setBackgroundColor(
            `${frame.config.backgroundColor || '#ffffff'}E6`,
            () => {}
          )
          canvasInstance.renderAll()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_: any, object: fabric.Object) => {
          object.set('selectable', false)
        }
      )
    } else {
      loadTemplate(
        canvasInstance,
        frame.content.defaultTemplate || CANVAS_TEMPLATE_TYPES.BLANK
      )
    }
    resizeCanvas(
      canvasContainerRef.current?.clientWidth || 0,
      canvasContainerRef.current?.clientHeight || 0
    )

    canvasInstance.selection = false
    setCanvas(canvasInstance)
    setIsLoading(false)

    return () => {}

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame.content, canvas])

  const resizeCanvas = (width: number, height: number) => {
    if (!canvas) return

    // const ratio = canvas.getWidth() / canvas.getHeight()
    const containerWidth = width
    const containerHeight = height

    const scale = containerWidth / canvas.getWidth()
    const zoom = canvas.getZoom() * scale
    canvas.setDimensions({
      width: containerWidth,
      height: containerHeight, // containerWidth / ratio,
    })
    canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0])
    canvas.renderAll()
  }

  return (
    <div className="w-full h-full flex justify-center items-center max-w-6xl m-auto relative">
      {isLoading && (
        <div className="absolute left-0 top-0 w-full h-full z-[1]">
          <ContentLoading />
        </div>
      )}
      <div className="w-full aspect-video bg-transparent">
        <ResizeObserver
          onResize={({ width, height }) => {
            resizeCanvas?.(width, height)
          }}>
          <div ref={canvasContainerRef} className="w-full aspect-video m-auto">
            <canvas id={`canvas-${frame.id}`} className="cursor-default" />
          </div>
        </ResizeObserver>
      </div>
    </div>
  )
}
