'use client'

import React from 'react'

import { ISlide, TextBlock } from '@/types/slide.type'
import { cn } from '@/utils/utils'

interface CoverProps {
  slide: ISlide
}

export function Cover({ slide }: CoverProps) {
  const headingHtml = (slide.content?.blocks as TextBlock[])?.find(
    (block) => block.type === 'header'
  )?.data?.html
  const paragraphHtml = (slide.content?.blocks as TextBlock[])?.find(
    (block) => block.type === 'paragraph'
  )?.data.html

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className={cn(
        'tiptap ProseMirror w-full h-full flex flex-col justify-center items-center px-4'
      )}>
      <div
        className="block-content-header"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: headingHtml!,
        }}
      />
      <div
        className="block-content-paragraph"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: paragraphHtml!,
        }}
      />
    </div>
  )
}
