// TODO: fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react'

import { User } from '@supabase/supabase-js'

import { PDFViewer } from './content-types/PDFViewer'
import { Reflection } from './content-types/Reflection'
import { RichTextLive } from './content-types/RichTextLive'
import { VideoEmbed } from './content-types/VideoEmbed'
import { BreakoutFrame } from '../common/breakout/BreakoutFrame'
import { BreakoutFrameLive } from '../common/breakout/BreakoutLive'
import { MoraaBoard } from '../common/content-types/MoraaBoard'
import { MoraaPad } from '../common/content-types/MoraaPad/MoraaPad'
import { MoraaSlidePreview } from '../common/content-types/MoraaSlide/Preview'
import { FrameTitleDescriptionPreview } from '../common/FrameTitleDescriptionPreview'

import { GoogleSlides } from '@/components/common/content-types/GoogleSlides/GoogleSlides'
import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { MiroEmbed } from '@/components/common/content-types/MiroEmbed'
import { ContentLoading } from '@/components/common/ContentLoading'
import { Poll } from '@/components/event-session/content-types/Poll/Poll'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { RoomProvider } from '@/contexts/RoomProvider'
import { useAuth } from '@/hooks/useAuth'
import { EventSessionContextType } from '@/types/event-session.type'
import { GoogleSlidesType } from '@/types/frame-picker.type'
import { IPollResponse, IReflectionResponse, Vote } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { getOjectPublicUrl } from '@/utils/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkVoted = (
  votes: IReflectionResponse[] | IPollResponse[] | null | undefined,
  user: User
) => {
  if (!Array.isArray(votes)) return false
  if (!user) return false

  return votes.some((vote) => vote.participant.enrollment.user_id === user.id)
}

export function Frame() {
  const { currentFrame, currentFrameResponses, currentFrameLoading, isHost } =
    useContext(EventSessionContext) as EventSessionContextType
  const { currentUser } = useAuth()

  if (!currentFrame) return null

  if (currentFrameLoading) return <ContentLoading />

  const renderersByFrameType: Record<FrameType, React.ReactNode> = {
    [FrameType.VIDEO]: null,
    [FrameType.POLL]: (
      <Poll
        key={currentFrame.id}
        frame={currentFrame as any}
        votes={(currentFrameResponses as Vote[]) || undefined}
        canVote={!isHost}
        voted={checkVoted(currentFrameResponses, currentUser)}
      />
    ),
    [FrameType.GOOGLE_SLIDES]: (
      <GoogleSlides
        key={currentFrame.id}
        frame={currentFrame as GoogleSlidesType}
        isLiveSession
      />
    ),
    [FrameType.PDF_VIEWER]: (
      <PDFViewer key={currentFrame.id} frame={currentFrame as any} />
    ),
    [FrameType.REFLECTION]: <Reflection />,
    [FrameType.VIDEO_EMBED]: (
      <VideoEmbed key={currentFrame.id} frame={currentFrame as any} />
    ),
    [FrameType.IMAGE_VIEWER]: (
      <ImageViewer
        key={currentFrame.id}
        src={getOjectPublicUrl(currentFrame.content?.path as string)}
      />
    ),
    [FrameType.RICH_TEXT]: <RichTextLive frame={currentFrame} />,
    [FrameType.MIRO_EMBED]: <MiroEmbed frame={currentFrame as any} />,
    [FrameType.MORAA_BOARD]: (
      <RoomProvider>
        <MoraaBoard frame={currentFrame as any} />
      </RoomProvider>
    ),
    [FrameType.MORAA_SLIDE]: (
      <MoraaSlidePreview
        key={currentFrame.id}
        frameCanvasSvg={currentFrame.content?.svg as string}
      />
    ),
    [FrameType.BREAKOUT]: (
      <BreakoutFrameLive frame={currentFrame as BreakoutFrame} />
    ),
    [FrameType.POWERPOINT]: null,
    [FrameType.Q_A]: null,
    [FrameType.MORAA_PAD]: <MoraaPad frame={currentFrame} />,
  }

  const renderer = renderersByFrameType[currentFrame.type as FrameType]

  return (
    <div className="relative h-full w-full flex flex-col gap-2">
      <FrameTitleDescriptionPreview frame={currentFrame as any} />
      {renderer}
    </div>
  )
}
