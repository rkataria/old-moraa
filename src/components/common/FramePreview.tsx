// TODO: Fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react'

// eslint-disable-next-line import/no-cycle
import { BreakoutFrame } from './breakout/BreakoutFrame'
import { GoogleSlides, GoogleSlidesType } from './content-types/GoogleSlides'
import { MoraaBoard, MoraaBoardFrame } from './content-types/MoraaBoard'
import { MoraaSlidePreview } from './content-types/MoraaSlide/Preview'
import { PDFViewer, PDFViewerFrameType } from './content-types/PDFViewer'
import { PollPreview } from './content-types/Poll/Preview'
import { RichTextPreview } from './content-types/RichText/Preview'
import { TextImageFrameType } from './content-types/TextImage'
import { FrameTitleDescriptionPreview } from './FrameTitleDescriptionPreview'
import {
  MiroEmbedEditor,
  MiroEmbedFrameType,
} from '../event-content/MiroEmbedEditor'
import { ReflectionEditor } from '../event-content/ReflectionEditor'
import {
  VideoEmbedEditor,
  VideoEmbedFrameType,
} from '../event-content/VideoEmbedEditor'
import { TextImage } from '../event-session/content-types/TextImage'

import { Cover, CoverFrameType } from '@/components/common/content-types/Cover'
import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { RoomProvider } from '@/contexts/RoomProvider'
import { IFrame, PollFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn, getOjectPublicUrl } from '@/utils/utils'

interface FrameProps {
  frame: IFrame
  isInteractive?: boolean
  fullWidth?: boolean
  asThumbnail?: boolean
  className?: string
}

export function FramePreview({
  frame,
  isInteractive = true,
  fullWidth,
  asThumbnail = false,
  className = '',
}: FrameProps) {
  useEffect(() => {
    if (!frame) return

    document.documentElement.style.setProperty(
      '--frame-bg-color',
      frame?.config.backgroundColor || 'rgb(17 24 39)'
    )
  }, [frame])

  return (
    <div
      className={cn(
        'relative group w-full h-full bg-white flex flex-col gap-2 p-2',
        {
          'overflow-y-scroll scrollbar-none':
            frame.type === FrameType.RICH_TEXT,
          '!p-0': asThumbnail && frame.type === FrameType.MORAA_SLIDE,
        },
        className
      )}>
      <FrameTitleDescriptionPreview
        frame={frame as any}
        asThumbnail={asThumbnail}
      />

      <div
        data-frame-id={frame.id}
        className={cn('relative w-full h-full rounded-md  transition-all', {
          'overflow-auto': frame.type !== FrameType.RICH_TEXT,
          'overflow-hidden': frame.type === FrameType.RICH_TEXT,
        })}>
        {frame.type === FrameType.MORAA_SLIDE && (
          <MoraaSlidePreview
            key={frame.id}
            frameCanvasSvg={frame.content?.svg as string}
          />
        )}
        {frame.type === FrameType.COVER && (
          <Cover frame={frame as CoverFrameType} />
        )}
        {frame.type === FrameType.TEXT_IMAGE && (
          <TextImage frame={frame as TextImageFrameType} />
        )}
        {frame.type === FrameType.GOOGLE_SLIDES && (
          <GoogleSlides frame={frame as GoogleSlidesType} />
        )}
        {frame.type === FrameType.IMAGE_VIEWER && (
          <ImageViewer src={getOjectPublicUrl(frame.content?.path as string)} />
        )}
        {frame.type === FrameType.PDF_VIEWER && (
          <PDFViewer frame={frame as PDFViewerFrameType} />
        )}
        {frame.type === FrameType.POLL && (
          <PollPreview
            frame={frame as PollFrame}
            disableAnimation={!isInteractive && asThumbnail}
            renderAsThumbnail={asThumbnail}
          />
        )}
        {frame.type === FrameType.GOOGLE_SLIDES_IMPORT && (
          <div className="w-full h-full flex justify-center items-center bg-white text-black">
            <p className="text-center">
              This frame will be replaced with the imported Google Slides once
              the import is completed.
            </p>
          </div>
        )}
        {frame.type === FrameType.REFLECTION && (
          <ReflectionEditor frame={frame} />
        )}

        {frame.type === FrameType.VIDEO_EMBED && (
          <VideoEmbedEditor
            frame={frame as VideoEmbedFrameType}
            showControls={isInteractive}
            fullWidth={fullWidth}
            key={(frame as VideoEmbedFrameType).content.videoUrl}
            asThumbnail={asThumbnail}
          />
        )}
        {frame.type === FrameType.MIRO_EMBED && (
          <MiroEmbedEditor
            viewOnly
            frame={frame as MiroEmbedFrameType}
            asThumbnail={asThumbnail}
          />
        )}
        {frame.type === FrameType.RICH_TEXT && (
          <RichTextPreview
            key={frame.config.allowToCollaborate}
            frame={frame}
            asThumbnail={asThumbnail}
            // startContent={<FrameTitleDescription frame={frame as any} />}
          />
        )}
        {frame.type === FrameType.MORAA_BOARD && (
          <RoomProvider>
            <MoraaBoard
              frame={frame as MoraaBoardFrame}
              isInteractive={false}
            />
          </RoomProvider>
        )}
        {frame.type === FrameType.BREAKOUT && (
          <BreakoutFrame frame={frame as BreakoutFrame} />
        )}
      </div>
    </div>
  )
}
