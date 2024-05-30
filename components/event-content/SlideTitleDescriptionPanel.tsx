import { useContext, useState } from 'react'

import { SlideText } from './SlideText'
import { SlideTextBlock } from './SlideTextBlock'
import { ContentType } from '../common/ContentTypePicker'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export const slideTypesWithTitle = [
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

export const slideTypesWithDescription = [
  ContentType.REFLECTION,
  ContentType.VIDEO_EMBED,
  ContentType.MIRO_EMBED,
  ContentType.VIDEO,
  ContentType.GOOGLE_SLIDES,
  ContentType.GOOGLE_SLIDES_IMPORT,
  ContentType.PDF_VIEWER,
  ContentType.MORAA_BOARD,
]

export function SlideTitleDescriptionPanel() {
  const { currentSlide } = useContext(EventContext) as EventContextType
  const [editableId, setEditableId] = useState('')
  if (!currentSlide) return null

  const renderTitle = slideTypesWithTitle.includes(currentSlide.type)

  const renderDescription = slideTypesWithDescription.includes(
    currentSlide.type
  )

  const getTitle = () => {
    if (currentSlide.type === ContentType.REFLECTION) {
      return <SlideText disableEnter type="title" className="pl-4" />
    }

    return (
      <SlideTextBlock
        blockType="header"
        editableId={editableId}
        onClick={(blockId: string) => setEditableId(blockId)}
      />
    )
  }

  const getDescription = () => (
    <SlideTextBlock
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
