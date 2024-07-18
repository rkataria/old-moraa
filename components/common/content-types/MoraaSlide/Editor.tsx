import { useEffect, useRef } from 'react'

import { fabric } from 'fabric'
import ResizeObserver from 'rc-resize-observer'
import { useHotkeys } from 'react-hotkeys-hook'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { HistoryFeature } from '@/libs/fabric-history'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { loadCustomFabricObjects } from '@/utils/custom-fabric-objects'
import { cn } from '@/utils/utils'

loadCustomFabricObjects()

interface CanvasProps {
  frameId: string
  frameCanvasData: string | null
  frameBackgroundColor: string | null
  saveToStorage: (canvas: fabric.Canvas) => void
}

const initializeCanvas = ({ frameId }: { frameId: string }) => {
  fabric.Object.prototype.transparentCorners = false
  fabric.Object.prototype.cornerColor = '#22d3ee'
  fabric.Object.prototype.cornerSize = 10
  fabric.Object.prototype.borderColor = '#22d3ee'

  const canvas = new fabric.Canvas(`canvas-${frameId}`, {
    selectionBorderColor: '#979797',
    selectionColor: 'transparent',
    selectionDashArray: [4, 4],
    selectionLineWidth: 1,
    backgroundColor: 'transparent',
    centeredRotation: true,
  })

  return canvas
}

export function CanvasEditor({
  frameId,
  frameCanvasData,
  frameBackgroundColor,
  saveToStorage,
}: CanvasProps) {
  const { setRightSidebarVisiblity } = useStudioLayout()
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[frameId] || null
  )
  const { setCanvas, setHistory } = useMoraaSlideStore((state) => state)

  useHotkeys('Delete', () => {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()

    if (activeObject) {
      canvas.remove(activeObject)
      canvas.renderAll()
      setCanvas(frameId, canvas)
    }
  })

  useHotkeys('ctrl+v', () => {
    if (!canvas) return

    if (!navigator.clipboard) {
      console.log('Clipboard API not found')

      return
    }

    const activeObject = canvas.getActiveObject()
    if (activeObject) return

    navigator.clipboard.read().then((clipboardItems) => {
      clipboardItems.forEach((clipboardItem) => {
        if (!clipboardItem.types.includes('image/png')) return

        clipboardItem.getType('image/png').then((blob) => {
          const pasteImage = new Image()
          pasteImage.src = URL.createObjectURL(blob)
          pasteImage.onload = () => {
            const imgInstance = new fabric.Image(pasteImage, {
              left: 100,
              top: 100,
              angle: 0,
              opacity: 1,
              scaleX: 1,
              scaleY: 1,
            })

            canvas.add(imgInstance)
            canvas.renderAll()
            setCanvas(frameId, canvas)
          }
        })
      })
    })
  })

  useEffect(() => {
    if (!frameId) return

    if (!canvasContainerRef.current) return
    if (!canvasRef.current) return

    canvasRef.current.width = canvasContainerRef.current?.clientWidth || 0
    canvasRef.current.height = canvasContainerRef.current?.clientHeight || 0

    const _canvas = initializeCanvas({
      frameId,
    })

    _canvas.setDimensions({
      width: canvasContainerRef.current.clientWidth,
      height: canvasContainerRef.current.clientHeight,
    })
    _canvas.setZoom(1)
    _canvas.renderAll()

    setCanvas(frameId, _canvas)

    // Enable history feature
    const history = new HistoryFeature(_canvas)

    setHistory(frameId, history)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameId])

  useEffect(() => {
    if (frameBackgroundColor) {
      canvas?.setBackgroundColor(`${frameBackgroundColor}E6`, () => {
        canvas?.renderAll()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameBackgroundColor])

  useEffect(() => {
    if (!canvas) return

    if (frameCanvasData) {
      canvas.clear()

      canvas.loadFromJSON(JSON.parse(frameCanvasData || '{}'), () => {
        canvas.renderAll()
      })
    }

    // Attach event listeners

    canvas.on('object:added', handleObjectAdded)
    canvas.on('object:modified', handleObjectModified)
    canvas.on('object:scaling', handleObjectScaling)
    canvas.on('object:removed', handleObjectRemoved)
    canvas.on('selection:created', handleSelectionCreated)
    canvas.on('selection:updated', (event) =>
      handleSelectionUpdated(event, canvas)
    )
    canvas.on('selection:cleared', handleSelectionCleared)
    canvas.on('mouse:over', handleMouseOver)
    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:out', handleMouseOut)

    // eslint-disable-next-line consistent-return
    return () => {
      canvas.off('object:added', handleObjectAdded)
      canvas.off('object:modified', handleObjectModified)
      canvas.off('object:scaling', handleObjectScaling)
      canvas.off('object:removed', handleObjectRemoved)
      canvas.off('selection:created', handleSelectionCreated)
      canvas.off('selection:updated', (event) =>
        handleSelectionUpdated(event, canvas)
      )
      canvas.off('selection:cleared', handleSelectionCleared)
      canvas.off('mouse:over', handleMouseOver)
      canvas.off('mouse:down', handleMouseDown)
      canvas.off('mouse:out', handleMouseOut)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, frameCanvasData])

  const handleSelectionCreated = (event: fabric.IEvent) => {
    if (event.selected?.length === 1 && canvas) {
      canvas.isDrawingMode = false

      setRightSidebarVisiblity('frame-appearance')

      setCanvas(frameId, canvas)
    }
  }

  const handleSelectionUpdated = (
    event: fabric.IEvent,
    _canvas: fabric.Canvas
  ) => {
    if (event.selected?.length === 1 && _canvas) {
      const activeObject = event.selected[0] as fabric.Object
      _canvas.setActiveObject(activeObject)
      setCanvas(frameId, _canvas)
    }
  }

  const handleSelectionCleared = () => {
    if (canvas) {
      setCanvas(frameId, canvas)
    }
  }

  const handleObjectAdded = (event: fabric.IEvent) => {
    const { target } = event

    if (!canvas) return
    if (!target) return

    console.log('object:added', target)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (target.uuid) return

    saveToStorage(canvas!)
  }

  const handleObjectModified = (event: fabric.IEvent) => {
    const { target } = event
    console.log('object:modified', target)

    if (!canvas) return

    saveToStorage(canvas!)
  }

  const handleObjectScaling = (event: fabric.IEvent) => {
    const { target } = event
    console.log('object:scaling', target)

    if (!canvas) return

    saveToStorage(canvas!)
  }

  const handleObjectRemoved = (event: fabric.IEvent) => {
    const { target } = event

    if (!canvas) return
    if (!target) return

    console.log('object:removed', target)

    saveToStorage(canvas!)
  }

  const handleMouseOver = (event: fabric.IEvent) => {
    if (!canvas) return

    const { target } = event
    if (target) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      target._renderControls(canvas.contextTop, {
        hasControls: false,
      })
      canvas.renderAll()
    }
  }

  const handleMouseDown = () => {
    if (!canvas) return

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    canvas.clearContext(canvas.contextTop)
  }

  const handleMouseOut = () => {
    if (!canvas) return

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    canvas.clearContext(canvas.contextTop)
  }

  const resizeCanvas = (width: number, height: number) => {
    if (!canvas) return

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
    setCanvas(frameId, canvas)
  }

  return (
    <div>
      <ResizeObserver
        onResize={({ width, height }) => {
          resizeCanvas(width, height)
        }}>
        <div
          ref={canvasContainerRef}
          className={cn(
            'flex-auto w-full aspect-video m-auto bg-transparent rounded-sm overflow-hidden',
            'border-2 border-black/10'
          )}>
          <canvas ref={canvasRef} id={`canvas-${frameId}`} />
        </div>
      </ResizeObserver>
    </div>
  )
}
