'use client'

import { RichTextView } from './RichTextView'

import { ISlide, TextBlock } from '@/types/slide.type'
import { cn } from '@/utils/utils'

export type CoverSlideType = ISlide & {
  content: {
    blocks: TextBlock[]
  }
}

interface CoverProps {
  slide: CoverSlideType
}

export function Cover({ slide }: CoverProps) {
  const paragraphTextBlock = (slide.content?.blocks as TextBlock[])?.find(
    (block) => block.type === 'paragraph'
  )

  if (!paragraphTextBlock) return null

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden relative'
      )}>
      <RichTextView block={paragraphTextBlock} />
    </div>
  )
}
