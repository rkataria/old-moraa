import { Input } from '@nextui-org/react'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function Position() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject()

  if (!activeObject) return null

  const updatePosition = (
    key: 'left' | 'top' | 'width' | 'height' | 'angle',
    value: string
  ) => {
    if (key === 'width') {
      activeObject.scaleToWidth(parseInt(value, 10))
      canvas.renderAll()

      return
    }

    if (key === 'height') {
      activeObject.scaleToHeight(parseInt(value, 10))
      canvas.renderAll()

      return
    }

    activeObject.set(key, parseInt(value, 10))
    canvas.renderAll()
  }

  const { left, top, width, height, scaleX, scaleY, angle } = activeObject

  const objectWidth = width! * scaleX!
  const objectHeight = height! * scaleY!

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          size="sm"
          variant="bordered"
          radius="sm"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">X: </span>
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
          value={Math.ceil(left!).toString()}
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
              <span className="text-default-400 text-small">Y: </span>
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
          value={Math.ceil(top!).toString()}
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
              <span className="text-default-400 text-small">W: </span>
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
          value={Math.ceil(objectWidth!).toString()}
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
              <span className="text-default-400 text-small">H: </span>
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
          value={Math.ceil(objectHeight!).toString()}
          onChange={(e) => updatePosition('height', e.target.value)}
        />
        <Input
          type="number"
          size="sm"
          variant="bordered"
          radius="sm"
          min={-360}
          max={360}
          step={1}
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">A: </span>
            </div>
          }
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">%</span>
            </div>
          }
          classNames={{
            input: 'text-right',
          }}
          value={Math.ceil(angle!).toString()}
          onChange={(e) => updatePosition('angle', e.target.value)}
        />
      </div>
    </div>
  )
}
