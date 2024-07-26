import { useCallback, useState } from 'react'

import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'

import { MenuProps } from '../types'

import { LinkEditorPanel } from '@/components/tiptap/panels'
import { LinkPreviewPanel } from '@/components/tiptap/panels/LinkPreviewPanel'

export function LinkMenu({ editor, appendTo }: MenuProps): JSX.Element {
  const [showEdit, setShowEdit] = useState(false)

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive('link')

    return isActive
  }, [editor])

  const { href: link, target } = editor.getAttributes('link')

  const handleEdit = useCallback(() => {
    setShowEdit(true)
  }, [])

  const onSetLink = useCallback(
    (url: string, openInNewTab?: boolean) => {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: openInNewTab ? '_blank' : '' })
        .run()

      setShowEdit(false)
    },
    [editor]
  )

  const onUnsetLink = useCallback(() => {
    // eslint-disable-next-line newline-per-chained-call
    editor.chain().focus().extendMarkRange('link').unsetLink().run()

    setShowEdit(false)

    return null
  }, [editor])

  // const onShowEdit = useCallback(() => {
  //   setShowEdit(true)
  // }, [])

  // const onHideEdit = useCallback(() => {
  //   setShowEdit(false)
  // }, [])

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey="textMenu"
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        appendTo: () => appendTo?.current,
        onHidden: () => {
          setShowEdit(false)
        },
      }}>
      {showEdit ? (
        <LinkEditorPanel
          initialUrl={link}
          initialOpenInNewTab={target === '_blank'}
          onSetLink={onSetLink}
        />
      ) : (
        <LinkPreviewPanel
          url={link}
          onClear={onUnsetLink}
          onEdit={handleEdit}
        />
      )}
    </BaseBubbleMenu>
  )
}
// eslint-disable-next-line import/no-default-export
export default LinkMenu
