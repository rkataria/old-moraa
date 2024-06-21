/* eslint-disable jsx-a11y/control-has-associated-label */

import { useContext, useEffect, useMemo, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { RiUnpinLine } from 'react-icons/ri'
import { RxCross1 } from 'react-icons/rx'

import { Button } from '@nextui-org/react'

import { TextBlockEditor } from '../event-content/TextBlockEditor'

import { EventContext } from '@/contexts/EventContext'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { FrameNotesService } from '@/services/frame-note.service'
import { EventContextType } from '@/types/event-context.type'
import { TextBlock } from '@/types/frame.type'
import { QueryKeys } from '@/utils/query-keys'
import { cn } from '@/utils/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NoteOverlaySidebarWrapper({ contentClass, children, onClose }: any) {
  return (
    <div className={cn('w-full h-full')}>
      <div className="flex items-center justify-between w-full p-2">
        <Button variant="light" isIconOnly size="sm" onClick={onClose}>
          <RxCross1 size={18} />
        </Button>
        <h3 className="text-sm font-medium text-center">Notes</h3>
        <Button
          variant="light"
          isIconOnly
          size="sm"
          disabled
          className="opacity-0 pointer-events-none">
          <RiUnpinLine size={24} />
        </Button>
      </div>
      <div className={cn(contentClass)}>{children}</div>
    </div>
  )
}

export function NoteOverlay() {
  const [editingBlock, setEditingBlock] = useState<string>('')
  const [notesHtml, setNotesHtml] = useState<TextBlock | null>(null)
  const { setRightSidebarVisiblity } = useStudioLayout()

  const { currentFrame, isOwner, eventMode, preview, overviewOpen } =
    useContext(EventContext) as EventContextType

  useEffect(() => {
    if (!currentFrame?.id) {
      setRightSidebarVisiblity(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrame?.id])

  const isEditable = isOwner && eventMode === 'edit' && !preview
  const selectedNotesQuery = useQuery({
    queryKey: QueryKeys.GetFrameNotes.listing({ frameId: currentFrame?.id }),
    queryFn: () =>
      FrameNotesService.getFrameNotes({ frameId: currentFrame?.id || '' }),
    enabled: !!currentFrame?.id,
  })

  const selectedNotes = selectedNotesQuery?.data?.data

  const textBlock = useMemo(
    () =>
      ({
        id: currentFrame?.id,
        data: {
          html: selectedNotes?.content || '',
        },
        type: 'richtext',
      }) as TextBlock,
    [selectedNotes, currentFrame?.id]
  )

  const frameNoteHtml = useDebounce(notesHtml, 500)

  const approveRegistrationMutation = useMutation({
    mutationFn: FrameNotesService.upsertFrameNotes,
  })

  const updateFrameNotes = (block: TextBlock) => {
    if (currentFrame?.id && block?.data?.html) {
      approveRegistrationMutation.mutate(
        {
          notesPayload: {
            content: block?.data?.html || '',
          },
          frameId: currentFrame?.id,
          noteId: selectedNotes?.id || '',
        },
        {
          onSuccess: () => {
            selectedNotesQuery?.refetch()
          },
        }
      )
    }
  }

  const handleBlockChange = (block: TextBlock) => {
    setNotesHtml(block)
  }

  useEffect(() => {
    if (frameNoteHtml) updateFrameNotes(frameNoteHtml)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameNoteHtml])

  return (
    <NoteOverlaySidebarWrapper contentClass="relative flex flex-col w-full h-[calc(100%_-_48px)]">
      {selectedNotesQuery.isPending ? (
        overviewOpen || !currentFrame?.id ? (
          <span className="p-4 h-full flex items-center justify-center text-gray-400">
            Select a frame to add notes.
          </span>
        ) : (
          <span className="p-4">Loading...</span>
        )
      ) : isEditable ? (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div onClick={() => setEditingBlock(textBlock.id)} className="h-full">
          <TextBlockEditor
            showToolbar={false}
            block={textBlock}
            editable={editingBlock === textBlock.id}
            className="w-full h-full overflow-y-auto border-0"
            onChange={handleBlockChange}
          />
        </div>
      ) : (
        <div
          className="p-4 flex flex-col"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: textBlock?.data?.html || '' }}
        />
      )}
    </NoteOverlaySidebarWrapper>
  )
}
