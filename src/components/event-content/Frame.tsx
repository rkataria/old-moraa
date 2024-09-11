// TODO: Fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useContext } from 'react'

import { CoverEditor } from './content-types/CoverEditor'
import { MoraaBoardEditor } from './content-types/MoraaBoardEditor'
import { PollEditor } from './content-types/PollEditor'
import { TextImageEditor } from './content-types/TextImageEditor'
import { FrameTitleDescriptionPanel } from './FrameTitleDescriptionPanel'
import { GoogleSlidesImportEditor } from './GoogleSlideImportEditor'
import { GoogleSlidesEditor } from './GoogleSlidesEditor'
import { MiroEmbedEditor } from './MiroEmbedEditor'
import { PDFUploader } from './PDFUploader'
import { PowerpointImporter } from './PowerpointImporter'
import { ReflectionEditor } from './ReflectionEditor'
import { VideoEmbedEditor } from './VideoEmbedEditor'
import { BreakoutFrame } from '../common/breakout/BreakoutFrame'
import { MoraaSlide } from '../common/content-types/MoraaSlide/MoraaSlide'
import { RichTextEditor } from '../common/content-types/RichText/Editor'
import { FramePreview } from '../common/FramePreview'

import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { ContentType } from '@/components/common/ContentTypePicker'
import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { cn, getOjectPublicUrl } from '@/utils/utils'

interface FrameProps {
  frame: IFrame
}

export function Frame({ frame }: FrameProps) {
  const { preview } = useContext(EventContext) as EventContextType

  const { permissions } = useEventPermissions()

  const participantView = !permissions.canUpdateFrame

  if (preview || participantView) {
    return (
      <FramePreview frame={frame} isInteractive={permissions.canUpdateFrame} />
    )
  }

  if (!frame) return null

  const renderersByContentType: Record<ContentType, React.ReactNode> = {
    [ContentType.VIDEO]: <VideoEmbedEditor frame={frame as any} />,
    [ContentType.GOOGLE_SLIDES_IMPORT]: (
      <GoogleSlidesImportEditor frame={frame} />
    ),
    [ContentType.COVER]: <CoverEditor />,
    [ContentType.POLL]: <PollEditor frame={frame as any} />,
    [ContentType.GOOGLE_SLIDES]: <GoogleSlidesEditor frame={frame as any} />,
    [ContentType.PDF_VIEWER]: <PDFUploader frame={frame as any} />,
    [ContentType.REFLECTION]: <ReflectionEditor frame={frame} />,
    [ContentType.VIDEO_EMBED]: <VideoEmbedEditor frame={frame as any} />,
    [ContentType.TEXT_IMAGE]: <TextImageEditor />,
    [ContentType.IMAGE_VIEWER]: (
      <ImageViewer src={getOjectPublicUrl(frame.content?.path as string)} />
    ),
    [ContentType.RICH_TEXT]: (
      <RichTextEditor
        editorId={frame.id}
        classNames={{
          wrapper: 'overflow-hidden',
          container: 'flex flex-col overflow-hidden',
        }}
      />
    ),

    [ContentType.MIRO_EMBED]: <MiroEmbedEditor frame={frame as any} />,
    [ContentType.MORAA_BOARD]: <MoraaBoardEditor frame={frame} />,
    [ContentType.MORAA_SLIDE]: <MoraaSlide frame={frame as any} />,
    [ContentType.BREAKOUT]: <BreakoutFrame frame={frame as any} isEditable />,
    [ContentType.POWERPOINT]: <PowerpointImporter frame={frame as any} />,
  }

  const renderer = renderersByContentType[frame.type]

  return (
    <div
      key={frame.id}
      data-frame-id={frame.id}
      className={cn(
        'group w-full h-full p-4',
        'relative flex flex-col gap-2 rounded-md overflow-auto transition-all'
      )}>
      <FrameTitleDescriptionPanel key={frame.id} />
      {renderer}
    </div>
  )
}
