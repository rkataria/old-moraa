/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ReactElement } from 'react'

import { Editor } from '@tiptap/react'
import { useIdle } from '@uidotdev/usehooks'
import { HexColorPicker } from 'react-colorful'
import {
  LuAlignCenter,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuHeading,
  LuHeading1,
  LuHeading2,
  LuItalic,
} from 'react-icons/lu'
import { MdInvertColors } from 'react-icons/md'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@nextui-org/react'

import { cn } from '@/utils/utils'

export function BlockEditorControls({
  editor,
  blockType,
}: {
  editor: Editor
  blockType: string
}) {
  const idle = useIdle(3000)

  return (
    <div
      className={cn(
        'absolute top-2 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 bg-black p-2 rounded-md text-white transition-all duration-500 z-10',
        {
          'opacity-0': idle,
          'opacity-100': !idle,
        }
      )}>
      {blockType === 'header' && <HeaderBlockControls editor={editor} />}
      {blockType === 'paragraph' && <ParagraphBlockControls editor={editor} />}
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
        <PopoverContent className="py-3 bg-black">
          {() => (
            <div className="flex flex-col gap-2 w-full">
              <ControlButton
                active={editor.isActive('heading', { level: 1 })}
                icon={<LuHeading1 size={18} />}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
              />
              <ControlButton
                active={editor.isActive('heading', { level: 2 })}
                icon={<LuHeading2 size={18} />}
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
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ControlButton
        active={editor.isActive('italic')}
        icon={<LuItalic size={18} />}
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
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      />
      <ControlButton
        active={editor.isActive({ textAlign: 'center' })}
        icon={<LuAlignCenter size={18} />}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      />
      <ControlButton
        active={editor.isActive({ textAlign: 'right' })}
        icon={<LuAlignRight size={18} />}
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
      <ControlButton
        active={editor.isActive('bold')}
        icon={<LuBold />}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ControlButton
        active={editor.isActive('italic')}
        icon={<LuItalic />}
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
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      />
      <ControlButton
        active={editor.isActive({ textAlign: 'center' })}
        icon={<LuAlignCenter size={18} />}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      />
      <ControlButton
        active={editor.isActive({ textAlign: 'right' })}
        icon={<LuAlignRight size={18} />}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      />
    </>
  )
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
  [key: string]: unknown
}) {
  return (
    <Tooltip showArrow content={tooltipText} hidden={!tooltipText}>
      <Button
        size="sm"
        isIconOnly
        className="text-white"
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
          className={cn('text-white')}
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
