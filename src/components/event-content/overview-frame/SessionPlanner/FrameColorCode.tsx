/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Key, useContext, useRef } from 'react'

import { DropdownActions } from '@/components/common/DropdownActions'
import { Tooltip } from '@/components/common/ShortuctTooltip'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { FrameEngagementType } from '@/utils/frame-picker.util'
import { cn, FrameEngagementTypes, isColorDark } from '@/utils/utils'

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

  const frameCodeColor = config.colorCode as keyof typeof FrameEngagementTypes

  const selectedColor = frameCodeColor && FrameEngagementTypes[frameCodeColor]

  const actions = Object.keys(FrameEngagementTypes).map((key) => ({
    key,
    ...FrameEngagementTypes[key as FrameEngagementType],
  }))

  return (
    <div>
      <Tooltip
        content={
          selectedColor?.label === 'None'
            ? 'Select category'
            : selectedColor?.label || 'Select Category'
        }
        color="primary"
        showArrow
        placement="right"
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
            'relative bg-[#C4C4C4] w-full h-full right-0 top-0 grid place-items-center group/color_code_2',
            {
              'cursor-pointer': !preview,
              'text-white': selectedColor && isColorDark(selectedColor.color),
            }
          )}>
          <p>{selectedColor?.label || 'None'}</p>
        </div>
      </Tooltip>
      <DropdownActions
        actions={actions}
        onAction={handleColorChange}
        triggerIcon={<div ref={ref} />}
      />
    </div>
  )
}
