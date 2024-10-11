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
import { EventContext } from '@/contexts/EventContext'
import { RoomProvider } from '@/contexts/RoomProvider'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
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

  const renderersByFrameType: Record<FrameType, React.ReactNode> = {
    [FrameType.VIDEO]: <VideoEmbedEditor frame={frame as any} />,
    [FrameType.GOOGLE_SLIDES_IMPORT]: (
      <GoogleSlidesImportEditor frame={frame} />
    ),
    [FrameType.COVER]: <CoverEditor />,
    [FrameType.POLL]: <PollEditor frame={frame as any} />,
    [FrameType.GOOGLE_SLIDES]: <GoogleSlidesEditor frame={frame as any} />,
    [FrameType.PDF_VIEWER]: <PDFUploader frame={frame as any} />,
    [FrameType.REFLECTION]: <ReflectionEditor frame={frame} />,
    [FrameType.VIDEO_EMBED]: <VideoEmbedEditor frame={frame as any} />,
    [FrameType.TEXT_IMAGE]: <TextImageEditor />,
    [FrameType.IMAGE_VIEWER]: (
      <ImageViewer src={getOjectPublicUrl(frame.content?.path as string)} />
    ),
    [FrameType.RICH_TEXT]: (
      <RichTextEditor
        hideSideBar
        editorId={frame.id}
        classNames={{
          wrapper: 'overflow-hidden',
          container: 'flex flex-col overflow-hidden',
        }}
      />
    ),
    [FrameType.MIRO_EMBED]: <MiroEmbedEditor frame={frame as any} />,
    [FrameType.MORAA_BOARD]: (
      <RoomProvider>
        <MoraaBoardEditor />
      </RoomProvider>
    ),
    [FrameType.MORAA_SLIDE]: <MoraaSlide frame={frame as any} />,
    [FrameType.BREAKOUT]: <BreakoutFrame frame={frame as any} isEditable />,
    [FrameType.POWERPOINT]: <PowerpointImporter frame={frame as any} />,
    [FrameType.Q_A]: null,
    [FrameType.MORAA_PAD]: null,
  }

  const renderer = renderersByFrameType[frame.type as FrameType]

  return (
    <div
      key={frame.id}
      data-frame-id={frame.id}
      className={cn(
        'group w-full h-full p-2',
        'relative flex flex-col gap-2 rounded-md overflow-auto transition-all'
      )}>
      <FrameTitleDescriptionPanel key={frame.id} />
      {renderer}
    </div>
  )
}
