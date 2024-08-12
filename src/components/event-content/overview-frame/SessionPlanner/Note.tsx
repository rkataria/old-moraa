/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ChangeEvent, useContext, useEffect, useState } from 'react'

import { Textarea } from '@nextui-org/react'
import { useDebounce } from '@uidotdev/usehooks'
import isEqual from 'lodash.isequal'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function Note({
  frameId,
  notes,
  editable,
  placeholder = 'Click to add notes',
  wrapOnblur,
}: {
  frameId: string
  notes: string
  editable?: boolean
  placeholder?: string
  wrapOnblur?: boolean
}) {
  const { updateFrame, preview } = useContext(EventContext) as EventContextType

  const [isEditable, setIsEditable] = useState(editable)

  const [notesHtml, setNotesHtml] = useState<string | null>(null)
  const frameNote = useDebounce(notesHtml, 500)

  const handleBlockChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNotesHtml(e.target.value)
  }
  useEffect(() => {
    if (!frameNote) return
    if (isEqual(frameNote, notes)) return

    updateFrame({
      frameId,
      framePayload: {
        notes: frameNote,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameNote])

  const renderContent = () => {
    if (!isEditable || preview) {
      return (
        <p
          className="text-sm line-clamp-2 h-fit"
          style={{ wordBreak: 'break-all' }}
          onClick={() => {
            if (editable === false) return
            if (preview) return
            setIsEditable(true)
          }}>
          {notes || placeholder}
        </p>
      )
    }

    return (
      <Textarea
        onBlur={() => {
          if (!wrapOnblur) return
          setIsEditable(false)
        }}
        variant="bordered"
        minRows={1}
        isReadOnly={preview}
        defaultValue={notes}
        onChange={handleBlockChange}
        placeholder={placeholder}
        classNames={{
          input: 'text-primary-800 scrollbar-none',
          inputWrapper: 'border-none p-0 shadow-none',
        }}
      />
    )
  }

  return (
    <div style={{ wordBreak: 'break-all' }} className="h-full p-2 border-r-2">
      {renderContent()}
    </div>
  )
}
