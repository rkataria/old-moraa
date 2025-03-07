/* eslint-disable jsx-a11y/control-has-associated-label */

import { Select, SelectItem } from '@heroui/react'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { loadFont } from '@/utils/utils'

type SelectOption = {
  key: string
  label: string
}

const FONT_WEIGHTS: SelectOption[] = [
  {
    label: 'Thin',
    key: '200',
  },
  {
    label: 'Light',
    key: '300',
  },
  {
    label: 'Normal',
    key: '400',
  },
  {
    label: 'Semibold',
    key: '500',
  },
  {
    label: 'Bold',
    key: '700',
  },
  {
    label: 'Black',
    key: '900',
  },
]

export function FontWeight() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  const selectedFontKey = FONT_WEIGHTS.find((f) =>
    f.key.includes((activeObject as fabric.Textbox).fontWeight as string)
  )?.key

  return (
    <Select
      className="w-full max-w-[120px] flex-none text-xs"
      size="sm"
      value={selectedFontKey}
      variant="bordered"
      classNames={{
        trigger: 'border-1 rounded-md shadow-none',
      }}
      aria-label="Font Weight"
      selectedKeys={selectedFontKey ? new Set([selectedFontKey]) : new Set()}
      onChange={async (e) => {
        const fontWeight = e.target.value

        if (!fontWeight) return

        const fontLoaded = await loadFont(
          activeObject.fontFamily!,
          fontWeight as unknown as number
        )

        if (!fontLoaded) return

        activeObject.set('fontWeight', fontWeight)
        canvas.renderAll()
        canvas.fire('object:modified', { target: activeObject })
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
