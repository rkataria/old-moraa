import { fabric } from 'fabric'
import { BsTypeBold, BsTypeItalic } from 'react-icons/bs'

import { BubbleMenuMoreOptions } from './BubbleMenuMoreOptions'
import { ColorPicker } from '../../ColorPicker'
import { NumberInputCaret } from '../../NumberInputCaret'

import { Button } from '@/components/ui/Button'
import { loadFont } from '@/utils/utils'

export function ListBubbleMenu({ canvas }: { canvas: fabric.Canvas }) {
  const activeObject = canvas.getActiveObject() as fabric.BulletList

  if (!activeObject) return null

  return (
    <div className="flex justify-start items-center gap-1">
      {/* Font Size */}
      <NumberInputCaret
        number={activeObject.fontSize}
        min={10}
        selectOnFocus
        dropdownItems={[
          {
            name: '14',
            value: 14,
          },
          {
            name: '16',
            value: 16,
          },
          {
            name: '20',
            value: 20,
          },
          {
            name: '24',
            value: 24,
          },
          {
            name: '32',
            value: 32,
          },
          {
            name: '48',
            value: 48,
          },
          {
            name: '64',
            value: 64,
          },
          {
            name: '128',
            value: 128,
          },
        ]}
        selectedKeys={[activeObject.fontSize?.toString() as string]}
        onChange={(value: number) => {
          activeObject.set('fontSize', Number(value))
          canvas.renderAll()
          canvas.fire('object:modified', { target: activeObject })
        }}
      />
      {/* Text Color */}
      <div className="px-2 py-1.5 hover:bg-gray-100 rounded-sm">
        <ColorPicker
          className="h-4 w-4 border-2 border-black/20"
          defaultColor={activeObject.fill as string}
          onchange={(color) => {
            activeObject.set('fill', color)
            canvas.renderAll()
            canvas.fire('object:modified', { target: activeObject })
          }}
        />
      </div>

      {/* Bold & Italic */}
      <Button
        size="sm"
        variant={activeObject.fontWeight === 700 ? 'flat' : 'light'}
        isIconOnly
        className="h-7 text-sm flex justify-center items-center gap-1 px-1"
        onClick={async () => {
          const _activeObject = canvas.getActiveObject() as fabric.Textbox

          const fontLoaded = await loadFont(
            _activeObject.fontFamily!,
            _activeObject.fontWeight === 700 ? 400 : 700
          )

          if (!fontLoaded) return

          _activeObject.set(
            'fontWeight',
            _activeObject.fontWeight === 700 ? 400 : 700
          )
          canvas.fire('object:modified', { target: activeObject })
        }}>
        <BsTypeBold size={16} />
      </Button>
      <Button
        size="sm"
        variant={activeObject.fontStyle === 'italic' ? 'flat' : 'light'}
        isIconOnly
        className="h-7 text-sm flex justify-center items-center gap-1 px-1"
        onClick={async () => {
          const _activeObject = canvas.getActiveObject() as fabric.Textbox
          const fontLoaded = await loadFont(
            _activeObject.fontFamily!,
            _activeObject.fontWeight as number,
            _activeObject.fontStyle === 'italic' ? 'normal' : 'italic'
          )

          if (!fontLoaded) return

          _activeObject.set(
            'fontStyle',
            _activeObject.fontStyle === 'italic' ? 'normal' : 'italic'
          )
          canvas.fire('object:modified', { target: activeObject })
        }}>
        <BsTypeItalic size={16} />
      </Button>
      <BubbleMenuMoreOptions />
    </div>
  )
}
