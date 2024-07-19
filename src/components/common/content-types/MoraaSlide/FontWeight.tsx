/* eslint-disable jsx-a11y/control-has-associated-label */

import { useContext } from 'react'

import { Select, SelectItem } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

type SelectOption = {
  key: string
  label: string
}

const FONT_WEIGHTS: SelectOption[] = [
  {
    label: 'Normal',
    key: 'normal',
  },
  {
    label: 'Semibold',
    key: '600',
  },
  {
    label: 'Bold',
    key: '800',
  },
]

export function FontWeight() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const { setCanvas } = useMoraaSlideStore((state) => state)

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  const selectedFontKey = FONT_WEIGHTS.find((f) =>
    f.key.includes(activeObject?.fontWeight as string)
  )?.key

  return (
    <Select
      className="w-full max-w-[120px] flex-none text-xs"
      value={selectedFontKey}
      variant="bordered"
      classNames={{
        mainWrapper: 'h-8',
      }}
      aria-label="Font Weight"
      selectedKeys={selectedFontKey ? new Set([selectedFontKey]) : new Set()}
      onChange={(e) => {
        const fontWeight = e.target.value
        const _activeObject = canvas.getActiveObject() as fabric.Textbox

        if (fontWeight) {
          _activeObject.set('fontWeight', fontWeight)
          canvas.renderAll()
          setCanvas(currentFrame?.id as string, canvas)
        }
      }}>
      {FONT_WEIGHTS.map((_fontWeight: SelectOption) => (
        <SelectItem
          key={_fontWeight.key}
          style={{
            fontFamily: _fontWeight.key,
          }}>
          {_fontWeight.label}
        </SelectItem>
      ))}
    </Select>
  )
}
