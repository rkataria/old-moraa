import { useState } from 'react'

import { fabric } from 'fabric'

import { BubbleMenuMoreOptions } from './BubbleMenuMoreOptions'

import { ColorPicker } from '@/components/common/ColorPicker'
import { NumberInputCaret } from '@/components/common/NumberInputCaret'

export function RectBubbleMenu({ canvas }: { canvas: fabric.Canvas }) {
  const activeObject = canvas.getActiveObject()

  const [stroke, setStroke] = useState<string>(activeObject?.stroke as string)

  if (!activeObject) return null

  return (
    <div className="flex justify-start items-center gap-1">
      {/* Fill Color */}
      <div className="flex justify-start items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-sm text-sm">
        <ColorPicker
          className="h-4 w-4 border-2 border-black/20"
          defaultColor={activeObject.fill as string}
          onChange={(color) => {
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
          className="h-4 w-4 border-2 border-black/20"
          defaultColor="transparent"
          style={{
            borderWidth: 3,
            borderColor: stroke || (activeObject.stroke as string) || 'black',
            backgroundColor: 'transparent',
          }}
          onChange={(color) => {
            setStroke(color)
            activeObject.set('stroke', color)
            canvas.renderAll()
            canvas.fire('object:modified', { target: activeObject })
          }}
        />
        <span>Border</span>
      </div>
      <NumberInputCaret
        number={activeObject.strokeWidth}
        onChange={(value: number) => {
          activeObject.set('strokeWidth', Number(value))
          canvas.renderAll()
          canvas.fire('object:modified', { target: activeObject })
        }}
      />

      <BubbleMenuMoreOptions />
    </div>
  )
}
