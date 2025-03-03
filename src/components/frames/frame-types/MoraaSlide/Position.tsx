import { LabelWithInlineControl } from '@/components/common/LabelWithInlineControl'
import { NumberInputCaret } from '@/components/common/NumberInputCaret'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function Position() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject()

  if (!activeObject) return null

  const updatePosition = (
    key: 'left' | 'top' | 'width' | 'height' | 'angle',
    value: string
  ) => {
    if (key === 'width') {
      activeObject.scaleToWidth(parseInt(value, 10))
      canvas.renderAll()
      canvas.fire('object:modified', { target: activeObject })

      return
    }

    if (key === 'height') {
      activeObject.scaleToHeight(parseInt(value, 10))
      canvas.renderAll()
      canvas.fire('object:modified', { target: activeObject })

      return
    }

    activeObject.set(key, parseInt(value, 10))
    canvas.renderAll()
    canvas.fire('object:modified', { target: activeObject })
  }

  const { left, top, width, height, scaleX, scaleY, angle } = activeObject

  const objectWidth = width! * scaleX!
  const objectHeight = height! * scaleY!

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 place-content-between">
        <LabelWithInlineControl
          label="Left"
          control={
            <NumberInputCaret
              number={Math.ceil(left!)}
              selectOnFocus
              selectedKeys={[left!.toString()]}
              hideCaret
              onChange={(value: number) => {
                updatePosition('left', value.toString())
              }}
            />
          }
        />
        <LabelWithInlineControl
          label="Top"
          control={
            <NumberInputCaret
              number={Math.ceil(top!)}
              selectOnFocus
              selectedKeys={[top!.toString()]}
              hideCaret
              onChange={(value: number) => {
                updatePosition('top', value.toString())
              }}
            />
          }
        />

        <LabelWithInlineControl
          label="Width"
          control={
            <NumberInputCaret
              number={Math.ceil(objectWidth!)}
              selectOnFocus
              selectedKeys={[objectWidth!.toString()]}
              hideCaret
              onChange={(value: number) => {
                updatePosition('width', value.toString())
              }}
            />
          }
        />

        <LabelWithInlineControl
          label="Height"
          control={
            <NumberInputCaret
              number={Math.ceil(objectHeight!)}
              selectOnFocus
              selectedKeys={[objectHeight!.toString()]}
              hideCaret
              onChange={(value: number) => {
                updatePosition('height', value.toString())
              }}
            />
          }
        />

        <LabelWithInlineControl
          label="Rotate"
          control={
            <NumberInputCaret
              number={Math.ceil(angle!)}
              selectOnFocus
              selectedKeys={[angle!.toString()]}
              hideCaret
              onChange={(value: number) => {
                updatePosition('angle', value.toString())
              }}
            />
          }
        />
      </div>
    </div>
  )
}
