/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'

import ResizeObserver from 'rc-resize-observer'

import { BlankFrame } from '../BlankFrame'
// eslint-disable-next-line import/no-cycle
import { BreakoutFrame } from '../content-types/Breakout/Breakout'
import { GoogleSlidesFrame } from '../content-types/GoogleSlides/GoogleSlides'
import { ImageViewerFrame } from '../content-types/ImageViewer/ImageViewer'
import { MCQFrame } from '../content-types/MCQ/MCQ'
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
import { IFrame } from '@/types/frame.type'
import {
  FrameType,
  isFrameHasVideoAspectRatio,
} from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

type FrameContainerProps = {
  frame: IFrame
}

export function StudioFrame({ frame }: FrameContainerProps) {
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
    [FrameType.BREAKOUT]: <BreakoutFrame frame={frame as any} />,
    [FrameType.GOOGLE_SLIDES]: <GoogleSlidesFrame frame={frame as any} />,
    [FrameType.IMAGE_VIEWER]: <ImageViewerFrame key={frame.id} frame={frame} />,
    [FrameType.MIRO_EMBED]: <MiroEmbedFrame frame={frame as any} />,
    [FrameType.MORAA_BOARD]: <MoraaBoardFrame frame={frame} />,
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
    [FrameType.VIDEO_EMBED]: <VideoEmbedFrame frame={frame as any} />,
    [FrameType.MCQ]: <MCQFrame frame={frame as any} />,
  }

  const renderer = renderersByFrameType[frame.type as FrameType] || (
    <BlankFrame frame={frame} isEdit />
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
        className="w-full h-full flex justify-start items-center">
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
