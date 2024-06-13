import React from 'react'

import { Tooltip, TooltipProps } from '@nextui-org/react'

import { ContentType } from './ContentTypePicker'

import { getContentType } from '@/utils/content.util'
import { cn } from '@/utils/utils'

export function ContentTypeIcon({
  frameType,
  classNames,
  tooltipProps = {},
}: {
  frameType: ContentType
  classNames?: string
  tooltipProps?: TooltipProps
}) {
  const contentType = getContentType(frameType)

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
