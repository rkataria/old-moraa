import { cn } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'

import { HorizontalPreview } from './HorizontalPreview'
import { PollResponse } from './PollResponse'

import { FrameTitleDescriptionPreview } from '@/components/common/FrameTitleDescriptionPreview'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { SideImageLayout } from '@/components/common/SideImageLayout'
import { FrameResponseService } from '@/services/frame-response.service'
import { PollFrame, PollOption } from '@/types/frame.type'

interface PollProps {
  frame: PollFrame
  disableAnimation?: boolean
  renderAsThumbnail?: boolean
}

export function PollPreview({
  frame,
  disableAnimation,
  renderAsThumbnail = false,
}: PollProps) {
  const pollResponseQuery = useQuery({
    queryKey: ['frame-response-poll', frame.id],
    queryFn: () => FrameResponseService.getResponses(frame.id),
    enabled: !!frame.id,
    refetchOnWindowFocus: false,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responses = (pollResponseQuery?.data?.responses as any) || []

  const polls = frame.content.options.map((option: PollOption) => ({
    ...option,
    percentage: 0,
    votedUsers: [],
  }))

  const withImage = frame.config?.image?.position

  return (
    <div className="w-full h-full flex flex-col">
      <FrameTitleDescriptionPreview frame={frame} />

      <RenderIf isTrue={!responses.length}>
        <>
          <p className="text-gray-600 mb-4 mt-8">
            The poll is yet to start. Votes will appear here once it&apos; live.
          </p>
          <HorizontalPreview
            options={polls}
            className={cn('w-[100%]', {
              'w-full ': renderAsThumbnail,
              'xl:w-[50%]': !renderAsThumbnail && !withImage,
            })}
            disableAnimation={disableAnimation}
          />
        </>
      </RenderIf>
      <RenderIf isTrue={responses.length > 0}>
        <div className={cn({ 'max-w-[50%]': !withImage })}>
          <p className="text-gray-600 mb-4 mt-8">
            Responses captured during live session
          </p>
          <PollResponse
            frame={frame}
            votes={responses}
            disableAnimation={disableAnimation}
          />
        </div>
      </RenderIf>
    </div>
  )
}

export function Preview({ frame }: { frame: PollFrame }) {
  return (
    <SideImageLayout imageConfig={frame.config.image}>
      <PollPreview frame={frame} />
    </SideImageLayout>
  )
}
