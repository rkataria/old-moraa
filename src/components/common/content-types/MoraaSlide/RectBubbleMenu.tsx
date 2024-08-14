import { useState } from 'react'

import { fabric } from 'fabric'

import { BubbleMenuMoreOptions } from './BubbleMenuMoreOptions'
import { ColorPicker } from '../../ColorPicker'
import { NumberInputCaret } from '../../NumberInputCaret'

import { useMoraaSlideStore } from '@/stores/moraa-slide.store'

export function RectBubbleMenu({ canvas }: { canvas: fabric.Canvas }) {
  const activeObject = useMoraaSlideStore(
    (state) => state.activeObject
  ) as fabric.Rect
  const [stroke, setStroke] = useState<string>(activeObject.stroke as string)

  return (
    <div className="flex justify-start items-center gap-1">
      {/* Fill Color */}
      <div className="flex justify-start items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-sm text-sm">
        <ColorPicker
          className="h-4 w-4 border-2 border-black/20 cursor-pointer"
          defaultColor={activeObject.fill as string}
          onchange={(color) => {
            const _activeObject = canvas.getActiveObject() as fabric.Rect

            _activeObject.set('fill', color)
            canvas.renderAll()
            canvas.fire('object:modified', { target: _activeObject })
          }}
        />
        <span>Fill</span>
      </div>
      <div className="flex justify-start items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-sm text-sm">
        <ColorPicker
          className="h-4 w-4 cursor-pointer"
          defaultColor="transparent"
          style={{
            borderWidth: 3,
            borderColor: stroke || (activeObject.stroke as string) || 'black',
            backgroundColor: 'transparent',
          }}
          onchange={(color) => {
            setStroke(color)
            canvas.getActiveObject()?.set('stroke', color)
            canvas.renderAll()
          }}
        />
        <span>Border</span>
      </div>
      <NumberInputCaret
        number={activeObject.strokeWidth}
        onChange={(value: number) => {
          canvas.getActiveObject()?.set('strokeWidth', Number(value))
          canvas.renderAll()
        }}
      />

      <BubbleMenuMoreOptions />
    </div>
  )
}
