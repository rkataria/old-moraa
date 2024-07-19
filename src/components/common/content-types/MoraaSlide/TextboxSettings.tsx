import { useContext } from 'react'

import { FontFamily } from './FontFamily'
import { TwoWayNumberCounter } from './FontSizeControl'
import { FontWeight } from './FontWeight'
import { TextAlignControls } from './TextAlignControls'
import { TextStyleControls } from './TextStyleControls'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function TextboxSettings() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const { setCanvas } = useMoraaSlideStore((state) => state)

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  const handleFontSizeChange = (size: number) => {
    activeObject.set('fontSize', size)
    canvas.renderAll()
    setCanvas(currentFrame?.id as string, canvas)
  }

  return (
    <div>
      <div className="py-2">
        <h3 className="font-semibold">Font</h3>
        <div className="pt-2 flex flex-col gap-2">
          <FontFamily />
          <div className="flex gap-2 justify-between items-center">
            <TwoWayNumberCounter
              defaultCount={activeObject.fontSize as number}
              onCountChange={handleFontSizeChange}
              noNegative
              incrementStep={1}
            />
            <FontWeight />
          </div>
        </div>
      </div>
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
