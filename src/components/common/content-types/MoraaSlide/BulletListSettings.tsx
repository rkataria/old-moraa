/* eslint-disable react/button-has-type */
import { useContext } from 'react'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'

import { BULLET_CHARS, BULLET_TYPES, getBulletChar } from './ListBox'
import { LabelWithInlineControl } from '../../LabelWithInlineControl'

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
        BULLET_CHARS.includes(line?.[0])
          ? `${getBulletChar(type)} ${line.slice(2)}`
          : line
      )
      .join('\n')

    activeObject.set('text', updatedText)
    activeObject.set('bulletType', type)
    canvas.renderAll()
    canvas.fire('object:modified')
    setCanvas(currentFrame?.id as string, canvas)
  }

  return (
    <LabelWithInlineControl
      label="Bullet Type"
      className="py-2 font-semibold justify-between items-center"
      control={
        <BulletTypeDropdown
          type={activeObject.bulletType!}
          onChange={updateBulletType}
        />
      }
    />
  )
}

function BulletTypeDropdown({
  type,
  onChange,
}: {
  type: string
  onChange: (type: string) => void
}) {
  const items = Object.keys(BULLET_TYPES).map((key) => (
    <Button
      size="sm"
      variant="flat"
      isIconOnly
      radius="full"
      onClick={() => onChange(key)}>
      {BULLET_TYPES[key]}
    </Button>
  ))

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button size="sm" variant="flat" isIconOnly radius="full">
          {BULLET_TYPES[type]}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[200px]">
        <div className="px-0 py-1 flex flex-wrap gap-1">{items}</div>
      </PopoverContent>
    </Popover>
  )
}
