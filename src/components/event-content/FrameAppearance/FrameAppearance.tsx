import { MdOutlineDesignServices } from 'react-icons/md'

import { BreakoutAppearance } from './BreakoutAppearance'
import { CommonAppearance } from './CommonAppearance'
import { MoraaBoardAppearance } from './MoraaBoardAppearance'
import { MoraaSlideAppearance } from './MoraaSlideAppearance'
import { PdfAppearance } from './PdfAppearance'
import { PollAppearance } from './PollAppearance'
import { ReflectionAppearance } from './ReflectionAppearance'
import { RichTextAppearance } from './RichTextAppearance'

import { RightSidebarHeader } from '@/components/common/StudioLayout/RightSidebarHeader'
import { useEventContext } from '@/contexts/EventContext'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { RoomProvider } from '@/contexts/RoomProvider'
import { FrameType } from '@/utils/frame-picker.util'

export function FrameAppearance() {
  const { currentFrame } = useEventContext()
  const { canvas } = useMoraaSlideEditorContext()

  // if (!canvas) return null

  const activeObject = canvas?.getActiveObject()

  if (!currentFrame) return null

  const renderersByContentType: Record<FrameType, React.ReactNode> = {
    [FrameType.VIDEO]: null,
    [FrameType.GOOGLE_SLIDES_IMPORT]: null,
    [FrameType.POLL]: <PollAppearance />,
    [FrameType.GOOGLE_SLIDES]: null,
    [FrameType.PDF_VIEWER]: <PdfAppearance key={currentFrame.id} />,
    [FrameType.REFLECTION]: <ReflectionAppearance key={currentFrame.id} />,
    [FrameType.VIDEO_EMBED]: null,
    [FrameType.IMAGE_VIEWER]: null,
    [FrameType.RICH_TEXT]: <RichTextAppearance key={currentFrame.id} />,
    [FrameType.MIRO_EMBED]: null,
    [FrameType.MORAA_BOARD]: (
      <RoomProvider>
        <MoraaBoardAppearance key={currentFrame.id} />
      </RoomProvider>
    ),
    [FrameType.MORAA_SLIDE]: <MoraaSlideAppearance key={currentFrame.id} />,
    [FrameType.BREAKOUT]: <BreakoutAppearance key={currentFrame.id} />,
    [FrameType.POWERPOINT]: null,
    [FrameType.Q_A]: null,
    [FrameType.MORAA_PAD]: null,
  }

  const renderer = renderersByContentType[currentFrame.type as FrameType]

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
