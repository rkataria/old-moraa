'use client'

import React from 'react'

import { RichTextView } from '@/components/common/content-types/RichTextView'
import { IFrame, TextBlock } from '@/types/frame.type'
import { cn } from '@/utils/utils'

interface CoverProps {
  frame: IFrame
}

export function Cover({ frame }: CoverProps) {
  const paragraphTextBlock = (frame.content?.blocks as TextBlock[])?.find(
    (block) => block.type === 'paragraph'
  )

  if (!paragraphTextBlock) return null

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden relative pt-16'
      )}>
      <RichTextView block={paragraphTextBlock} />
    </div>
  )
}
