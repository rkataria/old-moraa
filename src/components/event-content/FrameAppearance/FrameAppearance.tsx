import { MdOutlineDesignServices } from 'react-icons/md'

import { BreakoutAppearance } from './BreakoutAppearance'
import { CommonAppearance } from './CommonAppearance'
import { MoraaBoardAppearance } from './MoraaBoardAppearance'
import { MoraaSlideAppearance } from './MoraaSlideAppearance'
import { PdfAppearance } from './PdfAppearance'
import { PollAppearance } from './PollAppearance'
import { ReflectionAppearance } from './ReflectionAppearance'
import { RichTextAppearance } from './RichTextAppearance'
import { TextImageAppearance } from './TextImageAppearance'

import { ContentType } from '@/components/common/ContentTypePicker'
import { RightSidebarHeader } from '@/components/common/StudioLayout/RightSidebarHeader'
import { useEventContext } from '@/contexts/EventContext'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { RoomProvider } from '@/contexts/RoomProvider'

export function FrameAppearance() {
  const { currentFrame } = useEventContext()
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
    [ContentType.PDF_VIEWER]: <PdfAppearance key={currentFrame.id} />,
    [ContentType.REFLECTION]: <ReflectionAppearance key={currentFrame.id} />,
    [ContentType.VIDEO_EMBED]: null,
    [ContentType.TEXT_IMAGE]: <TextImageAppearance key={currentFrame.id} />,
    [ContentType.IMAGE_VIEWER]: null,
    [ContentType.RICH_TEXT]: <RichTextAppearance key={currentFrame.id} />,
    [ContentType.MIRO_EMBED]: null,
    [ContentType.MORAA_BOARD]: (
      <RoomProvider>
        <MoraaBoardAppearance key={currentFrame.id} />
      </RoomProvider>
    ),
    [ContentType.MORAA_SLIDE]: <MoraaSlideAppearance key={currentFrame.id} />,
    [ContentType.BREAKOUT]: <BreakoutAppearance key={currentFrame.id} />,
    [ContentType.POWERPOINT]: null,
  }

  const renderer = renderersByContentType[currentFrame.type]

  return (
    <div>
      <RightSidebarHeader
        icon={<MdOutlineDesignServices size={18} />}
        title={activeObject?.type ? activeObject.type : currentFrame.type}
      />
      <div className="p-4 flex flex-col gap-4">
        <CommonAppearance />
        {renderer}
      </div>
    </div>
  )
}
