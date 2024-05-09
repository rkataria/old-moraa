/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable newline-per-chained-call */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ReactElement, useState } from 'react'

import { Editor } from '@tiptap/react'
import { HexColorPicker } from 'react-colorful'
import { GoHorizontalRule } from 'react-icons/go'
import {
  LuAlignCenter,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuCheckSquare,
  LuCode,
  LuFileImage,
  LuItalic,
  LuLink,
  LuList,
  LuListOrdered,
  LuQuote,
  LuStrikethrough,
  LuTable,
  LuUnderline,
} from 'react-icons/lu'
import { MdInvertColors } from 'react-icons/md'

import {
  Button,
  ButtonProps,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@nextui-org/react'

import { FileUploader } from './FileUploader'

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
        'flex justify-center items-center gap-2 bg-black bg-opacity-75 p-1 rounded-md text-white z-[1]',
        {
          'absolute top-0 left-1/2 -translate-x-1/2': sticky,
        }
      )}>
      {blockType === 'header' && <HeaderBlockControls editor={editor} />}
      {blockType === 'paragraph' && <ParagraphBlockControls editor={editor} />}
      {blockType === 'richtext' && <RichTextBlockControls editor={editor} />}
    </div>
  )
}

function HeaderBlockControls({ editor }: { editor: Editor }) {
  const handleColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  return (
    <>
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
        color={editor.getAttributes('textStyle').color}
        onChange={handleColorChange}
      />
    </>
  )
}

function ParagraphBlockControls({ editor }: { editor: Editor }) {
  const handleColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  const toggleLink = (link: string) => {
    editor.chain().focus().toggleLink({ href: link, target: '_blank' }).run()
  }
  function renderHeading() {
    const headings = {
      1: { size: 'text-xl', weight: 'font-semibold', text: 'Heading 1' },
      2: { size: 'text-xl', weight: 'font-semibold', text: 'Heading 2' },
      3: { size: 'text-xl', weight: 'font-semibold', text: 'Heading 3' },
      5: { size: 'text-medium', weight: 'font-medium', text: 'Subtitle' },
    }

    const activeLevel = [1, 2, 3, 5].find((level) =>
      editor.isActive('heading', { level })
    )
    if (activeLevel) {
      const { size, weight, text } =
        headings[activeLevel as keyof typeof headings]

      return <div className={`${size} ${weight}`}>{text}</div>
    }

    return <div className="text-small font-normal">Paragraph</div>
  }

  return (
    <>
      <Popover offset={10} placement="bottom" showArrow>
        <PopoverTrigger>
          <Button
            size="md"
            className="text-white flex-grow-0 w-auto"
            color="default"
            variant="light">
            {renderHeading()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="py-3 bg-[#2c3227] w-56">
          {() => (
            <div className="flex flex-col gap-2 w-full">
              <Button
                size="sm"
                isIconOnly
                className="text-white flex-grow-0 w-auto"
                color={
                  editor.isActive('heading', { level: 1 })
                    ? 'primary'
                    : 'default'
                }
                variant={
                  editor.isActive('heading', { level: 1 }) ? 'solid' : 'light'
                }
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }>
                <h1 className="text-3xl font-bold">Heading 1</h1>
              </Button>

              <Button
                size="sm"
                isIconOnly
                className="text-white flex-grow-0 w-auto"
                color={
                  editor.isActive('heading', { level: 2 })
                    ? 'primary'
                    : 'default'
                }
                variant={
                  editor.isActive('heading', { level: 2 }) ? 'solid' : 'light'
                }
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }>
                <h3 className="text-2xl font-bold">Heading 2</h3>
              </Button>

              <Button
                size="sm"
                isIconOnly
                className="text-white flex-grow-0 w-auto"
                color={
                  editor.isActive('heading', { level: 3 })
                    ? 'primary'
                    : 'default'
                }
                variant={
                  editor.isActive('heading', { level: 3 }) ? 'solid' : 'light'
                }
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }>
                <h3 className="text-xl font-bold">Heading 3</h3>
              </Button>

              <Button
                size="sm"
                isIconOnly
                className="text-white flex-grow-0 w-auto"
                color={
                  editor.isActive('heading', { level: 5 })
                    ? 'primary'
                    : 'default'
                }
                variant={
                  editor.isActive('heading', { level: 5 }) ? 'solid' : 'light'
                }
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 5 }).run()
                }>
                <h5 className="text-lg font-bold">Subtitle</h5>
              </Button>

              <Button
                size="sm"
                isIconOnly
                className="text-white flex-grow-0 w-auto"
                color={editor.isActive('paragraph') ? 'primary' : 'default'}
                variant={editor.isActive('paragraph') ? 'solid' : 'light'}
                onClick={() => editor.chain().focus().setParagraph().run()}>
                <p className="text-base">Paragraph</p>
              </Button>
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
      <LinkPicker
        active={editor.isActive('link')}
        link={editor.getAttributes('link').href}
        onChange={toggleLink}
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
        active={editor.isActive('taskList')}
        icon={<LuCheckSquare size={18} />}
        tooltipText="Checklist"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
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
      <ControlButton
        active={editor.isActive('code')}
        icon={<LuCode size={18} />}
        tooltipText="Code"
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
    </>
  )
}
function RichTextBlockControls({ editor }: { editor: Editor }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = (files: any[]) => {
    const url = files ? files[0]?.signedUrl : ''
    editor.chain().focus().setImage({ src: url }).run()
  }

  return (
    <>
      <ParagraphBlockControls editor={editor} />
      <div className="bg-black">
        <FileUploader
          triggerProps={{
            isIconOnly: true,
            children: <LuFileImage size={18} className="text-white" />,
            className: 'bg-black',
          }}
          allowedFileTypes={['image', 'image/jpeg', 'image/png']}
          maxNumberOfFiles={1}
          onFilesUploaded={handleUpload}
        />
      </div>
      <ControlButton
        active={editor.isActive('table')}
        icon={<LuTable size={18} />}
        tooltipText="Insert Table"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      />
    </>
  )
}

export function ControlButton({
  active = false,
  icon,
  tooltipText,
  ...props
}: {
  active?: boolean
  icon?: ReactElement | string
  tooltipText?: string
  [key: string]: ButtonProps[keyof ButtonProps]
}) {
  return (
    <Tooltip showArrow content={tooltipText} hidden={!tooltipText}>
      <Button
        size="sm"
        isIconOnly
        className="text-white flex-grow-0 "
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
export function LinkPicker({
  active,
  link,
  onChange,
}: {
  active: boolean
  link: string
  onChange: (color: string) => void
}) {
  const [newLink, setNewLink] = useState(link)

  return (
    <Popover offset={10} placement="bottom" shouldCloseOnBlur={false}>
      <PopoverTrigger>
        <Button
          size="sm"
          isIconOnly
          title="Insert Link"
          className="text-white"
          style={{
            backgroundColor: 'black',
          }}
          color={active ? 'primary' : 'default'}
          variant={active ? 'solid' : 'light'}>
          <LuLink size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 bg-transparent">
        {() => (
          <form
            className="flex items-start gap-2 bg-white"
            onSubmit={(e) => {
              e.preventDefault()
              onChange(newLink)
            }}>
            <Input
              label="URL"
              value={newLink}
              className="rounded-md border border-gray-300 focus:outline-none focus:ring-1"
              onChange={(e) => {
                setNewLink(e.target.value)
              }}
            />
            <Button
              variant="flat"
              color="primary"
              className="inline-flex items-center rounded-md text-white bg-gray-600 px-3 py-2 text-center text-sm font-medium hover:bg-gray-700 focus:outline-none "
              type="submit">
              Add Link
            </Button>
          </form>
        )}
      </PopoverContent>
    </Popover>
  )
}
