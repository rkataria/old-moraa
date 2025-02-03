import { LabelWithInlineControl } from '../../LabelWithInlineControl'
import { NumberInputCaret } from '../../NumberInputCaret'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function LetterSpacing() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  return (
    <LabelWithInlineControl
      label="Letter Spacing"
      control={
        <NumberInputCaret
          number={activeObject.charSpacing}
          onChange={(value: number) => {
            activeObject?.set('charSpacing', Number(value))
            canvas.renderAll()
            canvas.fire('object:modified', { target: activeObject })
          }}
        />
      }
    />
  )
}
