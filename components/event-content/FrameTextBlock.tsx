/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useContext, useEffect, useState } from 'react'

import { useDebounce } from '@uidotdev/usehooks'
import isEqual from 'lodash.isequal'

import { TextBlockEditor } from './TextBlockEditor'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame, TextBlock } from '@/types/frame.type'
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

export function FrameTextBlock({
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
  const { updateFrame, currentFrame } = useContext(
    EventContext
  ) as EventContextType

  const [localFrame, setLocalFrame] = useState<IFrame | null>(null)

  const debouncedLocalFrame = useDebounce(localFrame, 500)

  useEffect(() => {
    if (!currentFrame) {
      return
    }

    const blockExist = currentFrame?.content?.blocks?.find(
      (b) => b.type === blockType
    ) as TextBlock

    if (blockExist) {
      setLocalFrame(currentFrame)

      return
    }

    const updatedBlocks: TextBlock[] =
      (currentFrame?.content?.blocks as TextBlock[]) || []
    updatedBlocks.push(getDefaultBlock(blockType) as TextBlock)

    setLocalFrame({
      ...currentFrame,
      content: {
        ...currentFrame?.content,
        blocks: updatedBlocks,
      },
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      },
      frameId: currentFrame.id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocalFrame?.content])

  const block = localFrame?.content?.blocks?.find(
    (b) => b.type === blockType
  ) as TextBlock

  if (!localFrame?.config.showTitle && blockType === 'header') {
    return null
  }

  if (!localFrame?.config.showDescription && blockType === 'paragraph') {
    return null
  }

  if (!localFrame?.content || !localFrame?.content?.blocks) {
    return null
  }

  return (
    <div onClick={() => onClick?.(block.id)} className={className}>
      <TextBlockEditor
        fillAvailableHeight={fillAvailableHeight}
        block={block}
        editable={editableId === block.id}
        onChange={(updatedBlock) => {
          setLocalFrame({
            ...localFrame,
            content: {
              ...localFrame.content,
              blocks: (localFrame.content?.blocks as TextBlock[])?.map((b) => {
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
