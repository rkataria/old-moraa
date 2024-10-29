/* eslint-disable @typescript-eslint/no-explicit-any */

import { ImageViewerFrame } from '../content-types/ImageViewer/ImageViewer'
import { MiroEmbedFrame } from '../content-types/MiroEmbed/MiroEmbed'
import { MoraaBoardFrame } from '../content-types/MoraaBoard/MoraaBoard'
import { MoraaSlideFrame } from '../content-types/MoraaSlide/MoraaSlide'
import { PdfViewerFrame } from '../content-types/PdfViewer/PdfViewer'
import { PollFrame } from '../content-types/Poll/Poll'
import { PowerPointFrame } from '../content-types/PowerPoint/PowerPoint'
import { ReflectionFrame } from '../content-types/Reflection/Reflection'
import { RichTextFrame } from '../content-types/RichText/RichText'
import { VideoEmbedFrame } from '../content-types/VideoEmbed/VideoEmbed'

import { BreakoutFrame } from '@/components/common/breakout/BreakoutFrame'
import { GoogleSlidesFrame } from '@/components/common/content-types/GoogleSlides/GoogleSlides'
import { MoraaPadFrame } from '@/components/common/content-types/MoraaPad/MoraaPad'
import { RoomProvider } from '@/contexts/RoomProvider'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'

type FrameContainerProps = {
  frame: IFrame
}

export function StudioFrame({ frame }: FrameContainerProps) {
  const renderersByFrameType: Record<FrameType, React.ReactNode> = {
    [FrameType.BREAKOUT]: (
      <BreakoutFrame frame={frame as BreakoutFrame} isEditable />
    ),
    [FrameType.GOOGLE_SLIDES]: <GoogleSlidesFrame frame={frame as any} />,
    [FrameType.IMAGE_VIEWER]: <ImageViewerFrame key={frame.id} frame={frame} />,
    [FrameType.MIRO_EMBED]: <MiroEmbedFrame frame={frame as any} />,
    [FrameType.MORAA_BOARD]: (
      <RoomProvider frameId={frame.id}>
        <MoraaBoardFrame />
      </RoomProvider>
    ),
    [FrameType.MORAA_PAD]: <MoraaPadFrame frame={frame} />,
    [FrameType.MORAA_SLIDE]: (
      <MoraaSlideFrame key={frame.id} frame={frame as any} />
    ),
    [FrameType.PDF_VIEWER]: (
      <PdfViewerFrame key={frame.id} frame={frame as any} />
    ),
    [FrameType.POLL]: <PollFrame frame={frame as any} />,
    [FrameType.POWERPOINT]: <PowerPointFrame frame={frame as any} />,
    [FrameType.Q_A]: null,
    [FrameType.REFLECTION]: <ReflectionFrame frame={frame} key={frame.id} />,
    [FrameType.RICH_TEXT]: <RichTextFrame frame={frame} />,
    [FrameType.VIDEO]: <VideoEmbedFrame frame={frame as any} />,
    [FrameType.VIDEO_EMBED]: <VideoEmbedFrame frame={frame as any} />,
  }

  const renderer = renderersByFrameType[frame.type as FrameType]

  return (
    <div className="w-full h-full flex justify-start items-start">
      <div className="h-full w-auto aspect-video">{renderer}</div>
    </div>
  )
}
