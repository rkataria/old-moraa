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

import { useStoreSelector } from '@/hooks/useRedux'
import { loadFont } from '@/utils/utils'

export function TextboxBubbleMenu({ canvas }: { canvas: fabric.Canvas }) {
  const [typographyName, setTypographyName] = useState<string>('')
  const activeObjectState = useStoreSelector(
    (state) => state.event.currentEvent.moraaSlideState.activeObject
  ) as fabric.Textbox

  useEffect(() => {
    if (!activeObjectState?.name) return

    setTypographyName(activeObjectState.name)
  }, [activeObjectState?.name])

  if (!activeObjectState || !activeObjectState.fontSize) return null

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
            <span>{typographyName || activeObjectState.name}</span>
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
        number={activeObjectState.fontSize}
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
        selectedKeys={[activeObjectState.fontSize.toString()]}
        onChange={(value: number) => {
          const _activeObject = canvas.getActiveObject() as fabric.Textbox

          _activeObject.set('fontSize', Number(value))
          canvas.renderAll()
          canvas.fire('object:modified', { target: _activeObject })
        }}
      />

      {/* Text Color */}
      <div className="px-2 py-1.5 hover:bg-gray-100 rounded-sm">
        <ColorPicker
          className="h-4 w-4 border-2 border-black/20"
          defaultColor={activeObjectState.fill as string}
          onchange={(color) => {
            const _activeObject = canvas.getActiveObject() as fabric.Textbox

            _activeObject.set('fill', color)
            canvas.renderAll()
            canvas.fire('object:modified', { target: _activeObject })
          }}
        />
      </div>

      {/* Bold & Italic */}
      <Button
        size="sm"
        variant={activeObjectState.fontWeight === 700 ? 'flat' : 'light'}
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
            activeObjectState.fontWeight === 700 ? 400 : 700
          )
          canvas.renderAll()
          canvas.fire('object:modified', { target: _activeObject })
        }}>
        <BsTypeBold size={16} />
      </Button>
      <Button
        size="sm"
        variant={activeObjectState.fontStyle === 'italic' ? 'flat' : 'light'}
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
            activeObjectState.fontStyle === 'italic' ? 'normal' : 'italic'
          )
          canvas.renderAll()
          canvas.fire('object:modified', { target: _activeObject })
        }}>
        <BsTypeItalic size={16} />
      </Button>
      <BubbleMenuMoreOptions />
    </div>
  )
}
