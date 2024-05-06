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
  const textBlocks = slide.content.blocks.filter((block) =>
    ['header', 'paragraph'].includes(block.type)
  ) as TextBlock[]

  if (textBlocks.length === 0) return null

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden relative'
      )}>
      {textBlocks.map((block) => {
        const renderHeader = slide.config.showTitle && block.type === 'header'

        const renderParagraph =
          slide.config.showDescription && block.type === 'paragraph'

        if (!renderHeader && !renderParagraph) return null

        return <RichTextView block={block} />
      })}
    </div>
  )
}
