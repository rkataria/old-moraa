import { useEffect, useRef } from 'react'

import { fabric } from 'fabric'
import ResizeObserver from 'rc-resize-observer'

import { BubbleMenu } from './BubbleMenu'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { useMoraaSlideShortcuts } from '@/hooks/useMoraaSlideShortcuts'
import { HistoryFeature } from '@/libs/fabric-history'
import {
  enableGuidelines,
  handleCanvasObjectAdded,
  handleCanvasObjectModified,
  handleCanvasObjectMoving,
  handleCanvasObjectRemoved,
  handleCanvasObjectRotating,
  handleCanvasObjectScaling,
  handleCanvasObjectSkewing,
  handleCanvasSelectionCleared,
  handleCanvasSelectionCreated,
  handleCanvasSelectionUpdated,
  initializeFabric,
  initialSetup,
  resizeCanvas,
} from '@/libs/moraa-slide-editor'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { MORAA_SLIDE_TEMPLATES } from '@/utils/moraa-slide-templates'
import { cn } from '@/utils/utils'

interface MoraaSlideEditorProps {
  frameId: string
  frameTemplate: string
  frameCanvasData: string | null
  // eslint-disable-next-line react/no-unused-prop-types
  canvasObjects?: fabric.Object[]
  frameBackgroundColor: string | null
  saveToStorage: (canvas: fabric.Canvas) => void
}

// NOTE: This function adds custom fabric object support and modify initial canvas settings
initialSetup()

export function MoraaSlideEditor({
  frameId,
  frameTemplate,
  frameCanvasData,
  frameBackgroundColor,
  saveToStorage,
}: MoraaSlideEditorProps) {
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement | null>(null)

  const { setCanvas } = useMoraaSlideEditorContext()
  const { setHistory, setActiveObject } = useMoraaSlideStore()
  useMoraaSlideShortcuts()

  useEffect(() => {
    setActiveObject(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameId])

  useEffect(() => {
    const canvas = initializeFabric({
      fabricRef,
      canvasRef,
      canvasContainerRef,
    })

    // Enable history feature
    const history = new HistoryFeature(canvas)

    setHistory(frameId, history)

    // Enable guidelines
    enableGuidelines(canvas)

    if (!canvas) return

    // Array.from(canvasObjects).forEach((object) => {
    //   fabric.util.enlivenObjects(
    //     [object],
    //     (enlivenedObjects: fabric.Object[]) => {
    //       enlivenedObjects.forEach((enlivenedObj) => {
    //         // if element is active, keep it in active state so that it can be edited further
    //         // if (activeObjectRef.current?.objectId === objectId) {
    //         //   fabricRef.current?.setActiveObject(enlivenedObj)
    //         // }

    //         // add object to canvas
    //         fabricRef.current?.add(enlivenedObj)
    //       })
    //     },
    //     /**
    //      * specify namespace of the object for fabric to render it on canvas
    //      * A namespace is a string that is used to identify the type of
    //      * object.
    //      *
    //      * Fabric Namespace: http://fabricjs.com/docs/fabric.html
    //      */
    //     'fabric'
    //   )
    // })
    // fabricRef.current?.renderAll()

    if (frameCanvasData) {
      canvas.loadFromJSON(frameCanvasData, () => {
        resizeCanvas({ fabricRef, canvasContainerRef })
      })
    } else {
      // Load frame template
      const template = MORAA_SLIDE_TEMPLATES.find(
        (t) => t.key === frameTemplate
      )

      if (template) {
        template.loadTemplate(canvas)
      }
    }

    setCanvas(canvas)

    canvas.on('object:added', async (options) => {
      handleCanvasObjectAdded({ options, fabricRef, frameId, saveToStorage })
    })
    canvas.on('object:modified', async (options) => {
      handleCanvasObjectModified({ options })
      saveToStorage(canvas)

      // Update active object
      const activeObject = canvas.getActiveObject()

      if (activeObject) {
        setActiveObject(activeObject)
      }
    })
    canvas.on('object:removed', async (options) => {
      handleCanvasObjectRemoved({ options })
      saveToStorage(canvas)
    })
    canvas.on('object:moving', async (options) => {
      handleCanvasObjectMoving({ options })
      // saveToStorage(canvas)
    })
    canvas.on('object:scaling', async (options) => {
      handleCanvasObjectScaling({ options })
      // saveToStorage(canvas)
    })
    canvas.on('object:rotating', async (options) => {
      handleCanvasObjectRotating({ options })
      // saveToStorage(canvas)
    })
    canvas.on('object:skewing', async (options) => {
      handleCanvasObjectSkewing({ options })
      // saveToStorage(canvas)
    })
    canvas.on('selection:created', async (options) => {
      handleCanvasSelectionCreated({ options, canvas })

      const activeObject = canvas.getActiveObject()

      if (activeObject) {
        setActiveObject(activeObject)
      }
    })
    canvas.on('selection:updated', async (options) => {
      handleCanvasSelectionUpdated({ options, canvas })

      const activeObject = canvas.getActiveObject()

      if (activeObject) {
        setActiveObject(activeObject)
      }
    })
    canvas.on('selection:cleared', async (options) => {
      handleCanvasSelectionCleared({ options })

      const activeObject = canvas.getActiveObject()

      if (activeObject) {
        setActiveObject(activeObject)
      }
    })

    // eslint-disable-next-line consistent-return
    return () => {
      canvas.off('object:added')
      canvas.off('object:modified')
      canvas.off('object:removed')
      canvas.off('object:moving')
      canvas.off('object:scaling')
      canvas.off('object:rotating')
      canvas.off('object:skewing')
      canvas.off('selection:created')
      canvas.off('selection:updated')
      canvas.off('selection:cleared')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameId, frameCanvasData])

  useEffect(() => {
    if (frameBackgroundColor) {
      fabricRef.current?.setBackgroundColor(`${frameBackgroundColor}E6`, () => {
        fabricRef.current?.renderAll()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameBackgroundColor])

  return (
    <div className="w-full h-full">
      <ResizeObserver
        onResize={() => {
          resizeCanvas({ fabricRef, canvasContainerRef })
        }}>
        <div
          ref={canvasContainerRef}
          className={cn(
            'relative flex-auto w-full aspect-video max-w-7xl m-auto ml-0 bg-transparent rounded-sm overflow-hidden',
            'border-2 border-black/10'
          )}>
          <canvas ref={canvasRef} id={`canvas-${frameId}`} />
          <BubbleMenu canvas={fabricRef.current!} />
        </div>
      </ResizeObserver>
    </div>
  )
}
