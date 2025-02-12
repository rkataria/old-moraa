/* eslint-disable @typescript-eslint/no-explicit-any */

import { BlankFrame } from '../BlankFrame'
// eslint-disable-next-line import/no-cycle
import { BreakoutFrame } from '../content-types/Breakout/Breakout'
import { EmbedLinkFrame } from '../content-types/EmbedLink/EmbedLink'
import { ImageViewerFrame } from '../content-types/ImageViewer/ImageViewer'
import { MCQFrame } from '../content-types/MCQ/MCQ'
import { MiroEmbedFrame } from '../content-types/MiroEmbed/MiroEmbed'
import { MoraaBoardFrame } from '../content-types/MoraaBoard/MoraaBoard'
import { MoraaSlideFrame } from '../content-types/MoraaSlide/MoraaSlide'
import { PdfViewerFrame } from '../content-types/PdfViewer/PdfViewer'
import { PollFrame } from '../content-types/Poll/Poll'
import { PowerPointFrame } from '../content-types/PowerPoint/PowerPoint'
import { ReflectionFrame } from '../content-types/Reflection/Reflection'
import { RichTextFrame } from '../content-types/RichText/RichText'
import { VideoEmbedFrame } from '../content-types/VideoEmbed/VideoEmbed'
import { WordCloudFrame } from '../content-types/WordCloud/WordCloud'

import { GoogleSlidesFrame } from '@/components/common/content-types/GoogleSlides/GoogleSlides'
import { MoraaPadFrame } from '@/components/common/content-types/MoraaPad/MoraaPad'
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
    <BlankFrame frame={frame} isThumbnail />
  )

  return (
    <div className="w-full h-full flex justify-start items-center">
      <div className="h-full w-auto aspect-video">{renderer}</div>
    </div>
  )
}
