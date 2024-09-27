import { useContext, useEffect, useState } from 'react'

import { useDebounce, useClickAway } from '@uidotdev/usehooks'
import isEqual from 'lodash.isequal'

import { TextBlockEditor } from '../event-content/TextBlockEditor'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { TextBlock } from '@/types/frame.type'
import { cn, truncateHTMLWithTags } from '@/utils/utils'

export function Note({
  note,
  frameId,
  editable,
  placeholder = '',
  className,
  wrapOnBlur,
}: {
  note: string
  frameId: string
  editable: boolean
  placeholder?: string
  className?: string
  wrapOnBlur?: boolean
}) {
  const [updatedNote, setUpdatedNote] = useState(note)
  const [wrapped, setWrapped] = useState(false)
  const [editNote, setEditNote] = useState(false)

  useEffect(() => {
    setEditNote(false)
  }, [editable])

  const ref = useClickAway<HTMLDivElement>(() => {
    setEditNote(false)
    if (wrapOnBlur) {
      setWrapped(true)
    }
  })

  useEffect(() => {
    setUpdatedNote(note)
  }, [note])

  const debouncedNote = useDebounce(updatedNote, 500)

  const truncatedString = truncateHTMLWithTags(note || placeholder, 60)

  const handleBlockChange = (block: TextBlock) => {
    setUpdatedNote(block.data.html)
  }

  const { updateFrame } = useContext(EventContext) as EventContextType

  useEffect(() => {
    if (!updatedNote) return
    if (isEqual(note, updatedNote)) return

    updateFrame({
      frameId,
      framePayload: {
        notes: debouncedNote,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNote])

  if (!editNote || wrapped) {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
      <div
        onClick={() => {
          if (editable) {
            setEditNote(true)
          }
          setWrapped(false)
        }}
        id="note-editor"
        className={cn(
          'break-all ProseMirror tiptap',
          {
            'cursor-pointer': editable,
          },
          className
        )}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: wrapOnBlur ? truncatedString : note || placeholder,
        }}
      />
    )
  }

  return (
    <div ref={ref} id="note-editor">
      <TextBlockEditor
        key={frameId}
        autoFocus
        placeholder="Type your note here"
        showToolbar={false}
        block={{ id: frameId, type: 'paragraph', data: { html: updatedNote } }}
        className={cn('w-full h-full overflow-y-auto', className)}
        onChange={handleBlockChange}
      />
    </div>
  )
}
