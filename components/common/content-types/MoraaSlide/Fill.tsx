import { useContext } from 'react'

import { Slider } from '@nextui-org/react'

import { ColorPicker } from '../../ColorPicker'
import { LabelWithInlineControl } from '../../LabelWithInlineControl'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function Fill() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const { setCanvas } = useMoraaSlideStore((state) => state)

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
        label="Fill"
        className="items-center"
        control={
          <ColorPicker
            className="border-1 border-black/50"
            defaultColor={fill as string}
            onchange={(color) => {
              activeObject.set('fill', color)
              canvas.renderAll()
              setCanvas(currentFrame?.id as string, canvas)
            }}
          />
        }
      />
      <LabelWithInlineControl
        label="Stroke Color"
        className="items-center"
        control={
          <ColorPicker
            className="border-1 border-black/50"
            defaultColor={strokeColor as string}
            onchange={(color) => {
              activeObject.set('stroke', color)
              canvas.renderAll()
              setCanvas(currentFrame?.id as string, canvas)
            }}
          />
        }
      />
      <LabelWithInlineControl
        label="Stroke Width"
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
              setCanvas(currentFrame?.id as string, canvas)
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
              setCanvas(currentFrame?.id as string, canvas)
            }}
          />
        }
      />
    </div>
  )
}
