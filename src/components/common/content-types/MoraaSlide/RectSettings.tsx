import { NumberInputCaret } from '../../NumberInputCaret'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function RectSettings() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Rect

  if (!activeObject) return null

  return (
    <div>
      <div className="py-2 flex justify-between items-center">
        <h3>Rounded Corners</h3>
        <NumberInputCaret
          number={activeObject.left}
          classNames={{
            input: 'bg-transparent border-2 border-black/20 h-7',
            caret: 'hover:bg-gray-200',
          }}
          onChange={(value: number) => {
            // activeObject.set('rx', Number(value))
            // activeObject.set('ry', Number(value))
            activeObject.set('left', value)
            canvas.renderAll()
          }}
        />
      </div>
    </div>
  )
}
