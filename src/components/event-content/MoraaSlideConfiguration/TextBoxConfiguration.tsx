import { FontFamily } from './FontFamily'
import { FontSize } from './FontSize'
import { FontWeight } from './FontWeight'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { useStoreSelector } from '@/hooks/useRedux'

export function TextboxConfiguration() {
  const { canvas } = useMoraaSlideEditorContext()
  const activeObjectState = useStoreSelector(
    (state) => state.event.currentEvent.moraaSlideState.activeObject
  )

  if (!canvas) return null

  const handleFontWeightChange = (weight: string) => {
    const activeObject = canvas.getActiveObject() as fabric.Textbox
    activeObject.set('fontWeight', weight)
    canvas.renderAll()
  }

  return (
    <div>
      <div className="py-2">
        <h3 className="font-semibold">Font</h3>
        <div className="pt-2 flex flex-col gap-2">
          <div className="flex gap-2 justify-between items-center">
            <FontSize />
            <FontWeight
              weight={
                (activeObjectState as fabric.Textbox).fontWeight as string
              }
              onFontWeightChange={handleFontWeightChange}
            />
          </div>
          <FontFamily />
        </div>
      </div>
    </div>
  )
}
