import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Skeleton,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import uniqBy from 'lodash.uniqby'

import { ReflectionService } from '@/services/reflection.service'
import { FrameReaction } from '@/types/event-session.type'
import { IFrame } from '@/types/frame.type'
import { cn, getAvatarForName } from '@/utils/utils'

function PreviewCard({
  isAnonymous,
  disabled,
  username,
  reflection,
  reactions,
  className,
}: {
  disabled?: boolean
  isAnonymous?: boolean
  username: string
  reflection: string
  reactions: FrameReaction[]
  className?: string
}) {
  const distinctReactions = uniqBy(
    reactions,
    (reaction: FrameReaction) => reaction.reaction
  )

  const getReactionCount = (emojiId: string) =>
    reactions.filter((reaction: FrameReaction) => reaction.reaction === emojiId)
      .length

  return (
    <Card
      shadow="none"
      className={cn(
        'border border-slate-300 rounded-2xl shadow-lg',
        className
      )}>
      <CardHeader>
        <div className="flex justify-start items-center gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            className="min-w-fit"
            src={getAvatarForName(`${isAnonymous ? 'A' : username}`)}
          />
          <h4 className="text-small font-semibold leading-none text-default-600">
            {isAnonymous ? 'Anonymous' : username}
          </h4>
        </div>
      </CardHeader>
      <CardBody className="pt-0 flex flex-col justify-between">
        <div>
          <p className="text-gray-600">{reflection}</p>
        </div>
        <div>
          {reactions?.length > 0 && <Divider className="my-3" />}
          <div className="flex items-center gap-1 justify-between">
            <div className="flex flex-wrap gap-1">
              {distinctReactions.map((reaction: FrameReaction) => (
                <Chip
                  className={cn('font-bold')}
                  variant="flat"
                  avatar={
                    <em-emoji set="apple" id={reaction.reaction} size={20} />
                  }>
                  <span className="font-bold text-slate-600">
                    {getReactionCount(reaction.reaction)}
                  </span>
                </Chip>
              ))}
              {disabled && (
                <Chip
                  className="font-bold mt-4"
                  variant="flat"
                  avatar={<em-emoji set="apple" id="heart_eyes" size={20} />}>
                  <span className="font-bold text-slate-600">{3}</span>
                </Chip>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FrameResponses({ frameResponses }: { frameResponses: any }) {
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {frameResponses.map((frameResponse: any) => (
        <PreviewCard
          key={frameResponse.id}
          isAnonymous={frameResponse.response?.anonymous}
          username={frameResponse.response.username}
          reflection={frameResponse.response.reflection}
          reactions={frameResponse.reaction}
        />
      ))}
    </>
  )
}

function Responses({
  isLoading,
  frameResponses,
}: {
  isLoading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frameResponses: any
}) {
  if (isLoading) {
    return (
      <Card className="w-[200px] space-y-5 p-4" radius="lg">
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300" />
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </Card>
    )
  }

  if (frameResponses.length === 0) {
    return (
      <div className="w-full h-full grid place-items-center">
        <PreviewCard
          disabled
          username="Learner"
          reflection="User's typed response will be shown here.."
          reactions={[]}
          className="w-fit"
        />
      </div>
    )
  }

  return (
    <div className="w-full mt-10 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      <FrameResponses frameResponses={frameResponses} />
    </div>
  )
}

interface ReflectionEditorProps {
  frame: IFrame
}

export function ReflectionEditor({ frame }: ReflectionEditorProps) {
  const reflectionResponseQuery = useQuery({
    queryKey: ['frame-response-reflection', frame.id],
    queryFn: () => ReflectionService.getResponses(frame.id),
    enabled: !!frame.id,
    refetchOnWindowFocus: false,
  })
  const responses = reflectionResponseQuery?.data?.responses || []

  return (
    <div className="w-full h-full items-center">
      <Responses
        isLoading={reflectionResponseQuery.isLoading}
        frameResponses={responses}
      />
    </div>
  )
}
