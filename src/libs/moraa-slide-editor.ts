/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { fabric } from 'fabric'
import { AlignGuidelines } from 'fabric-guideline-plugin'

import {
  CanvasObjectAdded,
  CanvasObjectModified,
  CanvasObjectRemoved,
  CanvasSelectionCleared,
  CanvasSelectionCreated,
  CanvasSelectionUpdated,
} from '@/types/moraa-slide.type'
import { loadCustomFabricObjects } from '@/utils/custom-fabric-objects'
import { supabaseClient } from '@/utils/supabase/client'

export const initialSetup = () => {
  loadCustomFabricObjects()

  // eslint-disable-next-line wrap-iife, func-names
  fabric.Textbox.prototype.toObject = function () {
    // eslint-disable-next-line func-names
    // @ts-expect-error silence!
    return fabric.util.object.extend(this.callSuper('toObject'), {
      name: this.name,
    })
  }

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
  // // Add a transparent rect to the canvas to enable guidelines
  // const rect = new fabric.Rect({
  //   width: canvas.width,
  //   height: canvas.height,
  //   fill: 'transparent',
  //   selectable: false,
  //   evented: false,
  // })

  // canvas.add(rect)
  // canvas.renderAll()

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

  const scale = container.width / fabricRef.current.getWidth()
  const zoom = fabricRef.current.getZoom() * scale

  fabricRef.current?.setDimensions({
    width: container?.width || 0,
    height: container?.height || 0,
  })

  fabricRef.current.setViewportTransform([zoom, 0, 0, zoom, 0, 0])

  fabricRef.current.renderAll()
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!target.uuid) {
    saveToStorage(fabricRef.current!)
  }
}

export const handleCanvasObjectModified = async ({
  options,
}: CanvasObjectModified) => {
  console.log('handleCanvasObjectModified', options)
}

export const handleCanvasObjectMoving = ({ options }: CanvasObjectModified) => {
  console.log('handleCanvasObjectMoving', options)
}

export const handleCanvasObjectScaling = ({
  options,
}: CanvasObjectModified) => {
  console.log('handleCanvasObjectScaling', options)
}

export const handleCanvasObjectRotating = ({
  options,
}: CanvasObjectModified) => {
  console.log('handleCanvasObjectRotating', options)
}

export const handleCanvasObjectSkewing = ({
  options,
}: CanvasObjectModified) => {
  console.log('handleCanvasObjectSkewing', options)
}

export const handleCanvasObjectRemoved = ({ options }: CanvasObjectRemoved) => {
  console.log('handleCanvasObjectRemoved', options)
}

export const handleCanvasSelectionCreated = ({
  options,
  canvas,
}: CanvasSelectionCreated) => {
  console.log('handleCanvasSelectionCreated', options)

  setObjectControlsVisibility(canvas)
}

export const handleCanvasSelectionUpdated = ({
  options,
  canvas,
}: CanvasSelectionUpdated) => {
  console.log('handleCanvasSelectionUpdated', options)

  setObjectControlsVisibility(canvas)
}

export const handleCanvasSelectionCleared = ({
  options,
}: CanvasSelectionCleared) => {
  console.log('handleCanvasSelectionCleared', options)
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
