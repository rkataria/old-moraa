// TODO: Fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useContext } from 'react'

import dynamic from 'next/dynamic'

import { CoverEditor } from './content-types/CoverEditor'
import { MoraaBoardEditor } from './content-types/MoraaBoardEditor'
import { RichTextEditor } from './content-types/RichTextEditor'
import { TextImageEditor } from './content-types/TextImageEditor'
import { FrameTitleDescriptionPanel } from './FrameTitleDescriptionPanel'
import { GoogleSlidesImportEditor } from './GoogleSlideImportEditor'
import { GoogleSlidesEditor } from './GoogleSlidesEditor'
import { MiroEmbedEditor } from './MiroEmbedEditor'
import { PollEditor } from './PollEditor'
import { ReflectionEditor } from './ReflectionEditor'
import { VideoEmbedEditor } from './VideoEmbedEditor'
import { Canvas } from '../common/content-types/Canvas'
import { FramePreview } from '../common/FramePreview'

import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { ContentType } from '@/components/common/ContentTypePicker'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { cn, getOjectPublicUrl } from '@/utils/utils'

const PDFUploader = dynamic(
  () => import('./PDFUploader').then((mod) => mod.PDFUploader),
  {
    ssr: false,
  }
)

interface FrameProps {
  frame: IFrame
}

export function Frame({ frame }: FrameProps) {
  const { preview, currentFrame, isOwner } = useContext(
    EventContext
  ) as EventContextType

  if (preview || !isOwner) {
    return <FramePreview frame={frame} />
  }

  if (!currentFrame) return null

  return (
    <div
      className={cn('group w-full max-w-5xl m-auto h-full p-4', {
        'pointer-events-none': !isOwner,
      })}>
      <div
        data-frame-id={frame.id}
        className="relative flex flex-col w-full h-full rounded-md overflow-auto transition-all">
        <FrameTitleDescriptionPanel key={frame.id} />
        {frame.type === ContentType.CANVAS && <Canvas frame={frame as any} />}
        {frame.type === ContentType.POLL && (
          <PollEditor frame={frame} openSettings={false} />
        )}
        {frame.type === ContentType.COVER && <CoverEditor />}
        {frame.type === ContentType.GOOGLE_SLIDES && (
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          <GoogleSlidesEditor frame={frame as any} />
        )}
        {frame.type === ContentType.GOOGLE_SLIDES_IMPORT && (
          <GoogleSlidesImportEditor frame={frame} />
        )}
        {frame.type === ContentType.REFLECTION && (
          <ReflectionEditor frame={frame} />
        )}
        {frame.type === ContentType.PDF_VIEWER && (
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          <PDFUploader frame={frame as any} />
        )}
        {frame.type === ContentType.VIDEO_EMBED && (
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          <VideoEmbedEditor frame={frame as any} />
        )}
        {frame.type === ContentType.IMAGE_VIEWER && (
          <ImageViewer src={getOjectPublicUrl(frame.content?.path as string)} />
        )}
        {frame.type === ContentType.TEXT_IMAGE && <TextImageEditor />}
        {frame.type === ContentType.MIRO_EMBED && (
          <MiroEmbedEditor frame={frame as any} />
        )}
        {frame.type === ContentType.RICH_TEXT && <RichTextEditor />}
        {frame.type === ContentType.MORAA_BOARD && (
          <MoraaBoardEditor frame={frame} />
        )}
      </div>
    </div>
  )
}
