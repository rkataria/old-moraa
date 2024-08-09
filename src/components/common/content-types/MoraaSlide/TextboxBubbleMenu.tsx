import { useEffect, useState } from 'react'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { fabric } from 'fabric'
import { BsTypeBold, BsTypeItalic } from 'react-icons/bs'
import { RiArrowDownSLine } from 'react-icons/ri'

import { BubbleMenuMoreOptions } from './BubbleMenuMoreOptions'
import { TYPOGRAPHY, TYPOGRAPHY_LIST } from './TextBox'
import { ColorPicker } from '../../ColorPicker'
import { NumberInputCaret } from '../../NumberInputCaret'

export function TextboxBubbleMenu({ canvas }: { canvas: fabric.Canvas }) {
  const [typographyName, setTypographyName] = useState<string>('')
  const activeObject = canvas.getActiveObject() as fabric.Textbox

  useEffect(() => {
    if (!activeObject?.name) return

    setTypographyName(activeObject.name)
  }, [activeObject?.name])

  if (!activeObject) return null

  const updateTypography = (typography: TYPOGRAPHY) => {
    activeObject.set('name', typography.name)
    activeObject.set('fontSize', typography.fontSize)
    activeObject.set('fontWeight', typography.fontWeight)
    setTypographyName(typography.name)
    canvas.renderAll()
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
        onChange={(value: number) => {
          activeObject.set('fontSize', Number(value))
          canvas.renderAll()
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
          }}
        />
      </div>

      {/* Bold & Italic */}
      <Button
        size="sm"
        variant={activeObject.fontWeight === 700 ? 'flat' : 'light'}
        isIconOnly
        className="h-7 text-sm flex justify-center items-center gap-1 px-1"
        onClick={() => {
          activeObject.set(
            'fontWeight',
            activeObject.fontWeight === 700 ? 400 : 700
          )
          canvas.renderAll()
        }}>
        <BsTypeBold size={16} />
      </Button>
      <Button
        size="sm"
        variant={activeObject.fontStyle === 'italic' ? 'flat' : 'light'}
        isIconOnly
        className="h-7 text-sm flex justify-center items-center gap-1 px-1"
        onClick={() => {
          activeObject.set(
            'fontStyle',
            activeObject.fontStyle === 'italic' ? 'normal' : 'italic'
          )
          canvas.renderAll()
        }}>
        <BsTypeItalic size={16} />
      </Button>
      <BubbleMenuMoreOptions />
    </div>
  )
}
