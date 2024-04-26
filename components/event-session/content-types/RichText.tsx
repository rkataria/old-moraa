/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import React from 'react'

import { RichTextView } from '@/components/common/content-types/RichTextView'
import { ISlide, TextBlock } from '@/types/slide.type'
import { cn } from '@/utils/utils'

type RichTextProps = {
  slide: ISlide
}
export function RichText({ slide }: RichTextProps) {
  const blocks = slide.content?.blocks || []

  const richTextBlock = blocks.find((b) => b.type === 'richtext') as TextBlock

  return (
    <div
      className={cn(
        'w-full h-full flex justify-start items-start rounded-md overflow-hidden relative'
      )}>
      <RichTextView block={richTextBlock} />
    </div>
  )
}
