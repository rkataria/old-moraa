import { FontFamily } from './FontFamily'
import { TwoWayNumberCounter } from './FontSizeControl'
import { FontWeight } from './FontWeight'
import { LetterSpacing } from './LetterSpacing'
import { LineHeight } from './LineHeight'
import { TextAlignControls } from './TextAlignControls'
import { TextStyleControls } from './TextStyleControls'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function TextboxSettings() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  const handleFontSizeChange = (size: number) => {
    activeObject.set('fontSize', size)
    canvas.renderAll()
  }

  return (
    <div>
      <div className="py-2">
        <h3 className="font-semibold">Font</h3>
        <div className="pt-2 flex flex-col gap-2">
          <FontFamily />
          <div className="flex gap-2 justify-between items-center">
            <TwoWayNumberCounter
              defaultCount={(activeObject as fabric.Textbox).fontSize as number}
              onCountChange={handleFontSizeChange}
              noNegative
              incrementStep={1}
            />
            <FontWeight />
          </div>
        </div>
      </div>
      <LetterSpacing />
      <LineHeight />
      <div className="py-2">
        <h3 className="font-semibold">Alignment</h3>
        <div className="pt-2 flex gap-2">
          <TextAlignControls />
        </div>
      </div>
      <div className="py-2">
        <h3 className="font-semibold">Text Style</h3>
        <div className="pt-2 flex gap-2">
          <TextStyleControls />
        </div>
      </div>
    </div>
  )
}
