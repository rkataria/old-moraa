/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import React from 'react'

import { RichTextView } from '@/components/common/RichTextView'
import { ISlide, TextBlock } from '@/types/slide.type'

type RichTextProps = {
  slide: ISlide
}
export function RichText({ slide }: RichTextProps) {
  const blocks = slide.content?.blocks || []

  const richTextBlock = blocks.find((b) => b.type === 'richtext') as TextBlock

  return (
    <div className="w-full h-full">
      {richTextBlock && (
        <div id={`block-editor-${richTextBlock.id}`} className="w-full h-full">
          <RichTextView key={richTextBlock.id} block={richTextBlock} />
        </div>
      )}
    </div>
  )
}
