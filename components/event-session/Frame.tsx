// TODO: fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from 'react'

import dynamic from 'next/dynamic'

import { GoogleSlides } from './content-types/GoogleSlides'
import { Poll, Vote } from './content-types/Poll'
import { Reflection } from './content-types/Reflection'
import { RichText } from './content-types/RichText'
import { VideoEmbed } from './content-types/VideoEmbed'
import { Breakout, BreakoutFrame } from '../common/content-types/Breakout'
import { CanvasPreview } from '../common/content-types/Canvas/Preview'
import { MoraaBoard } from '../common/content-types/MoraaBoard'
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
import { getOjectPublicUrl } from '@/utils/utils'

const PDFViewer = dynamic(
  () => import('./content-types/PDFViewer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
  }
)

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
        isOwner={isHost}
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
      <RichText key={currentFrame.id} frame={currentFrame} />
    ),
    [ContentType.MIRO_EMBED]: <MiroEmbed frame={currentFrame as any} />,
    [ContentType.MORAA_BOARD]: <MoraaBoard frame={currentFrame as any} />,
    [ContentType.CANVAS]: (
      <CanvasPreview key={currentFrame.id} frame={currentFrame as any} />
    ),
    [ContentType.BREAKOUT]: <Breakout frame={currentFrame as BreakoutFrame} />,
  }

  const renderer = renderersByContentType[currentFrame.type]

  return (
    <>
      <FrameTitleDescriptionPreview frame={currentFrame as any} />
      {renderer}
    </>
  )
}
