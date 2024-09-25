'use client'

import { memo, useEffect, useState } from 'react'

import { Editor as CoreEditor } from '@tiptap/core'
import { TableOfContentsStorage } from '@tiptap-pro/extension-table-of-contents'

import { cn } from '@/components/tiptap/lib/utils'

export type TableOfContentsProps = {
  editor: CoreEditor
  onItemClick?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorRef?: any
}

export const TableOfContents = memo(
  ({ editor, onItemClick, editorRef }: TableOfContentsProps) => {
    const [data, setData] = useState<TableOfContentsStorage | null>(null)

    useEffect(() => {
      const handler = ({ editor: currentEditor }: { editor: CoreEditor }) => {
        setData({ ...currentEditor.extensionStorage.tableOfContents })
      }

      handler({ editor })

      editor.on('update', handler)
      editor.on('selectionUpdate', handler)

      return () => {
        editor.off('update', handler)
        editor.off('selectionUpdate', handler)
      }
    }, [editor])

    const scrollToElementById = (id: string) => {
      if (editorRef.current) {
        // Find the target element by id within the container
        const escapedId = CSS.escape(id)
        // Find the target element by id within the container
        const targetElement = editorRef.current.querySelector(`#${escapedId}`)
        if (targetElement) {
          // Scroll the container to make the target element visible
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
      onItemClick?.()
    }

    return (
      <div className="overflow-y-auto scrollbar-thin w-[315px] p-2 border-1 border-gray-200 rounded-md">
        <h2 className="p-1 font-bold">Table of Contents</h2>
        {data && data.content.length > 0 ? (
          data.content.map((item) => (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
            <div
              key={item.id}
              style={{ paddingLeft: `${1 * item.level}rem` }}
              onClick={() => scrollToElementById(item.id)}
              className={cn(
                'w-full outline-none line-clamp-1 text-sm tracking-tight break-all font-medium text-gray-500 cursor-pointer mb-2 px-1'
              )}>
              {item.itemIndex}. &nbsp;{item.textContent}
            </div>
          ))
        ) : (
          <div className="text-sm text-neutral-500 p-1">
            Start adding headlines to your document …
          </div>
        )}
      </div>
    )
  }
)

TableOfContents.displayName = 'TableOfContents'
