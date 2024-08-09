import { useEffect, useState } from 'react'

import { fabric } from 'fabric'

import { GroupBubbleMenu } from './GroupBubbleMenu'
import { ImageBubbleMenu } from './ImageBubbleMenu'
import { RectBubbleMenu } from './RectBubbleMenu'
import { TextboxBubbleMenu } from './TextboxBubbleMenu'

enum FabricObjectType {
  TEXTBOX = 'textbox',
  RECT = 'rect',
  CIRCLE = 'circle',
  POLYGON = 'polygon',
  IMAGE = 'image',
  PATH = 'path',
  GROUP = 'group',
  ACTIVE_SELECTION = 'activeSelection',
}

const calculateBubbleMenuPosition = (target: fabric.Object) => {
  const boundingBox = target.getBoundingRect()

  if (boundingBox.left > 0 && boundingBox.top > 60) {
    return {
      left: boundingBox.left || 5,
      top: boundingBox.top || 5,
    }
  }

  if (boundingBox.left < 0 && boundingBox.top > 60) {
    return {
      left: 5,
      top: boundingBox.top || 5,
    }
  }

  if (boundingBox.left > 0 && boundingBox.top < 60) {
    return {
      left: boundingBox.left || 5,
      top: 5,
    }
  }

  return {
    left: 5,
    top: 5,
  }
}

export function BubbleMenu({ canvas }: { canvas: fabric.Canvas }) {
  const [objectMoving, setObjectMoving] = useState<boolean>(false)
  const [bubbleMenuOptions, setBubbleMenuOptions] = useState<{
    left: number
    top: number
    visible: boolean
    type: string
  } | null>(null)

  useEffect(() => {
    if (!canvas) return

    canvas.on('selection:created', () => {
      const target = canvas.getActiveObject()
      if (target) {
        setBubbleMenuOptions({
          left: calculateBubbleMenuPosition(target).left,
          top: calculateBubbleMenuPosition(target).top,
          visible: true,
          type: target.type!,
        })
      } else {
        setBubbleMenuOptions(null)
      }
    })

    canvas.on('selection:updated', () => {
      const target = canvas.getActiveObject()
      if (target) {
        setBubbleMenuOptions({
          left: calculateBubbleMenuPosition(target).left,
          top: calculateBubbleMenuPosition(target).top,
          visible: true,
          type: target.type!,
        })
      } else {
        setBubbleMenuOptions(null)
      }
    })

    canvas.on('object:moving', () => {
      const target = canvas.getActiveObject()
      if (target) {
        setBubbleMenuOptions({
          left: calculateBubbleMenuPosition(target).left,
          top: calculateBubbleMenuPosition(target).top,
          visible: true,
          type: target.type!,
        })
      } else {
        setBubbleMenuOptions(null)
      }
      setObjectMoving(true)
    })

    canvas.on('object:modified', () => {
      setObjectMoving(false)
    })

    canvas.on('selection:cleared', () => {
      setBubbleMenuOptions(null)
    })

    // eslint-disable-next-line consistent-return
    return () => {
      canvas?.off('selection:created')
      canvas?.off('selection:updated')
      canvas?.off('object:moving')
      canvas?.off('selection:cleared')
    }
  }, [canvas])

  const renderersByObjectType: Record<FabricObjectType, React.ReactNode> = {
    [FabricObjectType.TEXTBOX]: <TextboxBubbleMenu canvas={canvas} />,
    [FabricObjectType.RECT]: <RectBubbleMenu canvas={canvas} />,
    [FabricObjectType.CIRCLE]: <RectBubbleMenu canvas={canvas} />,
    [FabricObjectType.POLYGON]: <RectBubbleMenu canvas={canvas} />,
    [FabricObjectType.IMAGE]: <ImageBubbleMenu canvas={canvas} />,
    [FabricObjectType.PATH]: null,
    [FabricObjectType.GROUP]: <GroupBubbleMenu canvas={canvas} />,
    [FabricObjectType.ACTIVE_SELECTION]: null,
  }

  if (!bubbleMenuOptions) return null

  const renderer =
    renderersByObjectType[bubbleMenuOptions.type as FabricObjectType]

  if (!renderer) return null

  return (
    <div
      className="absolute p-1 bg-white rounded-md shadow-sm min-w-11 border-1 border-primary-100"
      style={{
        left: bubbleMenuOptions?.left,
        top: (bubbleMenuOptions?.top || 5) - 60,
        display: bubbleMenuOptions?.visible ? 'block' : 'none',
        opacity: objectMoving ? 0.5 : 1,
      }}>
      {renderer}
    </div>
  )
}
