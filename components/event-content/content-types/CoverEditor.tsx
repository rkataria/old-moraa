/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */

'use client'

import React, { useContext, useEffect, useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'

import { ContentType } from '@/components/common/ContentTypePicker'
import { TextBlockEditor } from '@/components/event-content/TextBlockEditor'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { ISlide, RichTextBlock, TextBlock } from '@/types/slide.type'
import { getDefaultContent } from '@/utils/content.util'
import { cn } from '@/utils/utils'

type CoverSlide = ISlide

export function CoverEditor() {
  const [localSlide, setLocalSlide] = useState<CoverSlide | null>(null)
  const debouncedLocalSlide = useDebounce(localSlide, 500)

  const { currentSlide, updateSlide } = useContext(
    EventContext
  ) as EventContextType

  useEffect(() => {
    setLocalSlide(currentSlide)
  }, [currentSlide])

  useEffect(() => {
    if (!currentSlide?.content) {
      return
    }

    if (
      JSON.stringify(debouncedLocalSlide?.content) ===
      JSON.stringify(currentSlide.content)
    ) {
      return
    }

    updateSlide({
      slidePayload: {
        content: {
          ...currentSlide.content,
          ...debouncedLocalSlide?.content,
        },
      },
      slideId: currentSlide.id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocalSlide?.content])

  if (!localSlide?.content) {
    return null
  }

  const textBlock =
    (localSlide.content?.blocks as TextBlock[])?.find((block) =>
      ['paragraph'].includes(block.type)
    ) || (getDefaultContent(ContentType.COVER).blocks?.[0] as RichTextBlock)

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden relative pt-16'
      )}>
      <TextBlockEditor
        stickyToolbar
        block={textBlock}
        onChange={(updatedBlock) => {
          setLocalSlide({
            ...localSlide,
            content: {
              ...localSlide.content,
              blocks: (localSlide.content?.blocks as TextBlock[])?.map((b) => {
                if (b.id === textBlock.id) {
                  return updatedBlock
                }

                return b
              }),
            },
          })
        }}
      />
    </div>
  )
}
