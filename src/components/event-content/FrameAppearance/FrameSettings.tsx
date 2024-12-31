import { FiSettings } from 'react-icons/fi'

import { BreakoutSettings } from './BreakoutSettings'
import { MCQSettings } from './MCQSettings'
import { MiroEmbedSettings } from './MiroEmbedSettings'
import { MoraaBoardSettings } from './MoraaBoardSettings'
import { PdfSettings } from './PdfSettings'
import { PollSettings } from './PollSettings'
import { ReflectionSettings } from './ReflectionSettings'
import { RichTextSettings } from './RichTextSettings'
import { VideoEmbedSettings } from './VideoEmbedSettings'

import { RightSidebarHeader } from '@/components/common/StudioLayout/RightSidebarHeader'
import { useEventContext } from '@/contexts/EventContext'
import { RoomProvider } from '@/contexts/RoomProvider'
import { FrameType } from '@/utils/frame-picker.util'

export function FrameSettings() {
  const { currentFrame } = useEventContext()

  if (!currentFrame) return null

  const renderersByContentType: Record<FrameType, React.ReactNode> = {
    [FrameType.VIDEO]: null,
    [FrameType.POLL]: <PollSettings />,
    [FrameType.GOOGLE_SLIDES]: null,
    [FrameType.PDF_VIEWER]: <PdfSettings />,
    [FrameType.REFLECTION]: <ReflectionSettings />,
    [FrameType.VIDEO_EMBED]: <VideoEmbedSettings />,
    [FrameType.IMAGE_VIEWER]: null,
    [FrameType.RICH_TEXT]: <RichTextSettings />,
    [FrameType.MIRO_EMBED]: <MiroEmbedSettings />,
    [FrameType.MORAA_BOARD]: (
      <RoomProvider frameId={currentFrame.id}>
        <MoraaBoardSettings key={currentFrame.id} />
      </RoomProvider>
    ),
    [FrameType.MORAA_SLIDE]: null,
    [FrameType.BREAKOUT]: <BreakoutSettings />,
    [FrameType.POWERPOINT]: null,
    [FrameType.Q_A]: null,
    [FrameType.MORAA_PAD]: null,
    [FrameType.MCQ]: <MCQSettings />,
  }

  const renderer = renderersByContentType[currentFrame.type as FrameType]

  return (
    <div>
      <RightSidebarHeader
        icon={<FiSettings size={18} />}
        title="Frame Settings"
      />
      <div className="p-4 flex flex-col gap-4">{renderer}</div>
    </div>
  )
}
