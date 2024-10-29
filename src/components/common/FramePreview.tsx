// TODO: Fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react'

// eslint-disable-next-line import/no-cycle
import { BreakoutFrame } from './breakout/BreakoutFrame'
import { GoogleSlidesFrame } from './content-types/GoogleSlides/GoogleSlides'
import { MoraaBoard } from './content-types/MoraaBoard'
import { MoraaPadFrame } from './content-types/MoraaPad/MoraaPad'
import { PDFViewer, PDFViewerFrameType } from './content-types/PDFViewer'
import { PollFrame } from './content-types/Poll/Poll'
import { RichTextFrame } from './content-types/RichText/RichText'
import { VideoEmbedFrame } from './content-types/VideoEmbed/VideoEmbed'
import { FrameTitleDescriptionPreview } from './FrameTitleDescriptionPreview'
import {
  MiroEmbedEditor,
  MiroEmbedFrameType,
} from '../event-content/MiroEmbedEditor'
import { ReflectionEditor } from '../event-content/ReflectionEditor'

import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { RoomProvider } from '@/contexts/RoomProvider'
import { type MoraaBoardFrame } from '@/types/frame-picker.type'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn, getOjectPublicUrl } from '@/utils/utils'

interface FrameProps {
  frame: IFrame
  asThumbnail?: boolean
  className?: string
}

export function FramePreview({
  frame,
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

  if (!frame) return null

  const renderersByFrameType: Record<FrameType, React.ReactNode> = {
    [FrameType.VIDEO]: null,
    [FrameType.POLL]: <PollFrame frame={frame} />,
    [FrameType.GOOGLE_SLIDES]: (
      <GoogleSlidesFrame frame={frame as any} asThumbnail={asThumbnail} />
    ),
    [FrameType.PDF_VIEWER]: (
      <PDFViewer
        frame={frame as PDFViewerFrameType}
        asThumbnail={asThumbnail}
      />
    ),
    [FrameType.REFLECTION]: <ReflectionEditor frame={frame} />,
    [FrameType.VIDEO_EMBED]: <VideoEmbedFrame frame={frame} asThumbnail />,
    [FrameType.IMAGE_VIEWER]: (
      <ImageViewer src={getOjectPublicUrl(frame.content?.path as string)} />
    ),
    [FrameType.RICH_TEXT]: (
      <RichTextFrame
        key={frame.config.allowToCollaborate}
        frame={frame}
        asThumbnail={asThumbnail}
        // startContent={<FrameTitleDescription frame={frame as any} />}
      />
    ),
    [FrameType.MIRO_EMBED]: (
      <MiroEmbedEditor
        viewOnly
        frame={frame as MiroEmbedFrameType}
        asThumbnail={asThumbnail}
      />
    ),
    [FrameType.MORAA_BOARD]: (
      <RoomProvider frameId={frame.id}>
        <MoraaBoard frame={frame as MoraaBoardFrame} isInteractive={false} />
      </RoomProvider>
    ),
    [FrameType.MORAA_SLIDE]: null,
    [FrameType.BREAKOUT]: <BreakoutFrame frame={frame as BreakoutFrame} />,
    [FrameType.POWERPOINT]: (
      <div className="w-full h-full flex justify-center items-center bg-white text-black">
        <p className="text-center">
          This frame will be replaced with the Powerpoint slides once the import
          is completed.
        </p>
      </div>
    ),
    [FrameType.Q_A]: null,
    [FrameType.MORAA_PAD]: <MoraaPadFrame frame={frame} />,
  }

  const renderer = renderersByFrameType[frame.type as FrameType]

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
        {renderer}
      </div>
    </div>
  )
}
