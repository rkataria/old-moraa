import { NumberInputCaret } from '../../NumberInputCaret'

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

      return
    }

    if (key === 'height') {
      activeObject.scaleToHeight(parseInt(value, 10))
      canvas.renderAll()

      return
    }

    activeObject.set(key, parseInt(value, 10))
    canvas.renderAll()
  }

  const { left, top, width, height, scaleX, scaleY, angle } = activeObject

  const objectWidth = width! * scaleX!
  const objectHeight = height! * scaleY!

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 place-content-between">
        <div className="flex justify-start items-center gap-2">
          <span className="w-11">Left</span>
          <NumberInputCaret
            number={Math.ceil(left!)}
            selectOnFocus
            selectedKeys={[left!.toString()]}
            hideCaret
            onChange={(value: number) => {
              updatePosition('left', value.toString())
            }}
          />
        </div>
        <div className="flex justify-start items-center gap-2">
          <span className="w-11">Top</span>
          <NumberInputCaret
            number={Math.ceil(top!)}
            selectOnFocus
            selectedKeys={[top!.toString()]}
            hideCaret
            onChange={(value: number) => {
              updatePosition('top', value.toString())
            }}
          />
        </div>
        <div className="flex justify-start items-center gap-2">
          <span className="w-11">Width</span>
          <NumberInputCaret
            number={Math.ceil(objectWidth!)}
            selectOnFocus
            selectedKeys={[objectWidth!.toString()]}
            hideCaret
            onChange={(value: number) => {
              updatePosition('width', value.toString())
            }}
          />
        </div>
        <div className="flex justify-start items-center gap-2">
          <span className="w-11">Height</span>
          <NumberInputCaret
            number={Math.ceil(objectHeight!)}
            selectOnFocus
            selectedKeys={[objectHeight!.toString()]}
            hideCaret
            onChange={(value: number) => {
              updatePosition('height', value.toString())
            }}
          />
        </div>
        <div className="flex justify-start items-center gap-2">
          <span className="w-11">Rotate</span>
          <NumberInputCaret
            number={Math.ceil(angle!)}
            selectOnFocus
            selectedKeys={[angle!.toString()]}
            hideCaret
            onChange={(value: number) => {
              updatePosition('angle', value.toString())
            }}
          />
        </div>
      </div>
    </div>
  )
}
