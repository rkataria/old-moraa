/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'

import ResizeObserver from 'rc-resize-observer'

// eslint-disable-next-line import/no-cycle
import { BreakoutFrame } from '../frame-types/Breakout/Breakout'
import { EmbedLinkFrame } from '../frame-types/EmbedLink/EmbedLink'
import { GoogleSlidesFrame } from '../frame-types/GoogleSlides/GoogleSlides'
import { ImageViewerFrame } from '../frame-types/ImageViewer/ImageViewer'
import { MCQFrame } from '../frame-types/MCQ/MCQ'
import { MiroEmbedFrame } from '../frame-types/MiroEmbed/MiroEmbed'
import { MoraaBoardFrame } from '../frame-types/MoraaBoard/MoraaBoard'
import { MoraaPadFrame } from '../frame-types/MoraaPad/MoraaPad'
import { MoraaSlideFrame } from '../frame-types/MoraaSlide/MoraaSlide'
import { PdfViewerFrame } from '../frame-types/PdfViewer/PdfViewer'
import { PollFrame } from '../frame-types/Poll/Poll'
import { PowerPointFrame } from '../frame-types/PowerPoint/PowerPoint'
import { ReflectionFrame } from '../frame-types/Reflection/Reflection'
import { RichTextFrame } from '../frame-types/RichText/RichText'
import { VideoEmbedFrame } from '../frame-types/VideoEmbed/VideoEmbed'
import { WordCloudFrame } from '../frame-types/WordCloud/WordCloud'

import { BlankFrame } from '@/components/common/BlankFrame'
import { frameTypesWithTitle } from '@/components/event-content/FrameTitleDescriptionPanel'
import { IFrame } from '@/types/frame.type'
import {
  FrameType,
  isFrameHasVideoAspectRatio,
} from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

type FrameContainerProps = {
  frame: IFrame
}

export const framesWithBorder = [
  FrameType.MORAA_SLIDE,
  FrameType.POLL,
  FrameType.MCQ,
  FrameType.VIDEO_EMBED,
  FrameType.POWERPOINT,
  FrameType.GOOGLE_SLIDES,
  FrameType.IMAGE_VIEWER,
]

export function LiveFrame({ frame }: FrameContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerAspectRatio, setContainerAspectRatio] = useState(16 / 9)

  useEffect(() => {
    if (containerRef.current) {
      setContainerAspectRatio(
        containerRef.current.offsetWidth / containerRef.current.offsetHeight
      )
    }
  }, [containerRef])

  const renderersByFrameType: Record<FrameType, React.ReactNode> = {
    [FrameType.BREAKOUT]: <BreakoutFrame frame={frame as any} isLiveSession />,
    [FrameType.GOOGLE_SLIDES]: (
      <GoogleSlidesFrame frame={frame as any} isLiveSession />
    ),
    [FrameType.IMAGE_VIEWER]: (
      <ImageViewerFrame key={frame.id} frame={frame} isLiveSession />
    ),
    [FrameType.MIRO_EMBED]: (
      <MiroEmbedFrame frame={frame as any} isLiveSession />
    ),
    [FrameType.MORAA_BOARD]: <MoraaBoardFrame frame={frame} isLiveSession />,
    [FrameType.MORAA_PAD]: <MoraaPadFrame frame={frame} isLiveSession />,
    [FrameType.MORAA_SLIDE]: (
      <MoraaSlideFrame key={frame.id} frame={frame as any} isLiveSession />
    ),
    [FrameType.PDF_VIEWER]: (
      <PdfViewerFrame key={frame.id} frame={frame as any} isLiveSession />
    ),
    [FrameType.POLL]: <PollFrame frame={frame as any} isLiveSession />,
    [FrameType.POWERPOINT]: <PowerPointFrame frame={frame} isLiveSession />,
    [FrameType.Q_A]: null,
    [FrameType.REFLECTION]: (
      <ReflectionFrame key={frame.id} frame={frame} isLiveSession />
    ),
    [FrameType.RICH_TEXT]: <RichTextFrame frame={frame} isLiveSession />,
    [FrameType.VIDEO_EMBED]: (
      <VideoEmbedFrame frame={frame as any} isLiveSession />
    ),

    [FrameType.MCQ]: <MCQFrame frame={frame as any} isLiveSession />,
    [FrameType.WORD_CLOUD]: (
      <WordCloudFrame frame={frame as any} isLiveSession />
    ),
    [FrameType.EMBED_LINK]: (
      <EmbedLinkFrame frame={frame as any} isLiveSession />
    ),
  }

  const renderer = renderersByFrameType[frame.type as FrameType] || (
    <BlankFrame frame={frame} showEmptyPlaceholder />
  )
  const frameHasTitle = frameTypesWithTitle.includes(frame.type)

  return (
    <ResizeObserver
      onResize={({ width, height }) => {
        if (isFrameHasVideoAspectRatio(frame.type)) {
          setContainerAspectRatio(width / height)
        }
      }}>
      <div
        ref={containerRef}
        className={cn('w-full h-full flex justify-start items-start', {
          'border border-gray-200 rounded-md': framesWithBorder.includes(
            frame.type
          ),
        })}>
        <div
          className={cn({
            'h-full w-auto aspect-video':
              isFrameHasVideoAspectRatio(frame?.type) &&
              containerAspectRatio > 16 / 9,
            'h-auto w-full aspect-video':
              isFrameHasVideoAspectRatio(frame?.type) &&
              containerAspectRatio <= 16 / 9,
            'h-full w-full': !isFrameHasVideoAspectRatio(frame?.type),
            'flex flex-col gap-4': frameHasTitle,
          })}>
          {renderer}
        </div>
      </div>
    </ResizeObserver>
  )
}
