import React from 'react'

import { Tooltip } from '@nextui-org/react'

import { ContentType } from './ContentTypePicker'

import { getContentType } from '@/utils/content.util'
import { cn } from '@/utils/utils'

export function ContentTypeIcon({
  slideType,
  classNames,
}: {
  slideType: ContentType
  classNames?: string
}) {
  const contentType = getContentType(slideType)

  if (!contentType) return null

  return (
    <Tooltip content={contentType.name}>
      <div className={cn('text-slate-400 flex-none w-5 h-5', classNames)}>
        {contentType.icon}
      </div>
    </Tooltip>
  )
}
