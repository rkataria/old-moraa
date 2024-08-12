/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Key, useContext, useRef } from 'react'

import { Tooltip } from '@nextui-org/react'
import { HiOutlinePaintBrush } from 'react-icons/hi2'

import { DropdownActions } from '@/components/common/DropdownActions'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { cn, FrameColorCodes, isColorDark } from '@/utils/utils'

export function FrameColorCode({
  frameId,
  config,
}: {
  frameId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { updateFrame, preview } = useContext(EventContext) as EventContextType
  const handleColorChange = (changedColorCode: Key) => {
    if (changedColorCode === config.changedColorCode) return
    updateFrame({
      frameId,
      framePayload: {
        config: {
          ...config,
          colorCode: changedColorCode,
        },
      },
    })
  }

  const frameCodeColor = config.colorCode as keyof typeof FrameColorCodes

  const selectedColor = frameCodeColor && FrameColorCodes[frameCodeColor]

  return (
    <div>
      <Tooltip
        content={selectedColor?.label || 'Select Category'}
        color="primary"
        showArrow
        placement="left"
        radius="sm">
        <div
          style={{
            backgroundColor: selectedColor?.color,
          }}
          onClick={() => {
            if (preview) return
            ref?.current?.click()
          }}
          className={cn(
            'relative bg-gray-100 w-3 h-full right-0 top-0 grid place-items-center cursor-pointer group/color_code_2',
            {
              'hover:scale-125 duration-300': !preview,
            }
          )}>
          <HiOutlinePaintBrush
            className={cn('text-sm opacity-0 group-hover/frame:opacity-100', {
              'text-white':
                selectedColor?.color && isColorDark(selectedColor.color),
            })}
          />
        </div>
      </Tooltip>
      <DropdownActions
        actions={Object.values(FrameColorCodes)}
        onAction={handleColorChange}
        triggerIcon={<div ref={ref} />}
      />
    </div>
  )
}
