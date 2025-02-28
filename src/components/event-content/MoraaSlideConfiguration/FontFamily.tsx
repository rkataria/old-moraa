/* eslint-disable jsx-a11y/control-has-associated-label */

import { Select, SelectItem } from '@heroui/react'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { FONT_FAMILIES } from '@/libs/fonts'
import { loadAndUseFont } from '@/libs/moraa-slide-editor'

export function FontFamily() {
  const { canvas } = useMoraaSlideEditorContext()
  const activeObjectState = useStoreSelector(
    (state) => state.event.currentEvent.moraaSlideState.activeObject
  ) as fabric.Textbox

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  const selectedFontKey = FONT_FAMILIES.find((f) =>
    f.value.includes(activeObjectState.fontFamily as string)
  )?.value

  return (
    <Select
      className="w-full flex-none text-xs"
      value={selectedFontKey}
      variant="bordered"
      classNames={{
        mainWrapper: 'h-8',
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
