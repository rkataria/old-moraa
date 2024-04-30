'use client'

import React, { useEffect } from 'react'

import CharacterCount from '@tiptap/extension-character-count'
import { Color } from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useIdle } from '@uidotdev/usehooks'

import { ScrollShadow } from '@nextui-org/react'

import { BlockEditorControls } from './BlockEditorControls'

import { TITLE_CHARACTER_LIMIT } from '@/constants/common'
import { TextBlock } from '@/types/slide.type'
import { cn } from '@/utils/utils'

const getExtensions = (type: string) => {
  switch (type) {
    case 'richtext':
      return [
        StarterKit,
        TextStyle,
        Color,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Placeholder.configure({
          placeholder: 'Start writing…',
          emptyEditorClass:
            'text-gray-500 float-left before:content-[attr(data-placeholder)]',
        }),
      ]
      break
    default:
      return [
        StarterKit,
        TextStyle,
        Color,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        CharacterCount.configure({
          limit: type === 'header' ? TITLE_CHARACTER_LIMIT : null,
        }),
      ]
  }
}

export function TextBlockEditor({
  block,
  autohideToolbar = true,
  stickyToolbar = false,
  fillAvailableHeight = false,
  onChange,
}: {
  block: TextBlock
  autohideToolbar?: boolean
  stickyToolbar?: boolean
  fillAvailableHeight?: boolean
  onChange?: (block: TextBlock) => void
}) {
  const idle = useIdle(3000)
  const editor = useEditor({
    extensions: getExtensions(block.type),
    content: block.data?.html,
    onUpdate: ({ editor: _editor }) => {
      onChange?.({
        ...block,
        data: {
          ...block.data,
          html: _editor.getHTML(),
        },
      })
    },
  })

  useEffect(
    () => () => {
      editor?.destroy()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  if (!editor) return null

  const renderToolbar = () => {
    if (idle && autohideToolbar) {
      return null
    }

    return (
      <BlockEditorControls
        editor={editor}
        blockType={block.type}
        sticky={stickyToolbar}
      />
    )
  }

  return (
    <>
      {renderToolbar()}
      <ScrollShadow
        hideScrollBar
        isEnabled
        orientation="vertical"
        className={cn('w-full max-h-full', {
          'h-full': fillAvailableHeight,
        })}>
        <EditorContent
          editor={editor}
          className="p-2 rounded-sm outline-none w-full h-full min-h-full transition-all duration-500 hover:bg-black/5"
        />
      </ScrollShadow>
    </>
  )
}
