/* eslint-disable react/button-has-type */
import { useContext } from 'react'

import { getBulletChar } from './ListBox'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function BulletListSettings() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const { setCanvas } = useMoraaSlideStore((state) => state)

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  const updateBulletType = (type: string) => {
    const currentBulletType = activeObject.get('bulletType')
    if (currentBulletType === type) return

    const { text } = activeObject

    const updatedText = text
      ?.split('\n')
      .map((line) =>
        line.startsWith(getBulletChar(currentBulletType!))
          ? line.replace(
              `\n${getBulletChar(currentBulletType!)}`,
              `\n${getBulletChar(type)}`
            )
          : `${getBulletChar(type)} ${line}`
      )
      .join('\n')

    activeObject.set('text', updatedText)
    activeObject.set('bulletType', type)
    canvas.renderAll()
    setCanvas(currentFrame?.id as string, canvas)
  }

  return (
    <div>
      <div className="py-2">
        <h3 className="font-semibold">Bullet Type</h3>
        <div className="pt-2 flex gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
            onClick={() => updateBulletType('bullet')}>
            •
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
            onClick={() => updateBulletType('star')}>
            *
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
            onClick={() => updateBulletType('dash')}>
            -
          </button>
        </div>
      </div>
    </div>
  )
}
