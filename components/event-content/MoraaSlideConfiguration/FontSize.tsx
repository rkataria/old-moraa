import { useContext } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import { Button, ButtonGroup } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function FontSize() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const activeObject = canvas?.getActiveObject() as fabric.Textbox

  const fontSize = activeObject?.fontSize as number

  // hotkeys
  useHotkeys('-', () => {
    handleFontSizeChange(fontSize - 1)
  })
  useHotkeys('-', () => {
    handleFontSizeChange(fontSize + 1)
  })

  const handleFontSizeChange = (newSize: number) => {
    activeObject.set('fontSize', newSize)
    canvas?.renderAll()
  }

  return (
    <ButtonGroup radius="md">
      <Button
        size="sm"
        variant="flat"
        className="flex-none"
        onClick={() => handleFontSizeChange(fontSize - 1)}>
        -
      </Button>
      <input
        className="w-8 h-8 text-sm text-center border-y-2 border-gray-100 bg-white flex-none"
        value={fontSize}
        onChange={(e) => handleFontSizeChange(+e.target.value)}
      />
      <Button
        size="sm"
        variant="flat"
        className="flex-none"
        onClick={() => handleFontSizeChange(fontSize + 1)}>
        +
      </Button>
    </ButtonGroup>
  )
}
