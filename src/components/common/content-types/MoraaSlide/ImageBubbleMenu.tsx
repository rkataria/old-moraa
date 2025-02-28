import { useCallback } from 'react'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'
import { fabric } from 'fabric'
import { BsShadows } from 'react-icons/bs'
import { SlRefresh } from 'react-icons/sl'

import { BubbleMenuMoreOptions } from './BubbleMenuMoreOptions'
import { MediaPicker } from '../../MediaPicker/MediaPicker'

import { cn } from '@/utils/utils'

type SHADOW = {
  name: string
  shadow: string
  shadowOptions: {
    color: string
    opacity?: number
    blur: number
    offsetX: number
    offsetY: number
  }
}

const SHADOWS: SHADOW[] = [
  {
    name: 'None',
    shadow: 'none',
    shadowOptions: {
      color: 'white',
      blur: 0,
      offsetX: 0,
      offsetY: 0,
    },
  },
  {
    name: 'Soft',
    shadow: '0px 2px 4px 0px rgba(0,0,0,0.20)',
    shadowOptions: {
      color: 'rgba(0,0,0,0.20)',
      blur: 30,
      offsetX: 25,
      offsetY: 25,
    },
  },
  {
    name: 'Regular',
    shadow: '0px 2px 4px 0px rgba(0,0,0,0.50)',
    shadowOptions: {
      color: 'rgba(0,0,0,0.50)',
      blur: 10,
      offsetX: 20,
      offsetY: 20,
    },
  },
  {
    name: 'Retro',
    shadow: '2px 2px 0px 0px rgba(109,40,217)',
    shadowOptions: {
      color: 'rgba(109,40,217)',
      blur: 0,
      offsetX: 15,
      offsetY: 15,
    },
  },
]

export function ImageBubbleMenu({ canvas }: { canvas: fabric.Canvas }) {
  const replaceImage = useCallback(
    (imageElement: HTMLImageElement, _activeObject: fabric.Image) => {
      if (!imageElement) return
      if (!_activeObject) return

      const oldImageWidth = Math.round(_activeObject.getScaledWidth()) ?? 300
      const oldImageHeight = Math.round(_activeObject.getScaledHeight()) ?? 300

      const newImageWidth = imageElement.width
      const newImageHeight = imageElement.height

      const scaleX = oldImageWidth / newImageWidth
      const scaleY = oldImageHeight / newImageHeight

      _activeObject.setElement(imageElement, {
        width: newImageWidth,
        height: newImageHeight,
        scaleX,
        scaleY,
      })

      canvas.renderAll()
      canvas.fire('object:modified', { target: _activeObject })
    },
    [canvas]
  )

  const addShadow = (shadow: SHADOW) => {
    if (!shadow) return

    const shadowObject = new fabric.Shadow(shadow.shadowOptions)
    const activeObject = canvas.getActiveObject()

    if (!activeObject) return

    activeObject.set('shadow', shadowObject)
    canvas.renderAll()
    canvas.fire('object:modified', { target: activeObject })
  }

  return (
    <div className="flex justify-start items-center gap-1">
      <MediaPicker
        crop
        trigger={
          <Button
            size="sm"
            radius="md"
            variant="light"
            className="h-7 text-sm flex justify-center items-center gap-1 px-1">
            <SlRefresh size={16} />
            <span>Replace</span>
          </Button>
        }
        onSelect={(file) => {
          const _activeObject = canvas.getActiveObject() as fabric.Image
          const reader = new FileReader()

          reader.addEventListener(
            'load',
            () => {
              const img = new Image()

              img.onload = () => {
                replaceImage(img, _activeObject)
              }

              img.src = reader.result as string
            },
            false
          )

          if (file) {
            reader.readAsDataURL(file)
          }
        }}
        onSelectCallback={(imageElement) => {
          replaceImage(imageElement, canvas.getActiveObject() as fabric.Image)
        }}
      />
      <Dropdown showArrow offset={10}>
        <DropdownTrigger>
          <Button
            size="sm"
            radius="md"
            variant="light"
            className="h-7 text-sm flex justify-center items-center gap-1 px-1">
            <BsShadows size={16} />
            <span>Shadow</span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          {SHADOWS.map((shadow) => (
            <DropdownItem key={shadow.name} onClick={() => addShadow(shadow)}>
              <div className="flex justify-start items-center gap-2 p-1">
                <div
                  style={{
                    boxShadow: shadow.shadow,
                  }}
                  className={cn(
                    'w-6 h-6 border-1 border-primary-200 rounded-sm'
                  )}
                />
                <span>{shadow.name}</span>
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <BubbleMenuMoreOptions />
    </div>
  )
}
