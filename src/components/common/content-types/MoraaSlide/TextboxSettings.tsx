import { FontFamily } from './FontFamily'
import { FontWeight } from './FontWeight'
import { LetterSpacing } from './LetterSpacing'
import { LineHeight } from './LineHeight'
import { TextAlignControls } from './TextAlignControls'
import { TextStyleControls } from './TextStyleControls'
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
