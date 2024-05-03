/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import React, { useContext, useEffect, useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'
import isEqual from 'lodash.isequal'

import { TextBlockEditor } from '@/components/event-content/TextBlockEditor'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { ISlide, TextBlock } from '@/types/slide.type'

export function RichTextEditor() {
  const [localSlide, setLocalSlide] = useState<ISlide | null>(null)
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

    if (!debouncedLocalSlide?.content) {
      return
    }

    if (isEqual(currentSlide.content, debouncedLocalSlide.content)) {
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
  }, [debouncedLocalSlide])

  if (!localSlide) {
    return null
  }

  const handleBlockChange = (block: TextBlock) => {
    setLocalSlide({
      ...localSlide,
      content: {
        ...localSlide.content,
        blocks: (localSlide.content?.blocks as TextBlock[]).map((b) => {
          if (b.id === block.id) {
            return block
          }

          return b
        }),
      },
    })
  }

  const blocks = localSlide.content?.blocks || []

  const richTextBlock = blocks.find((b) => b.type === 'richtext') as TextBlock

  return (
    <div className="w-full h-full flex justify-start items-start rounded-md overflow-hidden relative pt-16">
      <TextBlockEditor
        stickyToolbar
        fillAvailableHeight
        block={richTextBlock}
        onChange={handleBlockChange}
      />
    </div>
  )
}
