import { useContext, useEffect, useState } from 'react'

import { MdOutlineDraw } from 'react-icons/md'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
  Tooltip,
} from '@nextui-org/react'

import { ColorPicker } from '../../ColorPicker'
import { LabelWithInlineControl } from '../../LabelWithInlineControl'

import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function Draw() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const [fillColor, setFillColor] = useState<string>('#000000')
  const [strokeWidth, setStrokeWidth] = useState<number>(4)
  const [open, setOpen] = useState(false)
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )
  const { setCanvas } = useMoraaSlideStore((state) => state)

  useEffect(() => {
    if (!canvas) return

    canvas.freeDrawingBrush.color = fillColor
    canvas.freeDrawingBrush.width = strokeWidth

    setCanvas(currentFrame?.id as string, canvas)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, fillColor, strokeWidth, currentFrame?.id])

  if (!canvas) return null

  return (
    <Tooltip content="Draw" placement="bottom">
      <div>
        <Popover
          placement="bottom"
          offset={20}
          showArrow
          shouldCloseOnBlur
          isOpen={open}
          onOpenChange={setOpen}>
          <PopoverTrigger>
            <Button
              variant="light"
              size="lg"
              radius="md"
              isIconOnly
              className={cn('flex flex-col justify-center items-center gap-1', {
                'bg-black text-white hover:bg-black hover:text-white':
                  open || canvas.isDrawingMode,
              })}
              onClick={() => {
                canvas.isDrawingMode = true
                canvas.selection = false
                setCanvas(currentFrame?.id as string, canvas)
              }}>
              <MdOutlineDraw size={18} />
              <span className="text-xs mt-1">Draw</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 w-[200px] flex flex-col gap-2">
              <Slider
                label="Stroke Width"
                step={2}
                maxValue={20}
                minValue={2}
                size="sm"
                defaultValue={canvas.freeDrawingBrush.width}
                value={strokeWidth}
                onChange={(w) => setStrokeWidth(w as number)}
              />
              <LabelWithInlineControl
                label="Fill Color"
                control={
                  <ColorPicker
                    className="border-1 border-black/50"
                    defaultColor={canvas.freeDrawingBrush.color as string}
                    onchange={setFillColor}
                  />
                }
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </Tooltip>
  )
}
