import { Input } from '@nextui-org/react'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { useStoreSelector } from '@/hooks/useRedux'

export function ObjectPosition() {
  const { canvas } = useMoraaSlideEditorContext()
  const activeObjectState = useStoreSelector(
    (state) => state.event.currentEvent.moraaSlideState.activeObject
  ) as fabric.Textbox

  if (!canvas) return null

  const activeObject = canvas.getActiveObject()

  if (!activeObject) return null

  const updatePosition = (
    key: 'left' | 'top' | 'width' | 'height',
    value: string
  ) => {
    if (key === 'width') {
      activeObject.scaleToWidth(parseInt(value, 10))
      canvas?.renderAll()

      return
    }

    if (key === 'height') {
      activeObject.scaleToHeight(parseInt(value, 10))
      canvas?.renderAll()

      return
    }

    activeObject.set(key, parseInt(value, 10))
    canvas?.renderAll()
  }

  const { left, top, width, height, scaleX, scaleY } = activeObjectState

  const objectWidth = width! * scaleX!
  const objectHeight = height! * scaleY!

  return (
    <div>
      <div className="py-2 grid grid-cols-2 gap-2">
        <Input
          type="number"
          size="sm"
          variant="bordered"
          radius="sm"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">Left: </span>
            </div>
          }
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">px</span>
            </div>
          }
          classNames={{
            input: 'text-right',
          }}
          defaultValue={Math.ceil(left!).toString()}
          onChange={(e) => updatePosition('left', e.target.value)}
        />
        <Input
          type="number"
          size="sm"
          variant="bordered"
          radius="sm"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">Top: </span>
            </div>
          }
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">px</span>
            </div>
          }
          classNames={{
            input: 'text-right',
          }}
          defaultValue={Math.ceil(top!).toString()}
          onChange={(e) => updatePosition('top', e.target.value)}
        />
        <Input
          type="number"
          size="sm"
          variant="bordered"
          radius="sm"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">Width: </span>
            </div>
          }
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">px</span>
            </div>
          }
          classNames={{
            input: 'text-right',
          }}
          defaultValue={Math.ceil(objectWidth!).toString()}
          onChange={(e) => updatePosition('width', e.target.value)}
        />
        <Input
          type="number"
          size="sm"
          variant="bordered"
          radius="sm"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">Height: </span>
            </div>
          }
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">px</span>
            </div>
          }
          classNames={{
            input: 'text-right',
          }}
          defaultValue={Math.ceil(objectHeight!).toString()}
          onChange={(e) => updatePosition('height', e.target.value)}
        />
      </div>
    </div>
  )
}
