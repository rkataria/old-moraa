import { useState } from 'react'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'
import { fabric } from 'fabric'
import { RxText } from 'react-icons/rx'

import { Tooltip } from '@/components/common/ShortuctTooltip'
import { Button } from '@/components/ui/Button'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { DEFAULT_FONT_FAMILY } from '@/libs/fonts'
import { cn } from '@/utils/utils'

export type TYPOGRAPHY = {
  name: string
  fontSize: number
  fontWeight: number
  fontFamily: string
  content?: string
}

export const TYPOGRAPHY_LIST: TYPOGRAPHY[] = [
  {
    name: 'Title',
    fontSize: 72,
    fontWeight: 700,
    fontFamily: 'Poppins',
    content: 'Title Here',
  },
  {
    name: 'Subtitle',
    fontSize: 40,
    fontWeight: 500,
    fontFamily: 'Poppins',
    content: 'Subtitle Here',
  },
  {
    name: 'Heading',
    fontSize: 32,
    fontWeight: 500,
    fontFamily: 'Poppins',
    content: 'Heading Here',
  },
  {
    name: 'Subheading',
    fontSize: 24,
    fontWeight: 400,
    fontFamily: 'Poppins',
    content: 'Subheading Here',
  },
  {
    name: 'Body Text',
    fontSize: 22,
    fontWeight: 400,
    fontFamily: 'Poppins',
    content: 'Body Text Here',
  },
  {
    name: 'Small Text',
    fontSize: 18,
    fontWeight: 400,
    fontFamily: 'Poppins',
    content: 'Small Text Here',
  },
]

export function TextBox({
  hideLabel = false,
  small = false,
}: {
  hideLabel?: boolean
  small?: boolean
}) {
  const [open, setOpen] = useState(false)
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const addTextbox = ({ name, fontSize, fontWeight, content }: TYPOGRAPHY) => {
    const textbox = new fabric.Textbox(content || name, {
      name,
      fontFamily: DEFAULT_FONT_FAMILY,
      fontSize,
      lineHeight: 1.5,
      width: canvas.getWidth() * 0.3,
      fill: '#000',
      padding: 5,
      fontWeight,
      left: 100,
      top: 100,
      splitByGrapheme: true,
    })

    setOpen(false)
    canvas.selection = true
    canvas.add(textbox)
    canvas.setActiveObject(textbox)
    canvas.renderAll()
  }

  return (
    <Tooltip content="Text" placement="top">
      <div>
        <Dropdown showArrow offset={10} onOpenChange={setOpen}>
          <DropdownTrigger>
            <Button
              variant="light"
              size={small ? 'sm' : 'lg'}
              isIconOnly
              className={cn('flex flex-col justify-center items-center gap-1', {
                'bg-black text-white hover:bg-black hover:text-white': open,
              })}>
              <RxText size={18} />
              {!hideLabel && <span className="text-xs mt-1">Text</span>}
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            {TYPOGRAPHY_LIST.map((typography) => (
              <DropdownItem
                key={typography.name}
                className="px-2 h-8 hover:bg-gray-200"
                onClick={() => addTextbox(typography)}>
                <div className="flex justify-start items-center gap-2 p-1">
                  <span>{typography.name}</span>
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </Tooltip>
  )
}
