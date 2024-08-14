import { useContext } from 'react'

import { FontFamily } from './FontFamily'
import { FontSize } from './FontSize'
import { FontWeight } from './FontWeight'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function TextboxConfiguration() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const activeObject = useMoraaSlideStore((state) => state.activeObject)

  if (!canvas) return null

  const handleFontWeightChange = (weight: string) => {
    const _activeObject = canvas.getActiveObject() as fabric.Textbox

    _activeObject.set('fontWeight', weight)
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
              weight={(activeObject as fabric.Textbox).fontWeight as string}
              onFontWeightChange={handleFontWeightChange}
            />
          </div>
          <FontFamily />
        </div>
      </div>
    </div>
  )
}
