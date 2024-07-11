'use client'

import { RichTextView } from './RichTextView'

import { IFrame, TextBlock } from '@/types/frame.type'
import { cn } from '@/utils/utils'

export type CoverFrameType = IFrame & {
  content: {
    blocks: TextBlock[]
  }
}

interface CoverProps {
  frame: CoverFrameType
}

export function Cover({ frame }: CoverProps) {
  const textBlocks = frame.content.blocks.filter((block) =>
    ['header', 'paragraph'].includes(block.type)
  ) as TextBlock[]

  if (textBlocks.length === 0) return null

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden relative'
      )}>
      {textBlocks.map((block) => {
        const renderHeader = block.type === 'header'

        const renderParagraph = block.type === 'paragraph'

        if (!renderHeader && !renderParagraph) return null

        return <RichTextView block={block} />
      })}
    </div>
  )
}
