// TODO: fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from 'react'

import { GoogleSlides } from './content-types/GoogleSlides'
import { PDFViewer } from './content-types/PDFViewer'
import { Poll, Vote } from './content-types/Poll'
import { Reflection } from './content-types/Reflection'
import { VideoEmbed } from './content-types/VideoEmbed'
import { BreakoutFrame } from '../common/breakout/BreakoutFrame'
import { BreakoutFrameLive } from '../common/breakout/BreakoutLive'
import { AiPageEditor } from '../common/content-types/AiPage/AiPageEditor'
import { MoraaBoard } from '../common/content-types/MoraaBoard'
import { MoraaSlidePreview } from '../common/content-types/MoraaSlide/Preview'
import { FrameTitleDescriptionPreview } from '../common/FrameTitleDescriptionPreview'

import { Cover } from '@/components/common/content-types/Cover'
import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { MiroEmbed } from '@/components/common/content-types/MiroEmbed'
import { ContentLoading } from '@/components/common/ContentLoading'
import { ContentType } from '@/components/common/ContentTypePicker'
import { TextImage } from '@/components/event-session/content-types/TextImage'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useAuth } from '@/hooks/useAuth'
import { EventSessionContextType } from '@/types/event-session.type'
import { type IReflectionFrame } from '@/types/frame.type'
import { checkVoted } from '@/utils/content.util'
import { cn, getOjectPublicUrl } from '@/utils/utils'

export function Frame() {
  const { currentFrame, currentFrameResponses, currentFrameLoading, isHost } =
    useContext(EventSessionContext) as EventSessionContextType
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentFrame) return

    const DEFAULT_FRAME_BG_COLOR = 'rgb(17 24 39)'

    document.documentElement.style.setProperty(
      '--frame-bg-color',
      currentFrame?.config.backgroundColor || DEFAULT_FRAME_BG_COLOR
    )
  }, [currentFrame])

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
    [ContentType.REFLECTION]: (
      <Reflection
        key={currentFrame.id}
        frame={currentFrame as IReflectionFrame}
      />
    ),
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
    [ContentType.RICH_TEXT]: (
      <AiPageEditor frame={currentFrame} editable={false} />
    ),
    [ContentType.MIRO_EMBED]: <MiroEmbed frame={currentFrame as any} />,
    [ContentType.MORAA_BOARD]: <MoraaBoard frame={currentFrame as any} />,
    [ContentType.MORAA_SLIDE]: (
      <MoraaSlidePreview
        key={currentFrame.id}
        frameCanvasSvg={currentFrame.content?.svg as string}
      />
    ),
    [ContentType.BREAKOUT]: (
      <BreakoutFrameLive frame={currentFrame as BreakoutFrame} />
    ),
  }

  const renderer = renderersByContentType[currentFrame.type]

  return (
    <div
      className={cn('relative h-full w-full', {
        'px-[20%] h-screen overflow-y-scroll scrollbar-none':
          currentFrame.type === ContentType.RICH_TEXT,
      })}>
      <FrameTitleDescriptionPreview frame={currentFrame as any} />
      {renderer}
    </div>
  )
}
