'use client'

import React from 'react'

import { RichTextView } from '@/components/common/content-types/RichTextView'
import { ISlide, TextBlock } from '@/types/slide.type'
import { cn } from '@/utils/utils'

interface CoverProps {
  slide: ISlide
}

export function Cover({ slide }: CoverProps) {
  const paragraphTextBlock = (slide.content?.blocks as TextBlock[])?.find(
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
