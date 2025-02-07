import { useContext, useState } from 'react'

import { FrameText } from './FrameText'
import { FrameTextBlock } from './FrameTextBlock'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { FrameType } from '@/utils/frame-picker.util'

export const frameTypesWithTitle = [
  FrameType.REFLECTION,
  FrameType.BREAKOUT,
  FrameType.MORAA_BOARD,
  FrameType.MORAA_PAD,
  FrameType.RICH_TEXT,
  FrameType.WORD_CLOUD,
]

export const frameTypesWithDescription = [
  FrameType.REFLECTION,
  FrameType.BREAKOUT,
  FrameType.MORAA_BOARD,
  FrameType.MORAA_PAD,
  FrameType.RICH_TEXT,
]

export function FrameTitleDescriptionPanel() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const [editableId, setEditableId] = useState('')
  if (!currentFrame) return null

  const renderTitle = frameTypesWithTitle.includes(currentFrame.type)

  const renderDescription = frameTypesWithDescription.includes(
    currentFrame.type
  )

  const getTitle = () => <FrameText disableEnter type="title" />
  const getDescription = () => (
    <FrameTextBlock
      blockType="paragraph"
      editableId={editableId}
      onClick={(blockId: string) => setEditableId(blockId)}
    />
  )

  if (!renderTitle && !renderDescription) return null

  return (
    <div className="h-fit flex flex-col gap-2">
      {renderTitle && getTitle()}
      {renderDescription && getDescription()}
    </div>
  )
}
