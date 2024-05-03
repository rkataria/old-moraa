'use client'

import React, { useContext, useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useThrottle } from '@uidotdev/usehooks'
import uniqBy from 'lodash.uniqby'
import TextareaAutosize from 'react-textarea-autosize'

import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Skeleton,
} from '@nextui-org/react'

import { TITLE_CHARACTER_LIMIT } from '@/constants/common'
import { EventContext } from '@/contexts/EventContext'
import { ReflectionService } from '@/services/reflection.service'
import { EventContextType } from '@/types/event-context.type'
import { SlideReaction } from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'
import { cn, getAvatarForName } from '@/utils/utils'

function PreviewCard({
  isAnonymous,
  disabled,
  username,
  reflection,
  reactions,
}: {
  disabled?: boolean
  isAnonymous?: boolean
  username: string
  reflection: string
  reactions: SlideReaction[]
}) {
  const distinctReactions = uniqBy(
    reactions,
    (reaction: SlideReaction) => reaction.reaction
  )

  const getReactionCount = (emojiId: string) =>
    reactions.filter((reaction: SlideReaction) => reaction.reaction === emojiId)
      .length

  return (
    <Card
      shadow="none"
      className={cn('border border-slate-300 rounded-2xl ', {
        'opacity-75 bg-[#F4F2F4]': disabled,
      })}>
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
              {distinctReactions.map((reaction: SlideReaction) => (
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

function DummyResponses() {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <PreviewCard
            disabled
            username={`Learner ${index}`}
            reflection="Ignite insights through thoughtful reflection. Shareperspectives, spark growth."
            reactions={[]}
          />
        ))}
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SlideResponses({ slideResponses }: { slideResponses: any }) {
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {slideResponses.map((slideResponse: any) => (
        <PreviewCard
          key={slideResponse.id}
          isAnonymous={slideResponse.response?.anonymous}
          username={slideResponse.response.username}
          reflection={slideResponse.response.reflection}
          reactions={slideResponse.reaction}
        />
      ))}
    </>
  )
}

function Responses({
  isLoading,
  slideResponses,
}: {
  isLoading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slideResponses: any
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
  if (slideResponses.length === 0) {
    return <DummyResponses />
  }

  return <SlideResponses slideResponses={slideResponses} />
}

interface ReflectionEditorProps {
  slide: ISlide
  readOnly?: boolean
}

export function ReflectionEditor({
  slide,
  readOnly = false,
}: ReflectionEditorProps) {
  const [title, setTitle] = useState(slide.content?.title)
  const throttledTitle = useThrottle(title, 500)
  const { preview, updateSlide } = useContext(EventContext) as EventContextType

  const reflectionResponseQuery = useQuery({
    queryKey: ['slide-response-reflection', slide.id],
    queryFn: () => ReflectionService.getResponses(slide.id),
    enabled: !!slide.id,
    refetchOnWindowFocus: false,
  })
  const responses = reflectionResponseQuery?.data?.responses || []

  const disabled = preview || readOnly

  useEffect(() => {
    if (disabled) return
    updateSlide({
      slidePayload: {
        content: {
          ...slide.content,
          title: throttledTitle,
        },
      },
      slideId: slide.id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttledTitle])

  const updateTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return
    setTitle(e.target.value)
  }

  return (
    <div className="w-full h-full flex flex-col items-center px-8">
      <TextareaAutosize
        placeholder="Title"
        disabled={disabled}
        defaultValue={slide.content?.title}
        maxLength={TITLE_CHARACTER_LIMIT}
        onChange={updateTitle}
        className="w-full p-2 text-justify border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-4xl font-bold text-gray-800 resize-none"
      />
      <div className="w-full mt-10 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        <Responses
          isLoading={reflectionResponseQuery.isLoading}
          slideResponses={responses}
        />
      </div>
    </div>
  )
}
