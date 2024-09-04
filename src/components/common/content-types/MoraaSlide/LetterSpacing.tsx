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
          onChange={(value: number) => {
            activeObject?.set('charSpacing', Number(value))
            canvas.renderAll()
          }}
        />
      </div>
    </div>
  )
}
