import { Slider } from '@nextui-org/react'

import { ColorPicker } from '../../ColorPicker'
import { LabelWithInlineControl } from '../../LabelWithInlineControl'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function Fill() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject()

  if (!activeObject) return null

  const fill = activeObject.get('fill')
  const strokeWidth = activeObject.get('strokeWidth')
  const strokeColor = activeObject.get('stroke')
  const opacity = activeObject.get('opacity')

  return (
    <div className="flex flex-col gap-3 pt-4">
      <LabelWithInlineControl
        label="Fill Color"
        className="items-center"
        control={
          <ColorPicker
            className="border-1 border-black/50"
            defaultColor={fill as string}
            onchange={(color) => {
              activeObject.set('fill', color)
              canvas.renderAll()
              canvas.fire('object:modified', { target: activeObject })
            }}
          />
        }
      />
      <LabelWithInlineControl
        label="Border Color"
        className="items-center"
        control={
          <ColorPicker
            className="border-1 border-black/50"
            defaultColor={strokeColor as string}
            onchange={(color) => {
              activeObject.set('stroke', color)
              canvas.renderAll()
            }}
          />
        }
      />
      <LabelWithInlineControl
        label="Border Width"
        className="flex-col"
        control={
          <Slider
            size="sm"
            showTooltip
            step={1}
            maxValue={40}
            minValue={0}
            aria-label="Stroke Width"
            className="w-full"
            value={strokeWidth}
            onChange={(value) => {
              activeObject.set('strokeWidth', value as number)
              canvas.renderAll()
            }}
          />
        }
      />
      <LabelWithInlineControl
        label="Opacity"
        className="flex-col"
        control={
          <Slider
            size="sm"
            showTooltip
            step={0.1}
            maxValue={1}
            minValue={0}
            aria-label="Opacity"
            className="w-full"
            value={opacity}
            onChange={(value) => {
              activeObject.set('opacity', value as number)
              canvas.renderAll()
            }}
          />
        }
      />
    </div>
  )
}
