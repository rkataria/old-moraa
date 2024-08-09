import { useContext } from 'react'

import { NumberInputCaret } from '../../NumberInputCaret'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function RectSettings() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Rect

  if (!activeObject) return null

  return (
    <div>
      <div className="py-2 flex justify-between items-center">
        <h3>Rounded Corners</h3>
        <NumberInputCaret
          number={activeObject.rx}
          classNames={{
            input: 'bg-transparent border-2 border-black/20 h-7',
            caret: 'hover:bg-gray-200',
          }}
          onChange={(value: number) => {
            activeObject.set('rx', Number(value))
            activeObject.set('ry', Number(value))
            canvas.renderAll()
          }}
        />
      </div>
    </div>
  )
}
