/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { RichTextView } from '@/components/common/content-types/RichTextView'
import { IFrame, TextBlock } from '@/types/frame.type'
import { cn } from '@/utils/utils'

type RichTextProps = {
  frame: IFrame
}
export function RichText({ frame }: RichTextProps) {
  const blocks = frame.content?.blocks || []

  const richTextBlock = blocks.find((b) => b.type === 'richtext') as TextBlock

  return (
    <div
      className={cn(
        'w-full h-full flex justify-start items-start rounded-md relative'
      )}>
      <RichTextView block={richTextBlock} />
    </div>
  )
}
