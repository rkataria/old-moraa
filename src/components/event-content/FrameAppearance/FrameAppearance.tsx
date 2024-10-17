import { MdOutlineDesignServices } from 'react-icons/md'

import { MoraaSlideAppearance } from './MoraaSlideAppearance'

import { RightSidebarHeader } from '@/components/common/StudioLayout/RightSidebarHeader'
import { useEventContext } from '@/contexts/EventContext'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'
import { FrameType } from '@/utils/frame-picker.util'

export function FrameAppearance() {
  const { currentFrame } = useEventContext()
  const { canvas } = useMoraaSlideEditorContext()

  // if (!canvas) return null

  const activeObject = canvas?.getActiveObject()

  if (!currentFrame) return null

  const renderersByContentType: Record<FrameType, React.ReactNode> = {
    [FrameType.VIDEO]: null,
    [FrameType.POLL]: null,
    [FrameType.GOOGLE_SLIDES]: null,
    [FrameType.PDF_VIEWER]: null,
    [FrameType.REFLECTION]: null,
    [FrameType.VIDEO_EMBED]: null,
    [FrameType.IMAGE_VIEWER]: null,
    [FrameType.RICH_TEXT]: null,
    [FrameType.MIRO_EMBED]: null,
    [FrameType.MORAA_BOARD]: null,
    [FrameType.MORAA_SLIDE]: <MoraaSlideAppearance key={currentFrame.id} />,
    [FrameType.BREAKOUT]: null,
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
      <div className="p-4 flex flex-col gap-4">{renderer}</div>
    </div>
  )
}
