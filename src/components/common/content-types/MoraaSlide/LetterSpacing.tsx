import { NumberInputCaret } from '../../NumberInputCaret'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function LetterSpacing() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

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
            activeObject?.set('charSpacing', Number(value))
            canvas.renderAll()
          }}
        />
      </div>
    </div>
  )
}
