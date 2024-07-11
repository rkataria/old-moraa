// TODO: Fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from 'react'

// eslint-disable-next-line import/no-cycle
import { BreakoutFrame } from './breakout/BreakoutFrame'
import { CanvasPreview } from './content-types/Canvas/Preview'
import { GoogleSlides, GoogleSlidesType } from './content-types/GoogleSlides'
import { MoraaBoard, MoraaBoardFrame } from './content-types/MoraaBoard'
import { PDFViewer, PDFViewerFrameType } from './content-types/PDFViewer'
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
import { RichText } from '../event-session/content-types/RichText'
import { TextImage } from '../event-session/content-types/TextImage'

import { Cover, CoverFrameType } from '@/components/common/content-types/Cover'
import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { Poll, type PollFrame } from '@/components/common/content-types/Poll'
import { ContentType } from '@/components/common/ContentTypePicker'
import { useDimensions } from '@/hooks/useDimensions'
import { IFrame } from '@/types/frame.type'
import { cn, getOjectPublicUrl } from '@/utils/utils'

interface FrameProps {
  frame: IFrame
  readOnly?: boolean
}

export function FramePreview({ frame, readOnly }: FrameProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  const { totalHeight } = useDimensions(previewRef)

  useEffect(() => {
    if (!frame) return

    document.documentElement.style.setProperty(
      '--frame-bg-color',
      frame?.config.backgroundColor || 'rgb(17 24 39)'
    )
  }, [frame])

  console.log('totalHeight', frame.type, totalHeight)

  const thumbnailStyle = () => {
    if (!readOnly) return {}
    if (frame.type === ContentType.RICH_TEXT) {
      const scaleDown = (209 / totalHeight) * 3

      return {
        scale: scaleDown > 1 ? 1 : scaleDown,
        transformOrigin: 'top',
        height: totalHeight,
      }
    }

    return null
  }

  return (
    <div
      ref={previewRef}
      style={{
        backgroundColor: frame.config.backgroundColor,
        ...thumbnailStyle(),
      }}
      className={cn(
        'relative group w-full h-full bg-gray-100 flex flex-col p-4',
        {
          '!p-0': frame.type === ContentType.TEXT_IMAGE && readOnly,
          'px-[20%]': frame.type === ContentType.RICH_TEXT && !readOnly,
          'overflow-y-scroll scrollbar-none':
            frame.type === ContentType.RICH_TEXT,
        }
      )}>
      <FrameTitleDescriptionPreview frame={frame as any} />

      <div
        data-frame-id={frame.id}
        className={cn('relative w-full h-full rounded-md  transition-all', {
          'overflow-auto': frame.type !== ContentType.RICH_TEXT,
        })}>
        {frame.type === ContentType.CANVAS && (
          <CanvasPreview frame={frame as any} />
        )}
        {frame.type === ContentType.COVER && (
          <Cover frame={frame as CoverFrameType} />
        )}
        {frame.type === ContentType.TEXT_IMAGE && (
          <TextImage frame={frame as TextImageFrameType} />
        )}
        {frame.type === ContentType.GOOGLE_SLIDES && (
          <GoogleSlides frame={frame as GoogleSlidesType} />
        )}
        {frame.type === ContentType.IMAGE_VIEWER && (
          <ImageViewer src={getOjectPublicUrl(frame.content?.path as string)} />
        )}
        {frame.type === ContentType.PDF_VIEWER && (
          <PDFViewer
            frame={frame as PDFViewerFrameType}
            blockPageChange={readOnly}
          />
        )}
        {frame.type === ContentType.POLL && (
          <Poll
            readOnly={readOnly}
            frame={frame as PollFrame}
            votes={[]}
            voted={false}
          />
        )}
        {frame.type === ContentType.GOOGLE_SLIDES_IMPORT && (
          <div className="w-full h-full flex justify-center items-center">
            <p>
              This frame will be replaced with the imported Google Slides once
              the import is completed.
            </p>
          </div>
        )}
        {frame.type === ContentType.REFLECTION && (
          <ReflectionEditor frame={frame} />
        )}

        {frame.type === ContentType.VIDEO_EMBED && (
          <VideoEmbedEditor
            readOnly={readOnly}
            frame={frame as VideoEmbedFrameType}
          />
        )}
        {frame.type === ContentType.MIRO_EMBED && (
          <MiroEmbedEditor
            readOnly={readOnly}
            frame={frame as MiroEmbedFrameType}
          />
        )}
        {frame.type === ContentType.RICH_TEXT && <RichText frame={frame} />}
        {frame.type === ContentType.MORAA_BOARD && (
          <MoraaBoard frame={frame as MoraaBoardFrame} />
        )}
        {frame.type === ContentType.BREAKOUT && (
          <BreakoutFrame frame={frame as BreakoutFrame} />
        )}
      </div>
    </div>
  )
}
