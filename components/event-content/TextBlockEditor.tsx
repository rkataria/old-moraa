'use client'

import { useEffect } from 'react'

import CharacterCount from '@tiptap/extension-character-count'
import { Color } from '@tiptap/extension-color'
import Document from '@tiptap/extension-document'
import Highlight from '@tiptap/extension-highlight'
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

import { Divider, ScrollShadow } from '@nextui-org/react'

import { BlockEditorControls } from './BlockEditorControls'
import {
  InlineTableControls,
  InlineToolbarControls,
} from './InlineToolbarControls'
import { CustomImageResize } from '../common/ImageExtension'

import { TITLE_CHARACTER_LIMIT } from '@/constants/common'
import { TextBlock } from '@/types/frame.type'
import { cn } from '@/utils/utils'

const CustomDocument = Document.extend({
  content: 'heading block*',
})

const DisableEnter = Extension.create({
  name: 'disableEnter',
  addKeyboardShortcuts() {
    return {
      Enter: () => true, // Prevents the default behavior for the Enter key
    }
  },
})

const KeyboardShortcuts = Extension.create({
  name: 'keyboardShortcuts',
  addKeyboardShortcuts() {
    return {
      'Ctrl-[': () => {
        window.dispatchEvent(
          new CustomEvent('keyboard_shortcuts', {
            detail: { key: 'left_sidebar_toggle' },
          })
        )

        return false
      },
      'Ctrl-]': () => {
        window.dispatchEvent(
          new CustomEvent('keyboard_shortcuts', {
            detail: { key: 'right_sidebar_toggle' },
          })
        )

        return false
      },
    }
  },
})

const getExtensions = (type: string, placeholder: string | undefined) => {
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
        // Image.configure({
        //   inline: true,
        //   HTMLAttributes: {
        //     class: 'tiptap-image',
        //   },
        // }),
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
        KeyboardShortcuts,
        Highlight,
        CustomImageResize,
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
            'text-gray-500 text-left before:content-[attr(data-placeholder)] tracking-tight',
        }),
        KeyboardShortcuts,
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
          placeholder: placeholder || 'Can you add some further context?',
          emptyEditorClass:
            'text-gray-500 text-left before:content-[attr(data-placeholder)] tracking-tight',
        }),
        KeyboardShortcuts,
        Highlight,
      ]
  }
}

export function TextBlockEditor({
  block,
  showToolbar = true,
  editable = true,
  fillAvailableHeight = false,
  className = '',
  placeholder = '',
  onChange,
}: {
  block: TextBlock
  showToolbar?: boolean
  editable?: boolean
  fillAvailableHeight?: boolean
  className?: string
  placeholder?: string
  onChange?: (block: TextBlock) => void
}) {
  const editor = useEditor(
    {
      extensions: getExtensions(block.type, placeholder),
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
    },
    [block?.id]
  )

  useEffect(() => {
    if (block.type === 'header' && editor && editor.isEmpty) {
      // FIXME: focus is conflicting with the arrow key navigation for agenda panel
      // editor.commands.focus('start')
    }

    return () => {
      editor?.destroy()
    }
  }, [block.type, editor])

  if (!editor) return null

  const renderToolbar = () => {
    if (
      !showToolbar ||
      !editable ||
      ['header', 'paragraph'].includes(block.type)
    ) {
      return null
    }

    return (
      <>
        <BlockEditorControls editor={editor} blockType={block.type} />
        <Divider className="h-0.5 w-full" />
      </>
    )
  }

  return (
    <div
      className={cn(
        'sticky top-4 left-4 w-5/6 h-full pt-2',
        {
          'border border-gray-200': block.type === 'richtext' && !!editable,
        },
        className
      )}>
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
          className={cn(
            'rounded-sm outline-none w-full h-full min-h-full transition-all duration-500',
            {
              richText: block.type === 'richtext',
            }
          )}
        />
      </ScrollShadow>
    </div>
  )
}
