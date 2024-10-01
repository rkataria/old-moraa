// TODO: fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react'

import { GoogleSlides } from './content-types/GoogleSlides'
import { PDFViewer } from './content-types/PDFViewer'
import { Reflection } from './content-types/Reflection'
import { RichTextLive } from './content-types/RichTextLive'
import { VideoEmbed } from './content-types/VideoEmbed'
import { BreakoutFrame } from '../common/breakout/BreakoutFrame'
import { BreakoutFrameLive } from '../common/breakout/BreakoutLive'
import { MoraaBoard } from '../common/content-types/MoraaBoard'
import { MoraaSlidePreview } from '../common/content-types/MoraaSlide/Preview'
import { FrameTitleDescriptionPreview } from '../common/FrameTitleDescriptionPreview'

import { Cover } from '@/components/common/content-types/Cover'
import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { MiroEmbed } from '@/components/common/content-types/MiroEmbed'
import { ContentLoading } from '@/components/common/ContentLoading'
import { ContentType } from '@/components/common/ContentTypePicker'
import { Poll } from '@/components/event-session/content-types/Poll/Poll'
import { TextImage } from '@/components/event-session/content-types/TextImage'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { RoomProvider } from '@/contexts/RoomProvider'
import { useAuth } from '@/hooks/useAuth'
import { EventSessionContextType } from '@/types/event-session.type'
import { Vote } from '@/types/frame.type'
import { checkVoted } from '@/utils/content.util'
import { getOjectPublicUrl } from '@/utils/utils'

export function Frame() {
  const { currentFrame, currentFrameResponses, currentFrameLoading, isHost } =
    useContext(EventSessionContext) as EventSessionContextType
  const { currentUser } = useAuth()

  if (!currentFrame) return null

  if (currentFrameLoading) return <ContentLoading />

  const renderersByContentType: Record<ContentType, React.ReactNode> = {
    [ContentType.VIDEO]: null,
    [ContentType.GOOGLE_SLIDES_IMPORT]: null,
    [ContentType.COVER]: (
      <Cover key={currentFrame.id} frame={currentFrame as any} />
    ),
    [ContentType.POLL]: (
      <Poll
        key={currentFrame.id}
        frame={currentFrame as any}
        votes={(currentFrameResponses as Vote[]) || undefined}
        canVote={!isHost}
        voted={checkVoted(currentFrameResponses, currentUser)}
      />
    ),
    [ContentType.GOOGLE_SLIDES]: (
      <GoogleSlides key={currentFrame.id} frame={currentFrame as any} />
    ),
    [ContentType.PDF_VIEWER]: (
      <PDFViewer key={currentFrame.id} frame={currentFrame as any} />
    ),
    [ContentType.REFLECTION]: <Reflection key={currentFrame.id} />,
    [ContentType.VIDEO_EMBED]: (
      <VideoEmbed key={currentFrame.id} frame={currentFrame as any} />
    ),
    [ContentType.TEXT_IMAGE]: (
      <TextImage key={currentFrame.id} frame={currentFrame} />
    ),
    [ContentType.IMAGE_VIEWER]: (
      <ImageViewer
        key={currentFrame.id}
        src={getOjectPublicUrl(currentFrame.content?.path as string)}
      />
    ),
    [ContentType.RICH_TEXT]: <RichTextLive frame={currentFrame} />,
    [ContentType.MIRO_EMBED]: <MiroEmbed frame={currentFrame as any} />,
    [ContentType.MORAA_BOARD]: (
      <RoomProvider>
        <MoraaBoard frame={currentFrame as any} />
      </RoomProvider>
    ),
    [ContentType.MORAA_SLIDE]: (
      <MoraaSlidePreview
        key={currentFrame.id}
        frameCanvasSvg={currentFrame.content?.svg as string}
      />
    ),
    [ContentType.BREAKOUT]: (
      <BreakoutFrameLive frame={currentFrame as BreakoutFrame} />
    ),
    [ContentType.POWERPOINT]: null,
  }

  const renderer = renderersByContentType[currentFrame.type]

  return (
    <div className="relative h-full w-full flex flex-col gap-2">
      <FrameTitleDescriptionPreview frame={currentFrame as any} />
      {renderer}
    </div>
  )
}
