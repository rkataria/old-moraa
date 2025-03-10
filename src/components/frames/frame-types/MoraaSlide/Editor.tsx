import { useEffect, useRef } from 'react'

import { fabric } from 'fabric'
import ResizeObserver from 'rc-resize-observer'

import { BubbleMenu } from './BubbleMenu'
import { LoadFonts } from './LoadFonts'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { useMoraaSlideShortcuts } from '@/hooks/useMoraaSlideShortcuts'
import { useStoreDispatch } from '@/hooks/useRedux'
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
  handleCanvasTextSelectionChanged,
  initializeFabric,
  initialSetup,
  resizeCanvas,
} from '@/libs/moraa-slide-editor'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { setActiveObjectAction } from '@/stores/slices/event/current-event/moraa-slide.slice'
import { MORAA_SLIDE_TEMPLATES } from '@/utils/moraa-slide-templates'

interface MoraaSlideEditorProps {
  frameId: string
  frameTemplate: string
  frameCanvasData: string | null
  frameSvgData: string | null
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
  frameSvgData,
  frameBackgroundColor,
  saveToStorage,
}: MoraaSlideEditorProps) {
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement | null>(null)

  const { setCanvas } = useMoraaSlideEditorContext()
  const { setHistory } = useMoraaSlideStore()
  useMoraaSlideShortcuts()
  const dispatch = useStoreDispatch()

  useEffect(() => {
    dispatch(setActiveObjectAction(undefined))
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

    if (frameCanvasData) {
      canvas.loadFromJSON(frameCanvasData, () => {
        resizeCanvas({ fabricRef, canvasContainerRef })
      })
    } else if (frameSvgData) {
      fabric.loadSVGFromString(frameSvgData, (objects, options) => {
        const group = new fabric.Group(objects, options)
        group.scaleToWidth(canvas.getWidth())
        canvas.add(group)
        resizeCanvas({ fabricRef, canvasContainerRef })
      })
    } else {
      // Load frame template
      const template = MORAA_SLIDE_TEMPLATES.find(
        (t) => t.key === frameTemplate
      )

      if (template) {
        const _canvas = template.loadTemplate(fabricRef.current!)

        // NOTE: This is a workaround to fix the issue where the canvas is not rendered when the template is loaded, canvas object added event is not triggered and the canvas is not saved to storage when the template is loaded
        saveToStorage(_canvas)
      }
    }

    canvas.on('object:added', async (options) => {
      // TODO: This event is not triggered when canvas data/template is loaded
      handleCanvasObjectAdded({ options, fabricRef, frameId, saveToStorage })
    })
    canvas.on('object:modified', async (options) => {
      handleCanvasObjectModified({ options, canvas, dispatch, saveToStorage })
    })
    canvas.on('object:removed', async (options) => {
      handleCanvasObjectRemoved({ options, canvas, dispatch, saveToStorage })
    })
    canvas.on('object:moving', async (options) => {
      handleCanvasObjectMoving({ options, canvas, dispatch })
      // saveToStorage(canvas)
    })
    canvas.on('object:scaling', async (options) => {
      handleCanvasObjectScaling({ options, canvas, dispatch })
      // saveToStorage(canvas)
    })
    canvas.on('object:rotating', async (options) => {
      handleCanvasObjectRotating({ options, canvas, dispatch })
      // saveToStorage(canvas)
    })
    canvas.on('object:skewing', async (options) => {
      handleCanvasObjectSkewing({ options, canvas, dispatch })
      // saveToStorage(canvas)
    })
    canvas.on('selection:created', async (options) => {
      handleCanvasSelectionCreated({ options, canvas, dispatch })
    })
    canvas.on('selection:updated', async (options) => {
      handleCanvasSelectionUpdated({ options, canvas, dispatch })
    })
    canvas.on('selection:cleared', async (options) => {
      handleCanvasSelectionCleared({ options, dispatch })
    })
    canvas.on('text:selection:changed', async (options) => {
      handleCanvasTextSelectionChanged({ options, canvas, dispatch })
    })

    setCanvas(canvas)

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
  }, [frameId, frameCanvasData, frameTemplate])

  useEffect(() => {
    if (frameBackgroundColor) {
      fabricRef.current?.setBackgroundColor(`${frameBackgroundColor}E6`, () => {
        fabricRef.current?.renderAll()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameBackgroundColor])

  return (
    <div className="relative flex-auto h-full w-auto aspect-video max-w-7xl m-auto ml-0 bg-transparent rounded-md overflow-hidden border-gray-200 border-1">
      <LoadFonts />
      <ResizeObserver
        onResize={() => {
          resizeCanvas({ fabricRef, canvasContainerRef })
        }}>
        <div ref={canvasContainerRef} className="w-full h-full">
          <canvas ref={canvasRef} id={`canvas-${frameId}`} />
          <BubbleMenu canvas={fabricRef.current!} />
        </div>
      </ResizeObserver>
    </div>
  )
}
