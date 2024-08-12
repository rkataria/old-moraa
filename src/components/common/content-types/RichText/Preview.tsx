import { useContext } from 'react'

import { RichTextEditor } from './Editor'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

export function RichTextPreview({
  frame,
  asThumbnail,
}: {
  frame: IFrame
  asThumbnail?: boolean
}) {
  const { preview, eventMode } = useContext(EventContext) as EventContextType

  const canEditRichText =
    !!(
      !asThumbnail &&
      eventMode !== 'present' &&
      frame.config.allowToCollaborate
    ) && !preview

  return <RichTextEditor editorId={frame.id} editable={canEditRichText} />
}
