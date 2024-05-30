'use client'

import React, { useEffect } from 'react'

import CharacterCount from '@tiptap/extension-character-count'
import { Color } from '@tiptap/extension-color'
import Document from '@tiptap/extension-document'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorContent, Extension, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { ScrollShadow } from '@nextui-org/react'

import { BlockEditorControls } from './BlockEditorControls'
import {
  InlineTableControls,
  InlineToolbarControls,
} from './InlineToolbarControls'

import { TITLE_CHARACTER_LIMIT } from '@/constants/common'
import { TextBlock } from '@/types/slide.type'
import { cn } from '@/utils/utils'

const CustomDocument = Document.extend({
  content: 'heading block*',
})

const DisableEnter = Extension.create({
  name: 'disableEnter',
  addKeyboardShortcuts() {
    return {
      Enter: () => true,
    }
  },
})

const getExtensions = (type: string) => {
  switch (type) {
    case 'richtext':
      return [
        StarterKit,
        TextStyle,
        Color,
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Placeholder.configure({
          placeholder: 'Start writing…',
          emptyEditorClass:
            'text-gray-500 float-center before:content-[attr(data-placeholder)]',
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'tiptap-image',
          },
        }),
        Link.configure({
          HTMLAttributes: {
            class: 'tiptap-link',
          },
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
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
        Table.configure({ resizable: true }),
        TableRow.configure({}),
        TableHeader.configure({}),
        TableCell.configure({}),
      ]

    case 'header':
      return [
        CustomDocument,
        Color,
        TextStyle,
        Underline,
        StarterKit.configure({
          document: false,
        }),
        TextAlign.configure({
          types: ['heading'],
        }),
        CharacterCount.configure({
          limit: TITLE_CHARACTER_LIMIT,
        }),
        Placeholder.configure({
          placeholder: "What's the title?",
          emptyEditorClass:
            'text-gray-500 text-left before:content-[attr(data-placeholder)]',
        }),
        DisableEnter,
      ]

    default:
      return [
        StarterKit,
        TextStyle,
        Color,
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        CharacterCount.configure({
          limit: type === 'header' ? TITLE_CHARACTER_LIMIT : null,
        }),
        Placeholder.configure({
          placeholder: 'Can you add some further context?',
          emptyEditorClass:
            'text-gray-500 text-left before:content-[attr(data-placeholder)]',
        }),
      ]
  }
}

export function TextBlockEditor({
  block,
  showToolbar = true,
  editable = true,
  stickyToolbar = false,
  fillAvailableHeight = false,
  onChange,
}: {
  block: TextBlock
  showToolbar?: boolean
  editable?: boolean
  stickyToolbar?: boolean
  fillAvailableHeight?: boolean
  onChange?: (block: TextBlock) => void
}) {
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

  useEffect(() => {
    if (block.type === 'header' && editor && editor.isEmpty) {
      editor.commands.focus('start')
    }

    return () => {
      editor?.destroy()
    }
  }, [block.type, editor])

  if (!editor) return null

  const renderToolbar = () => {
    if (!showToolbar || !editable || block.type === 'header') {
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
        {/* floating controls */}
        <InlineTableControls editor={editor} />
        {/* // bubble menu controls  */}
        <InlineToolbarControls editor={editor} />

        <EditorContent
          editor={editor}
          className="p-2 rounded-sm outline-none w-full h-full min-h-full transition-all duration-500"
        />
      </ScrollShadow>
    </>
  )
}
