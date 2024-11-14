import { Image } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'

import { PollResponse } from './PollResponse'
import { FrameTitleDescriptionPreview } from '../../FrameTitleDescriptionPreview'
import { RenderIf } from '../../RenderIf/RenderIf'

import { FrameResponseService } from '@/services/frame-response.service'
import { PollFrame } from '@/types/frame.type'

interface PollProps {
  frame: PollFrame
  disableAnimation?: boolean
  // renderAsThumbnail?: boolean
}

export function Preview({
  frame,
  disableAnimation,
  // renderAsThumbnail = false,
}: PollProps) {
  const pollResponseQuery = useQuery({
    queryKey: ['frame-response-poll', frame.id],
    queryFn: () => FrameResponseService.getResponses(frame.id),
    enabled: !!frame.id,
    refetchOnWindowFocus: false,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responses = (pollResponseQuery?.data?.responses as any) || []

  return (
    <div className="w-full h-full flex flex-col">
      <FrameTitleDescriptionPreview frame={frame} />
      <RenderIf isTrue={!responses.length}>
        <div className="relative w-full h-auto grid gap-20 place-items-center m-auto max-w-fit">
          <Image src="/images/poll/preview.svg" width={518} />
          <div className="text-center grid gap-4">
            <p className="text-2xl font-medium w-full">Poll yet to start</p>
            <p className="text-sm text-gray-600">
              No votes found. Once live, people’s votes will appear here.
            </p>
          </div>
        </div>
      </RenderIf>
      <RenderIf isTrue={!!responses}>
        {/* {verticalPreview ? (
          <VerticalPreview
            options={polls}
            disableAnimation={disableAnimation}
            className="h-[70%] mt-8"
          />
        ) : (
          <HorizontalPreview
            options={polls}
            className={cn('w-[100%] mt-8', {
              'w-full ': renderAsThumbnail,
              'xl:w-[50%]': !renderAsThumbnail,
            })}
            disableAnimation={disableAnimation}
          />
        )} */}
        <RenderIf isTrue={responses.length > 0}>
          <div className="max-w-[50%]">
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
      </RenderIf>
    </div>
  )
}
