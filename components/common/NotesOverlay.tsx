/* eslint-disable jsx-a11y/control-has-associated-label */

'use client'

import { useContext, useEffect, useMemo, useState } from 'react'

import { IconX } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'

import { TextBlockEditor } from '../event-content/TextBlockEditor'

import { EventContext } from '@/contexts/EventContext'
import { SlideNotesService } from '@/services/slide-note.service'
import { EventContextType } from '@/types/event-context.type'
import { TextBlock } from '@/types/slide.type'
import { QueryKeys } from '@/utils/query-keys'
import { cn } from '@/utils/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NoteOverlaySidebarWrapper({ contentClass, children, onClose }: any) {
  return (
    <div
      className={cn(
        'w-full bg-white/95 h-full transition-all border-l bg-white'
      )}>
      <div className="flex items-center justify-between font-semibold w-full bg-slate-100 py-2 px-4">
        <p className="text-xs">Notes</p>
        <IconX onClick={() => onClose()} className="cursor-pointer" />
      </div>
      <div className={cn(contentClass)}>{children}</div>
    </div>
  )
}

export function NoteOverlay({ onClose }: { onClose: () => void }) {
  const [editingBlock, setEditingBlock] = useState<string>('')
  const [notesHtml, setNotesHtml] = useState<TextBlock | null>(null)

  const { currentSlide, isOwner, eventMode, preview } = useContext(
    EventContext
  ) as EventContextType

  const isEditable = isOwner && eventMode === 'edit' && !preview
  const selectedNotesQuery = useQuery({
    queryKey: QueryKeys.GetSlideNotes.listing({ SlideId: currentSlide?.id }),
    queryFn: () =>
      SlideNotesService.getSlideNotes({ slideId: currentSlide?.id || '' }),
    enabled: !!currentSlide?.id,
  })

  const selectedNotes = selectedNotesQuery?.data?.data

  const textBlock = useMemo(
    () =>
      ({
        id: currentSlide?.id,
        data: {
          html: selectedNotes?.content || '',
        },
        type: 'richtext',
      }) as TextBlock,
    [selectedNotes, currentSlide?.id]
  )

  const slideNoteHtml = useDebounce(notesHtml, 500)

  const approveRegistrationMutation = useMutation({
    mutationFn: SlideNotesService.upsertSlideNotes,
  })

  const updateSlideNotes = (block: TextBlock) => {
    if (currentSlide?.id && block?.data?.html) {
      approveRegistrationMutation.mutate(
        {
          notesPayload: {
            content: block?.data?.html || '',
          },
          slideId: currentSlide?.id,
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
    if (slideNoteHtml) updateSlideNotes(slideNoteHtml)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideNoteHtml])

  return (
    <NoteOverlaySidebarWrapper
      contentClass="flex flex-col w-full h-full"
      onClose={onClose}>
      {selectedNotesQuery.isPending ? (
        <span className="p-4">Loading...</span>
      ) : isEditable ? (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div onClick={() => setEditingBlock(textBlock.id)}>
          <TextBlockEditor
            stickyToolbar
            block={textBlock}
            editable={editingBlock === textBlock.id}
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
