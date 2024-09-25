import { useContext } from 'react'

import { IoColorPaletteOutline } from 'react-icons/io5'

import { CommonAppearance } from './CommonAppearance'
import { MoraaSlideAppearance } from './MoraaSlideAppearance'
import { PollAppearance } from './PollAppearance'
import { TextImageAppearance } from './TextImageAppearance'

import { ContentType } from '@/components/common/ContentTypePicker'
import { RightSidebarHeader } from '@/components/common/StudioLayout/RightSidebarHeader'
import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { EventContextType } from '@/types/event-context.type'

export function FrameAppearance() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const { canvas } = useMoraaSlideEditorContext()

  // if (!canvas) return null

  const activeObject = canvas?.getActiveObject()

  if (!currentFrame) return null

  const renderersByContentType: Record<ContentType, React.ReactNode> = {
    [ContentType.VIDEO]: null,
    [ContentType.GOOGLE_SLIDES_IMPORT]: null,
    [ContentType.COVER]: null,
    [ContentType.POLL]: <PollAppearance />,
    [ContentType.GOOGLE_SLIDES]: null,
    [ContentType.PDF_VIEWER]: null,
    [ContentType.REFLECTION]: null,
    [ContentType.VIDEO_EMBED]: null,
    [ContentType.TEXT_IMAGE]: <TextImageAppearance key={currentFrame.id} />,
    [ContentType.IMAGE_VIEWER]: null,
    [ContentType.RICH_TEXT]: null,
    [ContentType.MIRO_EMBED]: null,
    [ContentType.MORAA_BOARD]: null,
    [ContentType.MORAA_SLIDE]: <MoraaSlideAppearance key={currentFrame.id} />,
    [ContentType.BREAKOUT]: null,
    [ContentType.POWERPOINT]: null,
  }

  const renderer = renderersByContentType[currentFrame.type]

  return (
    <div>
      <RightSidebarHeader
        icon={<IoColorPaletteOutline size={18} />}
        title={activeObject?.type ? activeObject.type : 'Appearance'}
      />
      <div className="p-4 flex flex-col gap-4">
        <CommonAppearance />
        {renderer}
      </div>
    </div>
  )
}
