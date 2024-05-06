/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useContext, useEffect, useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'
import isEqual from 'lodash.isequal'

import { TextBlockEditor } from './TextBlockEditor'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { ISlide, TextBlock } from '@/types/slide.type'
import { headerBlock, paragraphBlock } from '@/utils/content.util'

const getDefaultBlock = (blockType: string) => {
  switch (blockType) {
    case 'header':
      return headerBlock as TextBlock
    case 'paragraph':
      return paragraphBlock as TextBlock
    default:
      return paragraphBlock as TextBlock
  }
}

export function SlideTextBlock({
  blockType,
  editableId,
  className,
  fillAvailableHeight,
  onClick,
}: {
  blockType: string
  editableId?: string
  className?: string
  fillAvailableHeight?: boolean
  onClick?: (id: string) => void
}) {
  const { updateSlide, currentSlide } = useContext(
    EventContext
  ) as EventContextType

  const [localSlide, setLocalSlide] = useState<ISlide | null>(null)

  const debouncedLocalSlide = useDebounce(localSlide, 500)

  useEffect(() => {
    if (!currentSlide) {
      return
    }

    const blockExist = currentSlide?.content?.blocks?.find(
      (b) => b.type === blockType
    ) as TextBlock

    if (blockExist) {
      setLocalSlide(currentSlide)

      return
    }

    const updatedBlocks: TextBlock[] =
      (currentSlide?.content?.blocks as TextBlock[]) || []
    updatedBlocks.push(getDefaultBlock(blockType) as TextBlock)

    setLocalSlide({
      ...currentSlide,
      content: {
        ...currentSlide?.content,
        blocks: updatedBlocks,
      },
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const block = localSlide?.content?.blocks?.find(
    (b) => b.type === blockType
  ) as TextBlock

  if (!localSlide?.config.showTitle && blockType === 'header') {
    return null
  }

  if (!localSlide?.config.showDescription && blockType === 'paragraph') {
    return null
  }

  if (!localSlide?.content || !localSlide?.content?.blocks) {
    return null
  }

  return (
    <div onClick={() => onClick?.(block.id)} className={className}>
      <TextBlockEditor
        stickyToolbar
        autohideToolbar
        fillAvailableHeight={fillAvailableHeight}
        block={block}
        editable={editableId === block.id}
        onChange={(updatedBlock) => {
          setLocalSlide({
            ...localSlide,
            content: {
              ...localSlide.content,
              blocks: (localSlide.content?.blocks as TextBlock[])?.map((b) => {
                if (b.id === block.id) {
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
