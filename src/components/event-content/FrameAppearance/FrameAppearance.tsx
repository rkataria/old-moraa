import { useContext } from 'react'

import { IoColorPaletteOutline } from 'react-icons/io5'

import { CommonAppearance } from './CommonAppearance'
import { MoraaSlideAppearance } from './MoraaSlideAppearance'
import { PollAppearance } from './PollAppearance'
import { TextImageAppearance } from './TextImageAppearance'
import { ConfigurationHeader } from '../FrameConfiguration/ConfigurationHeader'

import { ContentType } from '@/components/common/ContentTypePicker'
import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function FrameAppearance() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )

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
  }

  const renderer = renderersByContentType[currentFrame.type]

  const canvasActiveObject = canvas?.getActiveObject()

  if (canvasActiveObject) {
    return (
      <div className="p-2 text-sm">
        <ConfigurationHeader
          icon={<IoColorPaletteOutline size={18} />}
          title={canvasActiveObject.type!}
        />
        <div className="pt-8 flex flex-col gap-4">
          <MoraaSlideAppearance key={currentFrame.id} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 text-sm">
      <ConfigurationHeader
        icon={<IoColorPaletteOutline size={18} />}
        title="Appearance"
      />
      <div className="pt-8 flex flex-col gap-4">
        <CommonAppearance />
        {renderer}
      </div>
    </div>
  )
}
