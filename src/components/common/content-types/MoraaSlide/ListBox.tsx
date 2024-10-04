/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { fabric } from 'fabric'
import { IoListSharp } from 'react-icons/io5'

import { Tooltip } from '../../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { DEFAULT_FONT_FAMILY } from '@/libs/fonts'
import { cn } from '@/utils/utils'

export const BULLET_TYPES: {
  [key: string]: string
} = {
  bullet: '•',
  arrow: '➤',
  blackPoint: '⦿',
  arrowRight: '➔',
  check: '✓',
}
export const BULLET_CHARS: string[] = Object.values(BULLET_TYPES)

export const getBulletChar = (type: string) => BULLET_TYPES[type]

export function ListBox({
  hideLabel = false,
  small = false,
}: {
  hideLabel?: boolean
  small?: boolean
}) {
  const [open, setOpen] = useState(false)
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const addList = (type: string) => {
    const textbox = new fabric.BulletList('Enter item here', {
      fontFamily: DEFAULT_FONT_FAMILY,
      width: 300,
      fontSize: 18,
      padding: 5,
      left: 100,
      top: 100,
      bulletType: type,
    })

    canvas.selection = true
    canvas.add(textbox)
    canvas.setActiveObject(textbox)
    canvas.renderAll()

    setOpen(false)
  }

  const addNumberList = () => {
    const textbox = new fabric.NumberList('Enter item here', {
      fontFamily: DEFAULT_FONT_FAMILY,
      width: 300,
      fontSize: 18,
      padding: 5,
      left: 100,
      top: 100,
      bulletType: 'number',
    })

    canvas.selection = true
    canvas.add(textbox)
    canvas.setActiveObject(textbox)
    canvas.renderAll()

    setOpen(false)
  }

  return (
    <Tooltip content="List" placement="top">
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
              size={small ? 'sm' : 'lg'}
              isIconOnly
              className={cn('flex flex-col justify-center items-center gap-1', {
                'bg-black text-white hover:bg-black hover:text-white': open,
              })}>
              <IoListSharp size={18} />
              {!hideLabel && <span className="text-xs mt-1">List</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <div className="p-2 flex flex-col gap-2">
              <button
                type="button"
                className="flex justify-start items-center w-full hover:bg-gray-100 rounded-md text-base px-2 py-1"
                onClick={() => addList('bullet')}>
                Bullet List
              </button>
              <button
                type="button"
                className="flex justify-start items-center w-full hover:bg-gray-100 rounded-md text-base px-2 py-1"
                onClick={addNumberList}>
                Number List
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </Tooltip>
  )
}
