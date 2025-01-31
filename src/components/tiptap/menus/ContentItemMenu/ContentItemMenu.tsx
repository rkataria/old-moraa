import { useEffect, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { Editor } from '@tiptap/react'
import DragHandle from '@tiptap-pro/extension-drag-handle-react'

import useContentItemActions from './hooks/useContentItemActions'
import { useData } from './hooks/useData'

import { DropdownButton } from '@/components/tiptap/ui/Dropdown'
import { Icon } from '@/components/tiptap/ui/Icon'
import { Toolbar } from '@/components/tiptap/ui/Toolbar'
import { cn } from '@/utils/utils'

export type ContentItemMenuProps = {
  editor: Editor
  classnames?: {
    menu: string
    gripButton: string
  }
}

export function ContentItemMenu({ editor, classnames }: ContentItemMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const data = useData()
  const actions = useContentItemActions(
    editor,
    data.currentNode,
    data.currentNodePos
  )

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta('lockDragHandle', true)
    } else {
      editor.commands.setMeta('lockDragHandle', false)
    }
  }, [editor, menuOpen])

  return (
    <DragHandle
      pluginKey="ContentItemMenu"
      editor={editor}
      onNodeChange={data.handleNodeChange}
      tippyOptions={{
        offset: [-2, 16],
        zIndex: 99,
      }}>
      <div className={cn('flex items-center gap-0.5', classnames?.menu)}>
        <Toolbar.Button onClick={actions.handleAdd}>
          <Icon name="Plus" />
        </Toolbar.Button>
        <Toolbar.Button onClick={() => setMenuOpen(true)}>
          <Icon name="GripVertical" />
        </Toolbar.Button>
        <Popover
          isOpen={menuOpen}
          placement="bottom"
          onOpenChange={(open) => setMenuOpen(open)}
          offset={20}>
          <PopoverTrigger>
            <span />
          </PopoverTrigger>
          <PopoverContent>
            {() => (
              <div className="p-2 flex flex-col min-w-[16rem]">
                <DropdownButton
                  onClick={() => {
                    setMenuOpen(false)
                    actions.resetTextFormatting()
                  }}>
                  <Icon name="RemoveFormatting" />
                  Clear formatting
                </DropdownButton>
                <DropdownButton
                  onClick={() => {
                    setMenuOpen(false)
                    actions.copyNodeToClipboard()
                  }}>
                  <Icon name="Clipboard" />
                  Copy to clipboard
                </DropdownButton>
                <DropdownButton
                  onClick={() => {
                    setMenuOpen(false)
                    actions.duplicateNode()
                  }}>
                  <Icon name="Copy" />
                  Duplicate
                </DropdownButton>
                <Toolbar.Divider horizontal />
                <DropdownButton
                  onClick={() => {
                    setMenuOpen(false)
                    actions.deleteNode()
                  }}
                  className="text-red-500 bg-red-500 dark:text-red-500 hover:bg-red-500 dark:hover:text-red-500 dark:hover:bg-red-500 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-20">
                  <Icon name="Trash2" />
                  Delete
                </DropdownButton>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </DragHandle>
  )
}
