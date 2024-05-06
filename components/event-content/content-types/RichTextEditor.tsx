/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import React, { useState } from 'react'

import { SlideTextBlock } from '../SlideTextBlock'

export function RichTextEditor() {
  // const [localSlide, setLocalSlide] = useState<ISlide | null>(null)
  // const debouncedLocalSlide = useDebounce(localSlide, 500)
  const [editableId, setEditableId] = useState('')

  // const { currentSlide, updateSlide } = useContext(
  //   EventContext
  // ) as EventContextType

  // useEffect(() => {
  //   setLocalSlide(currentSlide)
  // }, [currentSlide])

  // useEffect(() => {
  //   if (!currentSlide?.content) {
  //     return
  //   }

  //   updateSlide({
  //     slidePayload: {
  //       content: {
  //         ...currentSlide.content,
  //         ...debouncedLocalSlide?.content,
  //       },
  //     },
  //     slideId: currentSlide.id,
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [debouncedLocalSlide])

  // if (!localSlide) {
  //   return null
  // }

  // const handleBlockChange = (block: TextBlock) => {
  //   setLocalSlide({
  //     ...localSlide,
  //     content: {
  //       ...localSlide.content,
  //       blocks: (localSlide.content?.blocks as TextBlock[]).map((b) => {
  //         if (b.id === block.id) {
  //           return block
  //         }

  //         return b
  //       }),
  //     },
  //   })
  // }

  // const blocks = localSlide.content?.blocks || []

  // const richTextBlock = blocks.find((b) => b.type === 'richtext') as TextBlock
  // const headerBlock = blocks.find((b) => b.type === 'header') as TextBlock

  return (
    <>
      {/* <TextBlockEditor
        stickyToolbar
        autohideToolbar
        editable={headerBlock.id === editableId}
        block={headerBlock}
        onChange={handleBlockChange}
      /> */}
      <SlideTextBlock
        blockType="header"
        editableId={editableId}
        onClick={(id) => setEditableId(id)}
      />
      <SlideTextBlock
        blockType="paragraph"
        editableId={editableId}
        onClick={(id) => setEditableId(id)}
      />

      <SlideTextBlock
        className="w-full h-full flex justify-start items-start rounded-md overflow-hidden relative pt-4"
        fillAvailableHeight
        blockType="richtext"
        editableId={editableId}
        onClick={(id) => setEditableId(id)}
      />
    </>
  )
}
