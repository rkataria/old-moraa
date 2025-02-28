import { useEffect, useState } from 'react'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'
import { fabric } from 'fabric'
import { BsTypeBold, BsTypeItalic } from 'react-icons/bs'
import { RiArrowDownSLine } from 'react-icons/ri'

import { BubbleMenuMoreOptions } from './BubbleMenuMoreOptions'
import { TYPOGRAPHY, TYPOGRAPHY_LIST } from './TextBox'
import { ColorPicker } from '../../ColorPicker'
import { NumberInputCaret } from '../../NumberInputCaret'

import { changeTextStyles } from '@/utils/moraa-slide'
import { loadFont } from '@/utils/utils'

export function TextboxBubbleMenu({ canvas }: { canvas: fabric.Canvas }) {
  const activeObject = canvas.getActiveObject() as fabric.Textbox
  const [typographyName, setTypographyName] = useState<string>('')

  useEffect(() => {
    if (!activeObject?.name) return

    setTypographyName(activeObject.name)
  }, [activeObject?.name])

  if (!activeObject || !activeObject.fontSize) return null

  const updateTypography = async (typography: TYPOGRAPHY) => {
    const fontLoaded = await loadFont(
      typography.fontFamily,
      typography.fontWeight
    )

    if (!fontLoaded) return

    const _activeObject = canvas.getActiveObject() as fabric.Textbox

    _activeObject.set('name', typography.name)
    _activeObject.set('fontFamily', typography.fontFamily)
    _activeObject.set('fontSize', typography.fontSize)
    _activeObject.set('fontWeight', typography.fontWeight)

    canvas.renderAll()
    canvas.fire('object:modified', { target: _activeObject })

    setTypographyName(typography.name)
  }

  return (
    <div className="flex justify-start items-center gap-1">
      {/* Typography */}
      <Dropdown showArrow offset={10}>
        <DropdownTrigger>
          <Button
            size="sm"
            variant="light"
            className="h-7 text-sm flex justify-center items-center gap-1 px-1">
            <span>{typographyName || activeObject.name}</span>
            <RiArrowDownSLine size={16} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          {TYPOGRAPHY_LIST.map((typography) => (
            <DropdownItem
              key={typography.name}
              className="px-2 h-8 hover:bg-gray-200"
              onClick={() => updateTypography(typography)}>
              <div className="flex justify-start items-center gap-2 p-1">
                <span>{typography.name}</span>
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

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
        selectedKeys={[activeObject.fontSize.toString()]}
        onChange={(value: number) => {
          changeTextStyles({
            canvas,
            activeObject,
            styles: { fontSize: Number(value) },
          })
        }}
      />

      {/* Text Color */}
      <div className="px-2 py-1.5 hover:bg-gray-100 rounded-sm">
        <ColorPicker
          className="h-4 w-4 border-2 border-black/20"
          defaultColor={activeObject.fill as string}
          onChange={(color) => {
            changeTextStyles({
              canvas,
              activeObject,
              styles: { fill: color },
              applyToSelection: true,
            })
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

          changeTextStyles({
            canvas,
            activeObject: _activeObject,
            styles: {
              fontWeight: _activeObject.fontWeight === 700 ? 400 : 700,
            },
            applyToSelection: true,
          })
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

          changeTextStyles({
            canvas,
            activeObject: _activeObject,
            styles: {
              fontStyle:
                _activeObject.fontStyle === 'italic' ? 'normal' : 'italic',
            },
            applyToSelection: true,
          })
        }}>
        <BsTypeItalic size={16} />
      </Button>
      <BubbleMenuMoreOptions />
    </div>
  )
}
