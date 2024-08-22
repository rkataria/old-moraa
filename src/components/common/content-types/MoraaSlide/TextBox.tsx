import { useState } from 'react'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { fabric } from 'fabric'
import { RxText } from 'react-icons/rx'

import { Tooltip } from '../../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { fonts } from '@/libs/fonts'
import { cn } from '@/utils/utils'

export type TYPOGRAPHY = {
  name: string
  fontSize: number
  fontWeight: number
  content?: string
}

export const TYPOGRAPHY_LIST: TYPOGRAPHY[] = [
  {
    name: 'Title',
    fontSize: 48,
    fontWeight: 700,
    content: 'Title Here',
  },
  {
    name: 'Subtitle',
    fontSize: 36,
    fontWeight: 500,
    content: 'Title Here',
  },
  {
    name: 'Heading',
    fontSize: 28,
    fontWeight: 500,
    content: 'Heading Here',
  },
  {
    name: 'Subheading',
    fontSize: 20,
    fontWeight: 400,
    content: 'Subheading Here',
  },
  {
    name: 'Body Text',
    fontSize: 16,
    fontWeight: 400,
    content: 'Body Text Here',
  },
  {
    name: 'Small Text',
    fontSize: 14,
    fontWeight: 400,
    content: 'Small Text Here',
  },
]

export function TextBox() {
  const [open, setOpen] = useState(false)
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const addTextbox = ({ name, fontSize, fontWeight, content }: TYPOGRAPHY) => {
    const textbox = new fabric.Textbox(content || name, {
      name,
      fontFamily: fonts.inter.style.fontFamily,
      fontSize,
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
    <Tooltip content="Text" placement="bottom">
      <div>
        <Dropdown showArrow offset={10} onOpenChange={setOpen}>
          <DropdownTrigger>
            <Button
              variant="light"
              size="lg"
              isIconOnly
              className={cn('flex flex-col justify-center items-center gap-1', {
                'bg-black text-white hover:bg-black hover:text-white': open,
              })}>
              <RxText size={18} />
              <span className="text-xs mt-1">Text</span>
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
