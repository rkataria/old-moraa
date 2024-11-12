/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-cycle
import { BreakoutFrame } from '../content-types/Breakout/Breakout'
import { GoogleSlidesFrame } from '../content-types/GoogleSlides/GoogleSlides'
import { ImageViewerFrame } from '../content-types/ImageViewer/ImageViewer'
import { MiroEmbedFrame } from '../content-types/MiroEmbed/MiroEmbed'
import { MoraaBoardFrame } from '../content-types/MoraaBoard/MoraaBoard'
import { MoraaPadFrame } from '../content-types/MoraaPad/MoraaPad'
import { MoraaSlideFrame } from '../content-types/MoraaSlide/MoraaSlide'
import { PdfViewerFrame } from '../content-types/PdfViewer/PdfViewer'
import { PollFrame } from '../content-types/Poll/Poll'
import { PowerPointFrame } from '../content-types/PowerPoint/PowerPoint'
import { ReflectionFrame } from '../content-types/Reflection/Reflection'
import { RichTextFrame } from '../content-types/RichText/RichText'
import { VideoEmbedFrame } from '../content-types/VideoEmbed/VideoEmbed'

import { frameTypesWithTitle } from '@/components/event-content/FrameTitleDescriptionPanel'
import { RoomProvider } from '@/contexts/RoomProvider'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

type PreviewFrameProps = {
  frame: IFrame
}

export function PreviewFrame({ frame }: PreviewFrameProps) {
  const renderersByFrameType: Record<FrameType, React.ReactNode> = {
    [FrameType.BREAKOUT]: <BreakoutFrame frame={frame as any} />,
    [FrameType.GOOGLE_SLIDES]: <GoogleSlidesFrame frame={frame as any} />,
    [FrameType.IMAGE_VIEWER]: <ImageViewerFrame key={frame.id} frame={frame} />,
    [FrameType.MIRO_EMBED]: <MiroEmbedFrame frame={frame as any} />,
    [FrameType.MORAA_BOARD]: (
      <RoomProvider frameId={frame.id}>
        <MoraaBoardFrame frame={frame} />
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
    [FrameType.POWERPOINT]: <PowerPointFrame frame={frame} />,
    [FrameType.Q_A]: null,
    [FrameType.REFLECTION]: <ReflectionFrame key={frame.id} frame={frame} />,
    [FrameType.RICH_TEXT]: <RichTextFrame frame={frame} />,
    [FrameType.VIDEO]: <VideoEmbedFrame frame={frame as any} />,
    [FrameType.VIDEO_EMBED]: <VideoEmbedFrame frame={frame as any} />,
  }

  const renderer = renderersByFrameType[frame.type as FrameType]

  const frameHasTitle = frameTypesWithTitle.includes(frame.type)

  return (
    <div className="w-full h-full flex justify-start items-center">
      <div
        className={cn('h-full w-auto aspect-video', {
          'flex flex-col gap-4': frameHasTitle,
        })}>
        {renderer}
      </div>
    </div>
  )
}
