/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */

'use client'

import React, { useContext, useEffect, useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'
import isEqual from 'lodash.isequal'

import { TextBlockEditor } from '@/components/event-content/TextBlockEditor'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { ISlide, TextBlock } from '@/types/slide.type'
import { cn } from '@/utils/utils'

type CoverSlide = ISlide

export function CoverEditor() {
  const [localSlide, setLocalSlide] = useState<CoverSlide | null>(null)
  const debouncedLocalSlide = useDebounce(localSlide, 500)
  const [editingBlock, setEditingBlock] = useState<string | null>(null)

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
    if (isEqual(debouncedLocalSlide?.content, currentSlide.content)) {
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

  const textBlocks: TextBlock[] = (
    localSlide.content?.blocks as TextBlock[]
  )?.filter((block) => ['header', 'paragraph'].includes(block.type))

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden relative pt-16'
      )}>
      {textBlocks.map((block) => {
        const renderHeader =
          localSlide.config.showTitle && block.type === 'header'

        const renderParagraph =
          localSlide.config.showDescription && block.type === 'paragraph'

        if (!renderHeader && !renderParagraph) return null

        return (
          <div
            onClick={() => setEditingBlock(block.id)}
            id={`block-editor-${block.id}`}
            className="w-full">
            <TextBlockEditor
              stickyToolbar
              key={block.id}
              block={block}
              editable={editingBlock === block.id}
              onChange={(updatedBlock) => {
                setLocalSlide({
                  ...localSlide,
                  content: {
                    ...localSlide.content,
                    blocks: (localSlide.content?.blocks as TextBlock[])?.map(
                      (b) => {
                        if (b.id === block.id) {
                          return updatedBlock
                        }

                        return b
                      }
                    ),
                  },
                })
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
