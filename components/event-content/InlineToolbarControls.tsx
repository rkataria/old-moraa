/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable newline-per-chained-call */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { BubbleMenu, Editor, FloatingMenu } from '@tiptap/react'
import {
  LuAlignCenter,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuBookMinus,
  LuBookPlus,
  LuItalic,
  LuListMinus,
  LuListPlus,
  LuStrikethrough,
  LuTrash2,
  LuUnderline,
} from 'react-icons/lu'

import { ColorPicker, ControlButton } from './BlockEditorControls'

export function InlineToolbarControls({ editor }: { editor: Editor }) {
  return (
    <BubbleMenu editor={editor} tippyOptions={{ zIndex: 99 }}>
      <InlineTextControls editor={editor} />
    </BubbleMenu>
  )
}

export function InlineTableControls({ editor }: { editor: Editor }) {
  const shouldShow = () => editor.isActive('table')

  return (
    <FloatingMenu
      editor={editor}
      tippyOptions={{ zIndex: 99, duration: 10 }}
      shouldShow={shouldShow}>
      <div className="absolute -top-16 -left-4">
        <TableControls editor={editor} />
      </div>
    </FloatingMenu>
  )
}

function TableControls({ editor }: { editor: Editor }) {
  return (
    <div className="flex justify-center items-center gap-2 shadow-md bg-gray-100 p-2 rounded-md text-black transition-all duration-500 z-[1]">
      <ControlButton
        icon={<LuListPlus size={18} />}
        tooltipText="Add row after"
        onClick={() => editor.chain().focus().addRowAfter().run()}
      />
      <ControlButton
        icon={<LuBookPlus size={18} />}
        tooltipText="Add column after"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      />
      <ControlButton
        icon={<LuListMinus size={18} />}
        tooltipText="Delete Row"
        onClick={() => editor.chain().focus().deleteRow().run()}
      />
      <ControlButton
        icon={<LuBookMinus size={18} />}
        tooltipText="Delete Column"
        onClick={() => editor.chain().focus().deleteColumn().run()}
      />
      <ControlButton
        icon={<LuTrash2 size={18} />}
        tooltipText="Delete Table"
        onClick={() => editor.chain().focus().deleteTable().run()}
      />
    </div>
  )
}
function InlineTextControls({ editor }: { editor: Editor }) {
  const canBold = editor.can().chain().focus().toggleBold().run()
  const canItalic = editor.can().chain().focus().toggleItalic().run()
  const canUnderline = editor.can().chain().focus().toggleUnderline().run()
  const canStrike = editor.can().chain().focus().toggleStrike().run()
  if (!(canBold || canItalic || canStrike || canUnderline)) {
    return null
  }

  const handleColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  if (editor.isActive('heading')) {
    return (
      <HeaderControls editor={editor} handleColorChange={handleColorChange} />
    )
  }

  return (
    <div className="flex justify-center items-center gap-2 shadow-md bg-gray-100 p-2 rounded-md text-black transition-all duration-500 z-[1]">
      <ControlButton
        active={editor.isActive('bold')}
        icon={<LuBold size={18} />}
        tooltipText="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ControlButton
        active={editor.isActive('italic')}
        icon={<LuItalic size={18} />}
        tooltipText="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ControlButton
        active={editor.isActive('underline')}
        icon={<LuUnderline size={18} />}
        tooltipText="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ControlButton
        active={editor.isActive('strike')}
        icon={<LuStrikethrough size={18} />}
        tooltipText="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <ColorPicker
        active={editor.isActive('color')}
        color={editor.getAttributes('textStyle').color ?? '#fff'}
        onChange={handleColorChange}
      />
    </div>
  )
}

function HeaderControls({
  editor,
  handleColorChange,
}: {
  editor: Editor
  handleColorChange: (color: string) => void
}) {
  return (
    <div className="flex justify-center items-center gap-2 shadow-md bg-gray-100 p-2 rounded-md text-black transition-all duration-500 z-[1]">
      <ControlButton
        active={editor.isActive({ textAlign: 'left' })}
        icon={<LuAlignLeft size={18} />}
        tooltipText="Align left"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      />
      <ControlButton
        active={editor.isActive({ textAlign: 'center' })}
        icon={<LuAlignCenter size={18} />}
        tooltipText="Align center"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      />
      <ControlButton
        active={editor.isActive({ textAlign: 'right' })}
        icon={<LuAlignRight size={18} />}
        tooltipText="Align right"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      />
      <ColorPicker
        active={editor.isActive('color')}
        color={editor.getAttributes('textStyle').color ?? '#fff'}
        onChange={handleColorChange}
      />
    </div>
  )
}
