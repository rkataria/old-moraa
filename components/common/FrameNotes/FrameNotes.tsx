import { useContext, useEffect, useMemo, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { LuClipboardEdit } from 'react-icons/lu'

import { ConfigurationHeader } from '@/components/event-content/FrameConfiguration/ConfigurationHeader'
import { TextBlockEditor } from '@/components/event-content/TextBlockEditor'
import { EventContext } from '@/contexts/EventContext'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { FrameNotesService } from '@/services/frame-note.service'
import { EventContextType } from '@/types/event-context.type'
import { TextBlock } from '@/types/frame.type'
import { QueryKeys } from '@/utils/query-keys'

export function FrameNotes() {
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

  if (!currentFrame) return null

  return (
    <div className="p-4 text-sm">
      <ConfigurationHeader
        icon={<LuClipboardEdit size={20} strokeWidth={1.7} />}
        title="Notes"
      />
      <div className="pt-8 flex flex-col gap-4">
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
      </div>
    </div>
  )
}
