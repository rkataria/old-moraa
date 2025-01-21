import { useEffect, useState } from 'react'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from '@nextui-org/react'
import { MdOutlineDraw } from 'react-icons/md'

import { ColorPicker } from '../../ColorPicker'
import { LabelWithInlineControl } from '../../LabelWithInlineControl'
import { Tooltip } from '../../ShortuctTooltip'

import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { cn } from '@/utils/utils'

export function Draw() {
  const [fillColor, setFillColor] = useState<string>('#000000')
  const [strokeWidth, setStrokeWidth] = useState<number>(4)
  const [open, setOpen] = useState(false)
  const { canvas } = useMoraaSlideEditorContext()

  useEffect(() => {
    if (!canvas) return

    canvas.freeDrawingBrush.color = fillColor
    canvas.freeDrawingBrush.width = strokeWidth

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, fillColor, strokeWidth])

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
                    defaultColor={canvas.freeDrawingBrush.color as string}
                    onChange={setFillColor}
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
