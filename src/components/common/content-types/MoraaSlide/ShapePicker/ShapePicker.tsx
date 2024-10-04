/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { LuShapes } from 'react-icons/lu'

import { SHAPE_TYPES, ShapePickerContent } from './ShapePickerContent'
import { SideMenuItem } from './SideMenuItem'

import { Tooltip } from '@/components/common/ShortuctTooltip'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/utils'

const MENU_OPTIONS = [
  {
    label: SHAPE_TYPES.BASIC,
  },
  {
    label: SHAPE_TYPES.LINES,
    disabled: true,
  },
  {
    label: SHAPE_TYPES.BANNERS,
    disabled: true,
  },
  {
    label: SHAPE_TYPES.CALLOUTS,
    disabled: true,
  },
  {
    label: SHAPE_TYPES.STARS_AND_BUBBLES,
    disabled: true,
  },
  {
    label: SHAPE_TYPES.LINES_AND_DIVIDERS,
    disabled: true,
  },
  {
    label: SHAPE_TYPES.CLIPART,
    disabled: true,
  },
]

type ShapePickerProps = {
  trigger?: React.ReactNode
  hideLabel?: boolean
  small?: boolean
  onSelect: (file: File) => void
  onSelectCallback: (svg: string) => void
}

export function ShapePicker({
  hideLabel,
  small,
  trigger,
  onSelect,
  onSelectCallback,
}: ShapePickerProps) {
  const [open, setOpen] = useState(false)
  const [shapeType, setShapeType] = useState<SHAPE_TYPES>(SHAPE_TYPES.BASIC)

  return (
    <Popover
      placement="bottom"
      offset={10}
      showArrow
      isOpen={open}
      onOpenChange={setOpen}>
      <PopoverTrigger>
        {trigger || (
          <Button
            size={small ? 'sm' : 'lg'}
            variant="light"
            isIconOnly
            className={cn('flex flex-col justify-center items-center gap-1', {
              'bg-primary text-white hover:bg-primary hover:text-white': open,
            })}>
            <Tooltip
              content="Shape"
              placement="top"
              className="block"
              offset={14}>
              <div className="flex flex-col gap-1 justify-center items-center">
                <LuShapes size={18} />
                {!hideLabel && <span className="text-xs mt-1">Shape</span>}
              </div>
            </Tooltip>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[672px] rounded-md p-0">
        <div className="h-96 flex justify-start items-stretch w-full">
          <div className="w-48 h-full border-r-2 p-4 flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-4">
              <div>
                <ul className="flex flex-col gap-1 mt-2">
                  {MENU_OPTIONS.map((option) => (
                    <SideMenuItem
                      key={option.label}
                      label={option.label}
                      active={false}
                      disabled={option.disabled}
                      onClick={() => {
                        setShapeType(option.label as SHAPE_TYPES)
                      }}
                    />
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <label htmlFor="upload">
                <input
                  type="file"
                  id="upload"
                  className="hidden"
                  accept="image/svg+xml"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setOpen(false)
                      onSelect(file)
                    }
                  }}
                />
                <div className="w-full p-2 rounded-md bg-primary text-white text-center cursor-pointer">
                  Upload SVG
                </div>
              </label>
            </div>
          </div>
          <div className="h-full p-4 flex-auto">
            <ShapePickerContent
              shapeType={shapeType}
              onSelect={(svg) => {
                setOpen(false)
                onSelectCallback(svg)
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
