/* eslint-disable jsx-a11y/control-has-associated-label */

import { Select, SelectItem } from '@nextui-org/react'
import { fabric } from 'fabric'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { fonts } from '@/libs/fonts'
import { loadAndUseFont } from '@/libs/moraa-slide-editor'

type FontFamilyOption = {
  key: string
  label: string
}

const FONT_FAMILIES: FontFamilyOption[] = [
  {
    label: 'Times New Roman',
    key: 'Times New Roman',
  },
  {
    label: 'Inter',
    key: fonts.inter.style.fontFamily,
  },
  {
    label: 'Roboto Mono',
    key: fonts.robotoMono.style.fontFamily,
  },
  {
    label: 'Tilt Warp',
    key: fonts.tiltWarp.style.fontFamily,
  },
  {
    label: 'Poppins',
    key: fonts.poppins.style.fontFamily,
  },
  {
    label: 'Roboto',
    key: fonts.roboto.style.fontFamily,
  },
  {
    label: 'Oswald',
    key: fonts.oswald.style.fontFamily,
  },
  {
    label: 'Permanent Marker',
    key: fonts.permanentMarker.style.fontFamily,
  },
  {
    label: 'Monoton',
    key: fonts.monoton.style.fontFamily,
  },
  {
    label: 'Lobster',
    key: fonts.lobster.style.fontFamily,
  },
]

export function FontFamily() {
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject() as fabric.Textbox

  if (!activeObject) return null

  const selectedFontKey = FONT_FAMILIES.find((f) =>
    f.key.includes((activeObject as fabric.Textbox).fontFamily as string)
  )?.key

  return (
    <Select
      className="w-full flex-none text-xs"
      value={selectedFontKey}
      variant="bordered"
      classNames={
        {
          // mainWrapper: 'h-8',
        }
      }
      aria-label="Font Family"
      selectedKeys={selectedFontKey ? new Set([selectedFontKey]) : new Set()}
      onChange={(e) => {
        loadAndUseFont(canvas, activeObject, e.target.value)
      }}>
      {FONT_FAMILIES.map((_fontFamily: FontFamilyOption) => (
        <SelectItem
          key={_fontFamily.key}
          style={{
            fontFamily: _fontFamily.key,
          }}>
          {_fontFamily.label}
        </SelectItem>
      ))}
    </Select>
  )
}
