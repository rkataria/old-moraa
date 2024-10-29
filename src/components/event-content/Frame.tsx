// TODO: Fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useContext } from 'react'

import { MoraaBoardEditor } from './content-types/MoraaBoardEditor'
import { PollEditor } from './content-types/PollEditor'
import { FrameTitleDescriptionPanel } from './FrameTitleDescriptionPanel'
import { MiroEmbedEditor } from './MiroEmbedEditor'
import { PowerpointImporter } from './PowerpointImporter'
import { ReflectionEditor } from './ReflectionEditor'
import { VideoEmbedEditor } from './VideoEmbedEditor'
import { BreakoutFrame } from '../common/breakout/BreakoutFrame'
import { GoogleSlidesFrame } from '../common/content-types/GoogleSlides/GoogleSlides'
import { MoraaPadFrame } from '../common/content-types/MoraaPad/MoraaPad'
import { MoraaSlideFrame } from '../common/content-types/MoraaSlide/MoraaSlide'
import { PdfViewerFrame } from '../common/content-types/PdfViewer/PdfViewer'
import { RichTextFrame } from '../common/content-types/RichText/RichText'
import { VideoEmbedFrame } from '../common/content-types/VideoEmbed/VideoEmbed'
import { FramePreview } from '../common/FramePreview'

import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { EventContext } from '@/contexts/EventContext'
import { RoomProvider } from '@/contexts/RoomProvider'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn, getOjectPublicUrl } from '@/utils/utils'

interface FrameProps {
  frame: IFrame
}

export function Frame({ frame }: FrameProps) {
  const { preview } = useContext(EventContext) as EventContextType

  const { permissions } = useEventPermissions()

  const participantView = !permissions.canUpdateFrame

  if (preview || participantView) {
    return <FramePreview frame={frame} />
  }

  if (!frame) return null

  const renderersByFrameType: Record<FrameType, React.ReactNode> = {
    [FrameType.VIDEO]: <VideoEmbedEditor frame={frame as any} />,
    [FrameType.POLL]: <PollEditor frame={frame as any} />,
    [FrameType.GOOGLE_SLIDES]: <GoogleSlidesFrame frame={frame as any} />,
    [FrameType.PDF_VIEWER]: <PdfViewerFrame frame={frame as any} />,
    [FrameType.REFLECTION]: <ReflectionEditor frame={frame} />,
    [FrameType.VIDEO_EMBED]: <VideoEmbedFrame frame={frame as any} />,
    [FrameType.IMAGE_VIEWER]: (
      <ImageViewer src={getOjectPublicUrl(frame.content?.path as string)} />
    ),
    [FrameType.RICH_TEXT]: <RichTextFrame frame={frame} />,
    [FrameType.MIRO_EMBED]: <MiroEmbedEditor frame={frame as any} />,
    [FrameType.MORAA_BOARD]: (
      <RoomProvider frameId={frame.id}>
        <MoraaBoardEditor />
      </RoomProvider>
    ),
    [FrameType.MORAA_SLIDE]: <MoraaSlideFrame frame={frame as any} />,
    [FrameType.BREAKOUT]: <BreakoutFrame frame={frame as any} isEditable />,
    [FrameType.POWERPOINT]: <PowerpointImporter frame={frame as any} />,
    [FrameType.Q_A]: null,
    [FrameType.MORAA_PAD]: <MoraaPadFrame frame={frame} />,
  }

  const renderer = renderersByFrameType[frame.type as FrameType]

  return (
    <div
      key={frame.id}
      data-frame-id={frame.id}
      className={cn(
        'group w-full h-full p-2',
        'relative flex flex-col gap-2 rounded-md overflow-auto transition-all'
      )}>
      <FrameTitleDescriptionPanel key={frame.id} />
      {renderer}
    </div>
  )
}
