import { NumberInputCaret } from '@/components/common/NumberInputCaret'
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
          min={0}
          number={Math.ceil(activeObject.rx!)}
          onChange={(value: number) => {
            activeObject.set('rx', Number(value))
            activeObject.set('ry', Number(value))
            canvas.renderAll()
            canvas.fire('object:modified', { target: activeObject })
          }}
        />
      </div>
    </div>
  )
}
