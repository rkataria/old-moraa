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
import { IFrame, TextBlock } from '@/types/frame.type'
import { getFrameName } from '@/utils/getFrameName'
import { cn } from '@/utils/utils'

type CoverFrame = IFrame

export function CoverEditor() {
  const [localFrame, setLocalFrame] = useState<CoverFrame | null>(null)
  const debouncedLocalFrame = useDebounce(localFrame, 500)
  const [editingBlock, setEditingBlock] = useState<string | null>(null)

  const { currentFrame, updateFrame } = useContext(
    EventContext
  ) as EventContextType

  useEffect(() => {
    setLocalFrame(currentFrame)
  }, [currentFrame])

  useEffect(() => {
    if (!currentFrame?.content) {
      return
    }
    if (!debouncedLocalFrame?.content) {
      return
    }
    if (isEqual(debouncedLocalFrame?.content, currentFrame.content)) {
      return
    }

    updateFrame({
      framePayload: {
        content: {
          ...currentFrame.content,
          ...debouncedLocalFrame?.content,
        },
        name: getFrameName({ frame: debouncedLocalFrame }),
      },
      frameId: currentFrame.id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocalFrame?.content])

  if (!localFrame?.content) {
    return null
  }

  const textBlocks: TextBlock[] = (
    localFrame.content?.blocks as TextBlock[]
  )?.filter((block) => ['header', 'paragraph'].includes(block.type))

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden relative pt-16'
      )}>
      {textBlocks.map((block) => {
        const renderHeader = block.type === 'header'

        const renderParagraph = block.type === 'paragraph'

        if (!renderHeader && !renderParagraph) return null

        return (
          <div
            onClick={() => setEditingBlock(block.id)}
            id={`block-editor-${block.id}`}
            className="w-full">
            <TextBlockEditor
              key={block.id}
              block={block}
              editable={editingBlock === block.id}
              onChange={(updatedBlock) => {
                setLocalFrame({
                  ...localFrame,
                  content: {
                    ...localFrame.content,
                    blocks: (localFrame.content?.blocks as TextBlock[])?.map(
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
