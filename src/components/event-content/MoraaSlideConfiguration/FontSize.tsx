import { ButtonGroup } from '@nextui-org/react'
import { useHotkeys } from 'react-hotkeys-hook'

import { Button } from '@/components/ui/Button'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { useStoreSelector } from '@/hooks/useRedux'

export function FontSize() {
  const { canvas } = useMoraaSlideEditorContext()
  const activeObjectState = useStoreSelector(
    (state) => state.event.currentEvent.moraaSlideState.activeObject
  ) as fabric.Textbox

  useHotkeys('-', () => {
    handleFontSizeChange(fontSize - 1)
  })
  useHotkeys('+', () => {
    handleFontSizeChange(fontSize + 1)
  })

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  const fontSize = activeObjectState.fontSize as number

  const handleFontSizeChange = (newSize: number) => {
    activeObject.set('fontSize', newSize)
    canvas?.renderAll()
  }

  return (
    <ButtonGroup>
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
