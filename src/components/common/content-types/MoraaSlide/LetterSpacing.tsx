import { NumberInputCaret } from '../../NumberInputCaret'

import { useMoraaSlideStore } from '@/stores/moraa-slide.store'

export function LetterSpacing({ canvas }: { canvas: fabric.Canvas }) {
  const activeObject = useMoraaSlideStore(
    (state) => state.activeObject
  ) as fabric.Textbox

  if (!canvas || !activeObject) return null

  return (
    <div>
      <div className="py-2 flex justify-between items-center">
        <h3>Letter Spacing</h3>
        <NumberInputCaret
          number={activeObject.charSpacing}
          classNames={{
            input: 'bg-transparent border-2 border-black/10 h-7',
            caret: 'hover:bg-gray-200',
          }}
          onChange={(value: number) => {
            const _activeObject = canvas.getActiveObject() as fabric.Textbox

            _activeObject?.set('charSpacing', Number(value))
            canvas.renderAll()
          }}
        />
      </div>
    </div>
  )
}
