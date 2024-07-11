'use client'

import { useEffect } from 'react'

import CharacterCount from '@tiptap/extension-character-count'
import { Color } from '@tiptap/extension-color'
import { Link } from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageResize from 'tiptap-extension-resize-image'

import { TITLE_CHARACTER_LIMIT } from '@/constants/common'
import { TextBlock } from '@/types/frame.type'
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

        Link.configure({
          HTMLAttributes: {
            class: 'tiptap-link',
          },
        }),
        TaskList.configure({
          HTMLAttributes: {
            class: 'list-none',
          },
        }),
        TaskItem.configure({
          nested: true,
          HTMLAttributes: {
            class: 'flex gap-2 ',
          },
        }),
        Table.configure({
          HTMLAttributes: {
            class: 'border border-black',
          },
        }),
        TableRow.configure({
          HTMLAttributes: {
            class: 'table-row',
          },
        }),
        TableHeader.configure({
          HTMLAttributes: {
            class: 'table-header border border-gray-500',
          },
        }),
        TableCell.configure({
          HTMLAttributes: {
            class: 'table-cell border border-gray-300',
          },
        }),
        ImageResize,
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
        ImageResize,
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
    <EditorContent
      editor={editor}
      className={cn('p-2 outline-none w-full h-full min-h-full', {
        richText: block.type === 'richtext',
      })}
    />
  )
}
