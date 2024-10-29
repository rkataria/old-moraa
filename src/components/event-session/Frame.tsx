// TODO: fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react'

import { User } from '@supabase/supabase-js'

import { PDFViewer } from './content-types/PDFViewer'
import { Reflection } from './content-types/Reflection'
import { RichTextLive } from './content-types/RichTextLive'
import { VideoEmbed } from './content-types/VideoEmbed'
import { BreakoutFrame } from '../common/breakout/BreakoutFrame'
import { BreakoutFrameLive } from '../common/breakout/BreakoutFrameLive'
import { GoogleSlidesFrame } from '../common/content-types/GoogleSlides/GoogleSlides'
import { MoraaBoardFrame } from '../common/content-types/MoraaBoard/MoraaBoard'
import { MoraaPadFrame } from '../common/content-types/MoraaPad/MoraaPad'
import { FrameTitleDescriptionPreview } from '../common/FrameTitleDescriptionPreview'

import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { MiroEmbed } from '@/components/common/content-types/MiroEmbed'
import { ContentLoading } from '@/components/common/ContentLoading'
import { Poll } from '@/components/event-session/content-types/Poll/Poll'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { RoomProvider } from '@/contexts/RoomProvider'
import { useAuth } from '@/hooks/useAuth'
import { EventSessionContextType } from '@/types/event-session.type'
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
      <GoogleSlidesFrame
        key={currentFrame.id}
        frame={currentFrame as any}
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
      <RoomProvider frameId={currentFrame.id}>
        <MoraaBoardFrame frame={currentFrame as any} />
      </RoomProvider>
    ),
    [FrameType.MORAA_SLIDE]: null,
    [FrameType.BREAKOUT]: (
      <BreakoutFrameLive frame={currentFrame as BreakoutFrame} />
    ),
    [FrameType.POWERPOINT]: null,
    [FrameType.Q_A]: null,
    [FrameType.MORAA_PAD]: <MoraaPadFrame frame={currentFrame} />,
  }

  const renderer = renderersByFrameType[currentFrame.type as FrameType]

  return (
    <div className="relative h-full w-full flex flex-col gap-2">
      <FrameTitleDescriptionPreview frame={currentFrame as any} />
      {renderer}
    </div>
  )
}
