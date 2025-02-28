import { TooltipProps } from '@heroui/react'

import { Tooltip } from './ShortuctTooltip'

import { FrameType, getFrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export function ContentTypeIcon({
  frameType,
  classNames,
  tooltipProps = {},
}: {
  frameType: FrameType
  classNames?: string
  tooltipProps?: TooltipProps
}) {
  const contentType = getFrameType(frameType)

  if (!contentType) return null

  return (
    <Tooltip content={contentType.name} {...tooltipProps}>
      <div
        className={cn(
          'text-gray-300 flex-none w-5 h-5 flex justify-center items-center',
          classNames
        )}>
        {contentType.icon}
      </div>
    </Tooltip>
  )
}
