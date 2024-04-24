'use client'

import React, { useEffect } from 'react'

import CharacterCount from '@tiptap/extension-character-count'
import { Color } from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { ScrollShadow } from '@nextui-org/react'

import { TITLE_CHARACTER_LIMIT } from '@/constants/common'
import { TextBlock } from '@/types/slide.type'

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

export function RichTextView({ block }: { block: TextBlock }) {
  const editor = useEditor({
    extensions: getExtensions(block.type),
    content: block.data.html,
    editable: false,
    onFocus: (props) => {
      props.editor.setEditable(false)
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

  return (
    <ScrollShadow
      hideScrollBar
      isEnabled
      orientation="vertical"
      className="w-full max-h-full">
      <EditorContent
        editor={editor}
        className="p-2 outline-none w-full h-full min-h-full"
      />
    </ScrollShadow>
  )
}
