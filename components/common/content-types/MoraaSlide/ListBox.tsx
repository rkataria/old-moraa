import { useContext, useState } from 'react'

import { fabric } from 'fabric'
import { IoListSharp } from 'react-icons/io5'

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

export const getBulletChar = (type: string) => {
  switch (type) {
    case 'bullet':
      return '•'
    case 'star':
      return '*'
    case 'dash':
      return '-'
    default:
      return '•'
  }
}

export function ListBox() {
  const [open, setOpen] = useState(false)
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const { setCanvas } = useMoraaSlideStore((state) => state)

  if (!canvas) return null

  const addList = (type: string) => {
    const textbox = new fabric.BulletList('Enter item here', {
      fontFamily: fonts.inter.style.fontFamily,
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
    setCanvas(currentFrame?.id as string, canvas)

    setOpen(false)
  }

  const addNumberList = () => {
    const textbox = new fabric.NumberList('Enter item here', {
      fontFamily: fonts.inter.style.fontFamily,
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
    setCanvas(currentFrame?.id as string, canvas)

    setOpen(false)
  }

  return (
    <Tooltip content="List" placement="bottom">
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
              <IoListSharp size={18} />
              <span className="text-xs mt-1">List</span>
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
