import { NumberInputCaret } from '../../NumberInputCaret'

import { useMoraaSlideStore } from '@/stores/moraa-slide.store'

export function LineHeight({ canvas }: { canvas: fabric.Canvas }) {
  const activeObject = useMoraaSlideStore(
    (state) => state.activeObject
  ) as fabric.Textbox

  if (!canvas || !activeObject) return null

  return (
    <div>
      <div className="py-2 flex justify-between items-center">
        <h3>Line Height</h3>
        <NumberInputCaret
          number={activeObject.lineHeight}
          min={0.1}
          step={0.1}
          classNames={{
            input:
              'bg-transparent border-2 border-black/10 h-7 w-12 rounded-sm',
            caret: 'hover:bg-gray-200',
          }}
          onChange={(value: number) => {
            const _activeObject = canvas.getActiveObject() as fabric.Textbox

            _activeObject?.set('lineHeight', Number(value))
            canvas.renderAll()
          }}
        />
      </div>
    </div>
  )
}
