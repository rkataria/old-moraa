import { cn } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'

import { MCQResponses } from './MCQResponses'
import { HorizontalPreview } from '../Poll/HorizontalPreview'

import { FrameTitleDescriptionPreview } from '@/components/common/FrameTitleDescriptionPreview'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { SideImageLayout } from '@/components/common/SideImageLayout'
import { FrameResponseService } from '@/services/frame-response.service'
import { MCQFrame, MCQOption } from '@/types/frame.type'

interface MCQProps {
  frame: MCQFrame
  disableAnimation?: boolean
  renderAsThumbnail?: boolean
}

export function MCQPreview({
  frame,
  disableAnimation,
  renderAsThumbnail = false,
}: MCQProps) {
  const pollResponseQuery = useQuery({
    queryKey: ['frame-response-mcq', frame.id],
    queryFn: () => FrameResponseService.getResponses(frame.id),
    enabled: !!frame.id,
    refetchOnWindowFocus: false,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responses = (pollResponseQuery?.data?.responses as any) || []

  const mcqs = frame.content.options.map((option: MCQOption) => ({
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
            The mcq is yet to start. Answers will appear here once it&apos;
            live.
          </p>
          <HorizontalPreview
            options={mcqs}
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
          <MCQResponses frame={frame} votes={responses} />
        </div>
      </RenderIf>
    </div>
  )
}

export function Preview({ frame }: { frame: MCQFrame }) {
  return (
    <SideImageLayout imageConfig={frame.config.image}>
      <MCQPreview frame={frame} />
    </SideImageLayout>
  )
}
