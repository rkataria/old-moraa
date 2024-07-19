/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react'

import { FrameTextBlock } from '../FrameTextBlock'

export function RichTextEditor() {
  const [editableId, setEditableId] = useState('')

  return (
    <>
      <FrameTextBlock
        blockType="header"
        editableId={editableId}
        onClick={(id) => setEditableId(id)}
      />
      <FrameTextBlock
        blockType="paragraph"
        editableId={editableId}
        onClick={(id) => setEditableId(id)}
      />

      <FrameTextBlock
        className="w-full h-full flex justify-start items-start rounded-md overflow-hidden relative pt-8"
        fillAvailableHeight
        blockType="richtext"
        editableId={editableId}
        onClick={(id) => setEditableId(id)}
      />
    </>
  )
}
