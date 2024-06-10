/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext } from 'react'

import FontFaceObserver from 'fontfaceobserver'

import { Select, SelectItem } from '@nextui-org/react'

import { CanvasFrameContext, CanvasFrameContextType } from './CanvasProvider'
import { FontSizeControl } from './FontSizeControl'

type FontFamilyOption = {
  key: string
  label: string
}

const FONT_FAMILIES: FontFamilyOption[] = [
  { key: 'Inter', label: 'Inter' },
  { key: 'Roboto', label: 'Roboto' },
  { key: 'Oswald', label: 'Oswald' },
  { key: 'Lobster', label: 'Lobster' },
]

function loadAndUse({ font, canvas }: { font: string; canvas: fabric.Canvas }) {
  const myfont = new FontFaceObserver(font)
  const activeObject = canvas?.getActiveObject() as fabric.Textbox
  myfont
    .load()
    .then(() => {
      activeObject.set('fontFamily', font)
      canvas?.renderAll()
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((e: any) => {
      // eslint-disable-next-line no-console
      console.error('Font loading failed: ', font, e)
    })
}

export function FontControls() {
  const { canvas } = useContext(CanvasFrameContext) as CanvasFrameContextType
  const activeObject = canvas?.getActiveObject() as fabric.Textbox

  return (
    <>
      <Select
        className="max-w-[120px] flex-none"
        defaultSelectedKeys={activeObject?.fontFamily || 'Inter'}
        classNames={{
          mainWrapper: 'h-8',
        }}
        aria-label="Font Family"
        onChange={(e) => {
          const font = e.target.value

          if (font) {
            loadAndUse({
              font: font as unknown as string,
              canvas: canvas as fabric.Canvas,
            })
          }
        }}>
        {FONT_FAMILIES.map((_fontFamily: FontFamilyOption) => (
          <SelectItem key={_fontFamily.key}>{_fontFamily.label}</SelectItem>
        ))}
      </Select>
      <FontSizeControl
        size={activeObject?.fontSize}
        onFontSizeChange={(size) => {
          activeObject?.set('fontSize', size)
          canvas?.renderAll()
        }}
      />
    </>
  )
}
