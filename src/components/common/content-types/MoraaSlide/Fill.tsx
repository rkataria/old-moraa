import { Slider } from '@heroui/react'

import { ColorPicker } from '../../ColorPicker'
import { LabelWithInlineControl } from '../../LabelWithInlineControl'
import { RenderIf } from '../../RenderIf/RenderIf'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { changeTextStyles } from '@/utils/moraa-slide'

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
        label={
          ['textbox', 'BulletList', 'NumberList'].includes(activeObject.type!)
            ? 'Text Color'
            : 'Fill Color'
        }
        className="items-center"
        control={
          <ColorPicker
            defaultColor={fill as string}
            onChange={(color) => {
              const { type } = activeObject
              if (type === 'textbox') {
                changeTextStyles({
                  canvas,
                  styles: { fill: color },
                  applyToSelection: true,
                })
              } else if (type === 'group') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const objects = activeObject.getObjects()
                objects.forEach((object: fabric.Object) =>
                  object.set('fill', color)
                )
              } else {
                activeObject.set('fill', color)
              }

              canvas.renderAll()
              canvas.fire('object:modified', { target: activeObject })
            }}
          />
        }
      />
      <RenderIf
        isTrue={
          !['textbox', 'BulletList', 'NumberList'].includes(activeObject.type!)
        }>
        <LabelWithInlineControl
          label="Border Color"
          className="items-center"
          control={
            <ColorPicker
              defaultColor={strokeColor || undefined}
              onChange={(color) => {
                const { type } = activeObject

                if (type === 'group') {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  const objects = activeObject.getObjects()
                  objects.forEach((object: fabric.Object) =>
                    object.set('stroke', color)
                  )
                } else {
                  activeObject.set('stroke', color)
                }

                canvas.renderAll()
                canvas.fire('object:modified', { target: activeObject })
              }}
            />
          }
        />
      </RenderIf>
      <RenderIf
        isTrue={
          !['textbox', 'BulletList', 'NumberList'].includes(activeObject.type!)
        }>
        <LabelWithInlineControl
          label="Border Width"
          className="flex-col items-start"
          control={
            <Slider
              key={strokeWidth} // NOTE: This is a hack to force the slider to re-render when the strokeWidth changes
              size="sm"
              showTooltip
              step={1}
              maxValue={40}
              minValue={0}
              aria-label="Stroke Width"
              className="w-full"
              defaultValue={strokeWidth as number}
              onChange={(value) => {
                const { type } = activeObject

                if (type === 'group') {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  const objects = activeObject.getObjects()
                  objects.forEach((object: fabric.Object) =>
                    object.set('strokeWidth', value as number)
                  )
                } else {
                  activeObject.set('strokeWidth', value as number)
                }

                canvas.renderAll()
                canvas.fire('object:modified', { target: activeObject })
              }}
            />
          }
        />
      </RenderIf>
      <LabelWithInlineControl
        label="Opacity"
        className="flex-col items-start"
        control={
          <Slider
            key={opacity} // NOTE: This is a hack to force the slider to re-render when the opacity changes
            size="sm"
            showTooltip
            step={0.1}
            maxValue={1}
            minValue={0}
            aria-label="Opacity"
            className="w-full"
            defaultValue={opacity as number}
            onChange={(value) => {
              activeObject.set('opacity', value as number)
              canvas.renderAll()
              canvas.fire('object:modified', { target: activeObject })
            }}
          />
        }
      />
    </div>
  )
}
