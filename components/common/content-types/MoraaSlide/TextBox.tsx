import { useContext, useState } from 'react'

import { fabric } from 'fabric'
import { RxText } from 'react-icons/rx'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@nextui-org/react'

import { fonts } from '@/app/fonts'
import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

type TextStyle = {
  label: string
  fontSize: number
  fontWeight: 'bold' | 'normal' | '800'
}

export const MORAA_SLIDE_TYPOGRAPHY: TextStyle[] = [
  {
    label: 'Title',
    fontSize: 56,
    fontWeight: '800',
  },
  {
    label: 'Heading',
    fontSize: 48,
    fontWeight: '800',
  },
  {
    label: 'Subheading',
    fontSize: 42,
    fontWeight: '800',
  },
  {
    label: 'Normal Text',
    fontSize: 32,
    fontWeight: 'normal',
  },
  {
    label: 'Small Text',
    fontSize: 22,
    fontWeight: 'normal',
  },
  {
    label: 'Paragraph',
    fontSize: 18,
    fontWeight: 'normal',
  },
  {
    label: 'Extra Small Text',
    fontSize: 12,
    fontWeight: 'normal',
  },
]

export function TextBox() {
  const [open, setOpen] = useState(false)
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const { setCanvas } = useMoraaSlideStore((state) => state)

  if (!canvas) return null

  const addTextbox = ({ label, fontSize, fontWeight }: TextStyle) => {
    const textbox = new fabric.Textbox(label, {
      fontFamily: fonts.inter.style.fontFamily,
      fontSize,
      width: canvas.getWidth() * 0.3,
      fill: '#000',
      padding: 5,
      fontWeight,
      left: 100,
      top: 100,
    })

    setOpen(false)
    canvas.selection = true
    canvas.add(textbox)
    canvas.setActiveObject(textbox)
    setCanvas(currentFrame?.id as string, canvas)
  }

  return (
    <Tooltip content="Text" placement="bottom">
      <div>
        <Popover
          placement="bottom"
          offset={20}
          showArrow
          isOpen={open}
          onOpenChange={setOpen}>
          <PopoverTrigger>
            <Button
              variant="light"
              size="lg"
              radius="md"
              isIconOnly
              className={cn('flex flex-col justify-center items-center gap-1', {
                'bg-black text-white hover:bg-black hover:text-white': open,
              })}>
              <RxText size={18} />
              <span className="text-xs mt-1">Text</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 w-[200px] flex flex-col gap-2">
              {MORAA_SLIDE_TYPOGRAPHY.map((style) => (
                <button
                  key={style.label}
                  type="button"
                  className="flex justify-start items-center w-full hover:bg-gray-100 rounded-md"
                  style={{
                    fontFamily: fonts.inter.style.fontFamily,
                    fontSize: style.fontSize * 0.5,
                    fontWeight: style.fontWeight,
                    padding: `${style.fontSize * 0.2}px 8px`,
                  }}
                  onClick={() => addTextbox(style)}>
                  {style.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </Tooltip>
  )
}
