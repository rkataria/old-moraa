/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { fabric } from 'fabric'
import { AlignGuidelines } from 'fabric-guideline-plugin'

import { setActiveObjectAction } from '@/stores/slices/event/current-event/moraa-slide.slice'
import {
  CanvasObjectAdded,
  CanvasObjectModified,
  CanvasObjectMoving,
  CanvasObjectRemoved,
  CanvasObjectRotating,
  CanvasObjectScaling,
  CanvasObjectSkewing,
  CanvasSelectionCleared,
  CanvasSelectionCreated,
  CanvasSelectionUpdated,
  CanvasTextSelectionChanged,
} from '@/types/moraa-slide.type'
import { loadCustomFabricObjects } from '@/utils/custom-fabric-objects'
import { supabaseClient } from '@/utils/supabase/client'

export const initialSetup = () => {
  loadCustomFabricObjects()

  fabric.Object.prototype.transparentCorners = false
  fabric.Object.prototype.cornerColor = '#7C3AED'
  fabric.Object.prototype.cornerSize = 10
  fabric.Object.prototype.borderColor = '#7C3AED'
  fabric.Object.prototype.cornerStyle = 'circle'
  fabric.Object.prototype.setControlsVisibility({
    mt: false,
    mb: false,
    ml: false,
    mr: false,
  })
  fabric.Object.prototype.set('padding', 10)
  fabric.Image.prototype.strokeWidth = 0
  fabric.Object.prototype.objectCaching = true
}

export const initializeFabric = ({
  fabricRef,
  canvasRef,
  canvasContainerRef,
}: {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
  canvasContainerRef?: React.MutableRefObject<HTMLDivElement | null>
}) => {
  const container = canvasContainerRef?.current?.getBoundingClientRect()

  if (fabricRef.current) return fabricRef.current

  const canvas = new fabric.Canvas(canvasRef.current, {
    width: container?.width,
    height: container?.height,
    selectionBorderColor: '#979797',
    selectionColor: 'transparent',
    selectionDashArray: [4, 4],
    selectionLineWidth: 1,
    backgroundColor: 'transparent',
    centeredRotation: true,
    selection: true,
    selectionKey: 'ctrlKey',
  })

  fabricRef.current = canvas

  return canvas
}

export const enableGuidelines = (canvas: fabric.Canvas) => {
  const guideline = new AlignGuidelines({
    canvas,
  })

  guideline.init()
}

export const resizeCanvas = ({
  fabricRef,
  canvasContainerRef,
}: {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>
  canvasContainerRef: React.MutableRefObject<HTMLDivElement | null>
}) => {
  if (!fabricRef.current || !canvasContainerRef.current) return

  const container = canvasContainerRef.current?.getBoundingClientRect()

  fabricRef.current?.setDimensions(
    {
      width: `${container?.width || 0}px`,
      height: `${container?.height || 0}px`,
    },
    {
      cssOnly: true,
    }
  )

  fabricRef.current?.renderAll()
}

export const renderCanvas = ({
  objects,
  fabricRef,
}: {
  objects: fabric.Object[]
  fabricRef: React.MutableRefObject<fabric.Canvas | null>
}) => {
  console.log('renderCanvas')

  if (!fabricRef.current) return

  // Clear canvas
  fabricRef.current.clear()

  // Add objects to canvas
  objects.forEach((object) => {
    fabricRef.current?.add(object)
  })

  fabricRef.current.renderAll()
}

export const handleCanvasObjectAdded = ({
  options,
  fabricRef,
  // frameId,
  saveToStorage,
}: CanvasObjectAdded) => {
  console.log('handleCanvasObjectAdded', options)

  const { target } = options

  if (!target) return

  if (target.type === 'textbox') {
    loadAndUseFont(
      fabricRef.current!,
      target as fabric.Textbox,
      (target as fabric.Textbox).fontFamily!
    )
  }

  if (target.name === 'guide-rect') {
    target.set({
      hoverCursor: 'context-menu',
    })
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!target.uuid) {
    saveToStorage(fabricRef.current!)
  }
}

export const handleCanvasObjectModified = async ({
  options,
  canvas,
  dispatch,
  saveToStorage,
}: CanvasObjectModified) => {
  console.log('handleCanvasObjectModified', options)
  const activeObject = canvas.getActiveObject()

  if (activeObject) {
    dispatch(setActiveObjectAction(activeObject))
  }

  saveToStorage(canvas)
}

export const handleCanvasObjectMoving = ({
  options,
  canvas,
  dispatch,
}: CanvasObjectMoving) => {
  console.log('handleCanvasObjectMoving', options)
  const activeObject = canvas.getActiveObject()

  if (!activeObject) return

  dispatch(setActiveObjectAction(activeObject))
}

export const handleCanvasObjectScaling = ({
  options,
  canvas,
  dispatch,
}: CanvasObjectScaling) => {
  console.log('handleCanvasObjectScaling', options)
  const activeObject = canvas.getActiveObject()

  if (!activeObject) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch(setActiveObjectAction(activeObject))
}

export const handleCanvasObjectRotating = ({
  options,
  canvas,
  dispatch,
}: CanvasObjectRotating) => {
  console.log('handleCanvasObjectRotating', options)
  const activeObject = canvas.getActiveObject()

  if (!activeObject) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch(setActiveObjectAction(activeObject))
}

export const handleCanvasObjectSkewing = ({
  options,
  canvas,
  dispatch,
}: CanvasObjectSkewing) => {
  console.log('handleCanvasObjectSkewing', options)
  const activeObject = canvas.getActiveObject()

  if (!activeObject) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch(setActiveObjectAction(activeObject))
}

export const handleCanvasObjectRemoved = ({
  options,
  canvas,
  saveToStorage,
}: CanvasObjectRemoved) => {
  console.log('handleCanvasObjectRemoved', options)

  saveToStorage(canvas)
}

export const handleCanvasSelectionCreated = ({
  options,
  canvas,
  dispatch,
}: CanvasSelectionCreated) => {
  console.log('handleCanvasSelectionCreated', options)
  setObjectControlsVisibility(canvas)

  const activeObject = canvas.getActiveObject()

  if (!activeObject) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch(setActiveObjectAction(activeObject))
}

export const handleCanvasSelectionUpdated = ({
  options,
  canvas,
  dispatch,
}: CanvasSelectionUpdated) => {
  console.log('handleCanvasSelectionUpdated', options)

  setObjectControlsVisibility(canvas)

  const activeObject = canvas.getActiveObject()

  if (!activeObject) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch(setActiveObjectAction(activeObject))
}

export const handleCanvasSelectionCleared = ({
  options,
  dispatch,
}: CanvasSelectionCleared) => {
  console.log('handleCanvasSelectionCleared', options)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch(setActiveObjectAction(undefined))
}

export const handleCanvasTextSelectionChanged = ({
  options,
  canvas,
  dispatch,
}: CanvasTextSelectionChanged) => {
  console.log('handleCanvasTextSelectionChanged', options)

  setObjectControlsVisibility(canvas)

  const activeObject = canvas.getActiveObject()

  console.log('handleCanvasTextSelectionChanged activeObject', activeObject)

  if (!activeObject) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch(setActiveObjectAction(activeObject))
}

export const handleDeleteObjects = (canvas: fabric.Canvas) => {
  const activeObjects = canvas.getActiveObjects()

  if (activeObjects.length > 0) {
    canvas.discardActiveObject()
    activeObjects.forEach((object) => {
      canvas.remove(object)
    })
  }

  canvas.renderAll()
}

export const syncToStorage = async (
  canvas: fabric.Canvas,
  frameId: string,
  objectId: string,
  object: fabric.Object
) => {
  console.log('syncToStorage', canvas.getObjects())

  const { data, error } = await supabaseClient.rpc(
    'add_or_replace_object_in_frame',
    {
      p_frame_id: frameId,
      p_object_id: objectId,
      p_object_value: JSON.stringify(object),
    }
  )

  console.log(data, error)
}

export const copyObjects = (
  canvas: fabric.Canvas,
  onClone: (clonedObject: fabric.Object) => void
) => {
  const activeObject = canvas.getActiveObject()

  if (activeObject) {
    activeObject.clone((cloned: fabric.Object) => {
      onClone(cloned)
    })
  }
}

export const cutObject = (
  canvas: fabric.Canvas,
  onClone: (clonedObject: fabric.Object) => void
) => {
  const activeObject = canvas.getActiveObject()

  if (activeObject) {
    activeObject.clone((cloned: fabric.Object) => {
      const originalOpacity = cloned.get('opacity')
      cloned.set('data', { cut: true, originalOpacity })
      cloned.set('opacity', 0.5)

      canvas.remove(activeObject)
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.requestRenderAll()
      onClone(cloned)
    })
  }
}

export const pasteObjects = ({
  canvas,
  copiedObject,
  onClone,
  onPaste,
}: {
  canvas: fabric.Canvas
  copiedObject: fabric.Object
  onClone?: (clonedObject: fabric.Object) => void
  onPaste?: (clonedObject: fabric.Object) => void
}) => {
  if (!copiedObject) return

  copiedObject.clone((clonedObject: fabric.Object) => {
    canvas.discardActiveObject()
    clonedObject.set({
      left: clonedObject.left! + 10,
      top: clonedObject.top! + 10,
      evented: true,
      opacity: copiedObject.get('data')?.cut
        ? copiedObject.get('data')?.originalOpacity
        : copiedObject.opacity,
    })
    if (clonedObject.type === 'activeSelection') {
      // active selection needs a reference to the canvas.
      clonedObject.canvas = canvas
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      clonedObject.forEachObject((object: fabric.Object) => {
        canvas.add(object)
      })
      // this should solve the unselectability
      clonedObject.setCoords()
    } else {
      canvas.add(clonedObject)
    }
    onPaste?.(clonedObject)
    onClone?.(clonedObject)

    // Delete the original object if it was cut
    if (copiedObject.get('data')?.cut) {
      canvas.remove(copiedObject)
    }

    canvas.setActiveObject(clonedObject)
    canvas.requestRenderAll()
  })
}

export const setObjectControlsVisibility = (canvas: fabric.Canvas) => {
  const activeObject = canvas.getActiveObject()

  if (!activeObject) return

  switch (activeObject?.type) {
    case 'BulletList':
    case 'NumberList':
    case 'textbox':
      activeObject.setControlsVisibility({
        tl: false,
        tr: false,
        bl: false,
        br: false,
        mt: false,
        mb: false,
        ml: true,
        mr: true,
      })
      break
    default:
      activeObject.setControlsVisibility({
        tl: true,
        tr: true,
        bl: true,
        br: true,
        mt: false,
        mb: false,
        ml: false,
        mr: false,
      })
      break
  }

  canvas.renderAll()
}

export const loadAndUseFont = async (
  canvas: fabric.Canvas,
  textObject: fabric.Textbox,
  fontFamily: string
) => {
  fabric.util.clearFabricFontCache()
  textObject.set('fontFamily', fontFamily)
  canvas.renderAll()
  canvas.fire('object:modified')
}
