import { FontFamily } from './FontFamily'
import { FontWeight } from './FontWeight'
import { LetterSpacing } from './LetterSpacing'
import { LineHeight } from './LineHeight'
import { TextAlignControls } from './TextAlignControls'
import { TextStyleControls } from './TextStyleControls'
import { LabelWithInlineControl } from '../../LabelWithInlineControl'
import { NumberInputCaret } from '../../NumberInputCaret'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { changeTextStyles } from '@/utils/moraa-slide'

export function TextboxSettings() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  return (
    <div>
      <div className="py-2">
        <h3 className="font-semibold">Font</h3>
        <div className="pt-2 flex flex-col gap-2">
          <FontFamily />
          <div className="flex gap-2 justify-between items-center">
            <div className="flex justify-start items-center gap-2">
              {/* <span className="w-11">Size</span> */}
              <NumberInputCaret
                number={Math.ceil((activeObject as fabric.Textbox).fontSize!)}
                selectOnFocus
                selectedKeys={[
                  (activeObject as fabric.Textbox).fontSize!.toString(),
                ]}
                onChange={(size) =>
                  changeTextStyles({
                    canvas,
                    activeObject,
                    styles: { fontSize: size },
                  })
                }
              />
            </div>
            <FontWeight />
          </div>
        </div>
      </div>
      <div className="grid gap-4 py-4">
        <LetterSpacing />
        <LineHeight />
        <LabelWithInlineControl
          label="Alignment"
          className="flex-col items-start w-full"
          control={
            <div className="pt-2 flex gap-2 w-full">
              <TextAlignControls />
            </div>
          }
        />
        <LabelWithInlineControl
          label="Text Style"
          className="flex-col items-start w-full"
          control={
            <div className="pt-2 flex gap-2 w-full">
              <TextStyleControls />
            </div>
          }
        />
      </div>
    </div>
  )
}
