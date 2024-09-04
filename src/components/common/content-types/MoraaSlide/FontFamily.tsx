/* eslint-disable jsx-a11y/control-has-associated-label */

import { Select, SelectItem } from '@nextui-org/react'
import { fabric } from 'fabric'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { FONT_FAMILIES } from '@/libs/fonts'
import { loadAndUseFont } from '@/libs/moraa-slide-editor'

export function FontFamily() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  const selectedFontKey = FONT_FAMILIES.find((f) =>
    f.value.includes((activeObject as fabric.Textbox).fontFamily as string)
  )?.value

  return (
    <Select
      className="w-full flex-none text-xs"
      value={selectedFontKey}
      variant="bordered"
      size="sm"
      classNames={{
        trigger: 'border-1 rounded-md shadow-none',
      }}
      aria-label="Font Family"
      selectedKeys={selectedFontKey ? new Set([selectedFontKey]) : new Set()}
      onChange={(e) => {
        loadAndUseFont(canvas, activeObject, e.target.value)
      }}>
      {FONT_FAMILIES.map((_fontFamily) => (
        <SelectItem
          key={_fontFamily.value}
          style={{
            fontFamily: _fontFamily.value,
          }}>
          {_fontFamily.label}
        </SelectItem>
      ))}
    </Select>
  )
}
