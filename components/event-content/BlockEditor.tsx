'use client'

import React, { useEffect } from 'react'

import { Color } from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { BlockEditorControls } from './BlockEditorControls'

import { TextBlock } from '@/types/slide.type'

const getExtensions = (type: string) => {
  switch (type) {
    default:
      return [
        StarterKit,
        TextStyle,
        Color,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
      ]
  }
}

export function TextBlockEditor({
  block,
  editable = false,
  onChange,
}: {
  block: TextBlock
  editable?: boolean
  onChange?: (block: TextBlock) => void
}) {
  const editor = useEditor({
    extensions: getExtensions(block.type),
    content: block.data.html,
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

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable])

  if (!editor) return null

  return (
    <div className="flex justify-center items-center">
      {editable && (
        <BlockEditorControls editor={editor} blockType={block.type} />
      )}

      <EditorContent editor={editor} className="p-2 outline-none w-full" />
    </div>
  )
}
