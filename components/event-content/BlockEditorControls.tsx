/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ReactElement } from 'react'

import { Editor } from '@tiptap/react'
import { HexColorPicker } from 'react-colorful'
import { GoHorizontalRule } from 'react-icons/go'
import {
  LuAlignCenter,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuCode,
  LuHeading,
  LuItalic,
  LuList,
  LuListOrdered,
  LuQuote,
  LuRedo,
  LuStrikethrough,
  LuUndo,
} from 'react-icons/lu'
import { MdInvertColors } from 'react-icons/md'

import {
  Button,
  ButtonProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@nextui-org/react'

import { cn, isColorDark } from '@/utils/utils'

export function BlockEditorControls({
  editor,
  blockType,
  sticky,
}: {
  editor: Editor
  blockType: string
  sticky?: boolean
}) {
  return (
    <div
      className={cn(
        'flex justify-center items-center gap-2 bg-black p-2 rounded-md text-white transition-all duration-500 z-[1]',
        {
          'absolute top-0 left-1/2 -translate-x-1/2': sticky,
        }
      )}>
      {blockType === 'header' && <HeaderBlockControls editor={editor} />}
      {blockType === 'paragraph' && <ParagraphBlockControls editor={editor} />}
      {blockType === 'richtext' && <RichTextBlockControls editor={editor} />}
      <HistoryControls editor={editor} />
    </div>
  )
}

function HistoryControls({ editor }: { editor: Editor }) {
  return (
    <div className="flex gap-2">
      <ControlButton
        active={false}
        icon={<LuUndo size={18} />}
        onClick={() => editor.chain().focus().undo().run()}
        tooltipText="Undo"
      />
      <ControlButton
        active={false}
        icon={<LuRedo size={18} />}
        onClick={() => editor.chain().focus().redo().run()}
        tooltipText="Redo"
      />
    </div>
  )
}

function HeaderBlockControls({ editor }: { editor: Editor }) {
  const handleColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  return (
    <>
      <Popover offset={10} placement="bottom">
        <PopoverTrigger>
          <Button
            size="sm"
            isIconOnly
            className="text-white"
            color={editor.isActive('heading') ? 'primary' : 'default'}
            variant={editor.isActive('heading') ? 'solid' : 'light'}>
            <LuHeading size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="py-3 bg-black w-full">
          {() => (
            <div className="flex flex-col gap-2 w-full">
              <ControlButton
                active={editor.isActive('heading', { level: 1 })}
                icon={<h1 className="text-3xl font-bold">Heading 1</h1>}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
              />
              <ControlButton
                active={editor.isActive('heading', { level: 2 })}
                icon={<h3 className="text-2xl font-bold">Heading 2</h3>}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
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
      <ColorPicker
        active={editor.isActive('color')}
        color={editor.getAttributes('textStyle').color}
        onChange={handleColorChange}
      />
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
    </>
  )
}

function ParagraphBlockControls({ editor }: { editor: Editor }) {
  const handleColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  return (
    <>
      <Popover offset={10} placement="bottom" showArrow>
        <PopoverTrigger>
          <Button
            size="sm"
            isIconOnly
            className="text-white"
            color={editor.isActive('heading') ? 'primary' : 'default'}
            variant={editor.isActive('heading') ? 'solid' : 'light'}>
            <LuHeading size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="py-3 bg-black w-56">
          {() => (
            <div className="flex flex-col gap-2 w-full">
              <ControlButton
                active={editor.isActive('heading', { level: 3 })}
                icon={<h3 className="text-xl font-bold">Sub Heading</h3>}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
              />
              <ControlButton
                active={editor.isActive('heading', { level: 5 })}
                icon={<h5 className="text-lg font-bold">Subtitle</h5>}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 5 }).run()
                }
              />

              <ControlButton
                active={editor.isActive('paragraph')}
                icon={<p className="text-base">Paragraph</p>}
                onClick={() => editor.chain().focus().setParagraph().run()}
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
      <ControlButton
        active={editor.isActive('bold')}
        icon={<LuBold />}
        tooltipText="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ControlButton
        active={editor.isActive('italic')}
        icon={<LuItalic />}
        tooltipText="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ControlButton
        active={editor.isActive('strike')}
        icon={<LuStrikethrough />}
        tooltipText="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <ControlButton
        active={editor.isActive('code')}
        icon={<LuCode />}
        tooltipText="Code"
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
      <ColorPicker
        active={editor.isActive('color')}
        color={editor.getAttributes('textStyle').color}
        onChange={handleColorChange}
      />
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
      <ControlButton
        active={editor.isActive('bulletList')}
        icon={<LuList size={18} />}
        tooltipText="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ControlButton
        active={editor.isActive('orderedList')}
        icon={<LuListOrdered size={18} />}
        tooltipText="Ordered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ControlButton
        active={false}
        icon={<GoHorizontalRule size={18} />}
        tooltipText="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
      <ControlButton
        active={editor.isActive('blockquote')}
        icon={<LuQuote size={18} />}
        tooltipText="Blockquote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
    </>
  )
}
function RichTextBlockControls({ editor }: { editor: Editor }) {
  return <ParagraphBlockControls editor={editor} />
}

export function ControlButton({
  active,
  icon,
  tooltipText,
  ...props
}: {
  active: boolean
  icon: ReactElement | string
  tooltipText?: string
  [key: string]: ButtonProps[keyof ButtonProps]
}) {
  return (
    <Tooltip showArrow content={tooltipText} hidden={!tooltipText}>
      <Button
        size="sm"
        isIconOnly
        className="text-white w-full"
        color={active ? 'primary' : 'default'}
        variant={active ? 'solid' : 'light'}
        {...props}>
        {icon}
      </Button>
    </Tooltip>
  )
}

export function ColorPicker({
  active,
  color,
  onChange,
}: {
  active: boolean
  color: string
  onChange: (color: string) => void
}) {
  return (
    <Popover offset={10} placement="bottom" shouldCloseOnBlur={false}>
      <PopoverTrigger>
        <Button
          size="sm"
          isIconOnly
          className={cn(isColorDark(color) ? 'text-white' : 'text-black')}
          style={{
            backgroundColor: color,
          }}
          color={active ? 'primary' : 'default'}
          variant={active ? 'solid' : 'light'}>
          <MdInvertColors size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-transparent">
        {() => {
          const currentColor = color

          return <HexColorPicker color={currentColor} onChange={onChange} />
        }}
      </PopoverContent>
    </Popover>
  )
}
