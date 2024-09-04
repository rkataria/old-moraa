import { memo, useCallback } from 'react'

import { Editor } from '@tiptap/react'

import { TableOfContents } from '../TableOfContents'

export const Sidebar = memo(
  ({
    editor,
    isOpen,
    onClose,
    editorRef,
  }: {
    editor: Editor
    isOpen?: boolean
    onClose: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editorRef?: any
  }) => {
    const handlePotentialClose = useCallback(() => {
      if (window.innerWidth < 1024) {
        onClose()
      }
    }, [onClose])

    if (!isOpen) return null

    return (
      <TableOfContents
        onItemClick={handlePotentialClose}
        editor={editor}
        editorRef={editorRef}
      />
    )
  }
)

Sidebar.displayName = 'TableOfContentSidepanel'
