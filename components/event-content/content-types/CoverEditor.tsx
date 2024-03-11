/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */

'use client'

import React, { useContext, useEffect, useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { TextBlockEditor } from '@/components/event-content/BlockEditor'
import { SlideManagerContext } from '@/contexts/SlideManagerContext'
import { ISlide, SlideManagerContextType, TextBlock } from '@/types/slide.type'

// THIS IS A TEMPORARY FUNCTION TO TRANSFORM SLIDE DATA, IT WILL BE REMOVED WHEN THE BLOCKS ARE ADDED TO THE SLIDE DATA
const transformSlideData = (slide: ISlide) => ({
  ...slide,
  content: {
    ...slide.content,
    title: undefined,
    description: undefined,
    blocks: slide.content?.title
      ? [
          {
            id: uuidv4(),
            type: 'header',
            data: {
              html: `<h1 style="text-align: center">${slide.content.title}</h1>`,
            },
          },
          {
            id: uuidv4(),
            type: 'paragraph',
            data: {
              html: `<p style="text-align: center">${slide.content.description}</p>`,
            },
          },
        ]
      : slide.content?.blocks,
  },
})

type CoverSlide = ISlide

interface CoverEditorProps {
  slide: CoverSlide
}

export function CoverEditor({ slide }: CoverEditorProps) {
  const [localSlide, setLocalSlide] = useState<CoverSlide>(
    transformSlideData(slide)
  )
  const [editingBlock, setEditingBlock] = useState<string | null>(null)

  const { updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  useEffect(() => {
    updateSlide({
      ...slide,
      content: {
        ...slide.content,
        ...localSlide.content,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSlide])

  const textBlocks: TextBlock[] = (
    localSlide.content?.blocks as TextBlock[]
  )?.filter((block) => ['header', 'paragraph'].includes(block.type))

  return (
    <div className="w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden">
      <div className="h-full flex flex-col justify-center items-start w-full">
        {textBlocks.map((block) => (
          <div
            onKeyDown={() => {}}
            onClick={() => setEditingBlock(block.id)}
            id={`block-editor-${block.id}`}
            className="w-full">
            <TextBlockEditor
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
        ))}
      </div>
    </div>
  )
}
