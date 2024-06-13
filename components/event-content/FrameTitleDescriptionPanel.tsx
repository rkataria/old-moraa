import { useContext, useState } from 'react'

import { FrameText } from './FrameText'
import { FrameTextBlock } from './FrameTextBlock'
import { ContentType } from '../common/ContentTypePicker'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export const frameTypesWithTitle = [
  ContentType.IMAGE_VIEWER,
  ContentType.MIRO_EMBED,
  ContentType.VIDEO_EMBED,
  ContentType.VIDEO,
  ContentType.REFLECTION,
  ContentType.GOOGLE_SLIDES,
  ContentType.GOOGLE_SLIDES_IMPORT,
  ContentType.PDF_VIEWER,
  ContentType.MORAA_BOARD,
]

export const frameTypesWithDescription = [
  ContentType.REFLECTION,
  ContentType.VIDEO_EMBED,
  ContentType.MIRO_EMBED,
  ContentType.VIDEO,
  ContentType.GOOGLE_SLIDES,
  ContentType.GOOGLE_SLIDES_IMPORT,
  ContentType.PDF_VIEWER,
  ContentType.MORAA_BOARD,
]

export function FrameTitleDescriptionPanel() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const [editableId, setEditableId] = useState('')
  if (!currentFrame) return null

  const renderTitle = frameTypesWithTitle.includes(currentFrame.type)

  const renderDescription = frameTypesWithDescription.includes(
    currentFrame.type
  )

  const getTitle = () => {
    if (currentFrame.type === ContentType.REFLECTION) {
      return <FrameText disableEnter type="title" className="pl-4" />
    }

    return (
      <FrameTextBlock
        blockType="header"
        editableId={editableId}
        onClick={(blockId: string) => setEditableId(blockId)}
      />
    )
  }

  const getDescription = () => (
    <FrameTextBlock
      blockType="paragraph"
      editableId={editableId}
      onClick={(blockId: string) => setEditableId(blockId)}
    />
  )

  return (
    <div className="h-fit">
      {renderTitle && getTitle()}
      {renderDescription && getDescription()}
    </div>
  )
}
