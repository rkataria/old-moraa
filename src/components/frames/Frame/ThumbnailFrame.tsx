/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line import/no-cycle
import { BreakoutFrame } from '../frame-types/Breakout/Breakout'
import { EmbedLinkFrame } from '../frame-types/EmbedLink/EmbedLink'
import { ImageViewerFrame } from '../frame-types/ImageViewer/ImageViewer'
import { MCQFrame } from '../frame-types/MCQ/MCQ'
import { MiroEmbedFrame } from '../frame-types/MiroEmbed/MiroEmbed'
import { MoraaBoardFrame } from '../frame-types/MoraaBoard/MoraaBoard'
import { MoraaSlideFrame } from '../frame-types/MoraaSlide/MoraaSlide'
import { PdfViewerFrame } from '../frame-types/PdfViewer/PdfViewer'
import { PollFrame } from '../frame-types/Poll/Poll'
import { PowerPointFrame } from '../frame-types/PowerPoint/PowerPoint'
import { ReflectionFrame } from '../frame-types/Reflection/Reflection'
import { RichTextFrame } from '../frame-types/RichText/RichText'
import { VideoEmbedFrame } from '../frame-types/VideoEmbed/VideoEmbed'
import { WordCloudFrame } from '../frame-types/WordCloud/WordCloud'

import { BlankFrame } from '@/components/common/BlankFrame'
import { GoogleSlidesFrame } from '@/components/frames/frame-types/GoogleSlides/GoogleSlides'
import { MoraaPadFrame } from '@/components/frames/frame-types/MoraaPad/MoraaPad'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'

type ThumbnailFrameProps = {
  frame: IFrame
}

export function ThumbnailFrame({ frame }: ThumbnailFrameProps) {
  const renderersByFrameType: Record<FrameType, React.ReactNode> = {
    [FrameType.BREAKOUT]: <BreakoutFrame frame={frame as any} asThumbnail />,
    [FrameType.GOOGLE_SLIDES]: (
      <GoogleSlidesFrame frame={frame as any} asThumbnail />
    ),
    [FrameType.IMAGE_VIEWER]: (
      <ImageViewerFrame key={frame.id} frame={frame} asThumbnail />
    ),
    [FrameType.MIRO_EMBED]: <MiroEmbedFrame frame={frame as any} asThumbnail />,
    [FrameType.MORAA_BOARD]: <MoraaBoardFrame frame={frame} asThumbnail />,
    [FrameType.MORAA_PAD]: <MoraaPadFrame frame={frame} asThumbnail />,
    [FrameType.MORAA_SLIDE]: (
      <MoraaSlideFrame key={frame.id} frame={frame as any} asThumbnail />
    ),
    [FrameType.PDF_VIEWER]: (
      <PdfViewerFrame key={frame.id} frame={frame as any} asThumbnail />
    ),
    [FrameType.POLL]: <PollFrame frame={frame as any} asThumbnail />,
    [FrameType.POWERPOINT]: (
      <PowerPointFrame frame={frame as any} asThumbnail />
    ),
    [FrameType.Q_A]: null,
    [FrameType.REFLECTION]: (
      <ReflectionFrame frame={frame} key={frame.id} asThumbnail />
    ),
    [FrameType.RICH_TEXT]: <RichTextFrame frame={frame} asThumbnail />,
    [FrameType.VIDEO_EMBED]: (
      <VideoEmbedFrame frame={frame as any} asThumbnail />
    ),
    [FrameType.MCQ]: <MCQFrame frame={frame as any} asThumbnail />,
    [FrameType.WORD_CLOUD]: <WordCloudFrame frame={frame as any} asThumbnail />,
    [FrameType.EMBED_LINK]: <EmbedLinkFrame frame={frame as any} asThumbnail />,
  }

  const renderer = renderersByFrameType[frame.type as FrameType] || (
    <BlankFrame frame={frame} showEmptyPlaceholder />
  )

  return (
    <div className="w-full h-full flex justify-start items-center">
      <div className="h-full w-auto aspect-video">{renderer}</div>
    </div>
  )
}
