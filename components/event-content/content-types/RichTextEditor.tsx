/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import React, { useState } from 'react'

import { SlideTextBlock } from '../SlideTextBlock'

export function RichTextEditor() {
  const [editableId, setEditableId] = useState('')

  return (
    <>
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
        className="w-full h-full flex justify-start items-start rounded-md overflow-hidden relative pt-8"
        fillAvailableHeight
        blockType="richtext"
        editableId={editableId}
        onClick={(id) => setEditableId(id)}
      />
    </>
  )
}
