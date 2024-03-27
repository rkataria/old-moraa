'use client'

import React, { useContext, useEffect, useState } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { useDebounce } from '@uidotdev/usehooks'
import { AnimatePresence, motion } from 'framer-motion'
import uniqBy from 'lodash.uniqby'
import { MdOutlineAddReaction } from 'react-icons/md'

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Textarea,
  User,
} from '@nextui-org/react'

import { EmojiPicker } from '@/components/common/EmojiPicker'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useProfile } from '@/hooks/useProfile'
import {
  EventSessionContextType,
  SlideReaction,
} from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'
import { cn } from '@/utils/utils'

interface ReflectionProps {
  slide: ISlide & {
    content: {
      backgroundColor: string
      textColor: string
      title: string
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responses?: any
  responded?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  isHost: boolean
  addReflection?: (slide: ISlide, reflection: string, username: string) => void
  updateReflection?: (id: string, reflection: string, username: string) => void
}

export function ReflectionCard({
  username,
  reflection,
  isOwner,
  responseId,
  enableEditReflection,
}: {
  username: string
  reflection: string
  isOwner: boolean
  responseId: string
  enableEditReflection?: () => void
}) {
  const { participant, emoteOnReflection, slideReactions } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const reactions = slideReactions.filter(
    (reaction) => reaction.slide_response_id === responseId
  )
  const distinctReactions = uniqBy(
    reactions,
    (reaction: SlideReaction) => reaction.reaction
  )

  const getReactionCount = (emojiId: string) =>
    reactions.filter((reaction: SlideReaction) => reaction.reaction === emojiId)
      .length

  const participantEmotedOnReaction = (emojiId: string) => {
    if (!participant) return false

    return reactions.some(
      (reaction: SlideReaction) =>
        reaction.reaction === emojiId &&
        reaction.participant_id === participant.id
    )
  }

  const handleEmojiSelect = (selectedEmojiId: string) => {
    const participantEmote = reactions.find(
      (reaction: SlideReaction) =>
        reaction.participant_id === participant.id &&
        reaction.reaction === selectedEmojiId
    )

    emoteOnReflection?.({
      participantId: participant.id,
      reaction: selectedEmojiId,
      slideResponseId: responseId,
      reactionId: participantEmote?.id,
    })
  }

  return (
    <Card className="shadow-lg border hover:shadow-xl duration-100 rounded-2xl">
      <CardHeader>
        <div className="flex justify-start items-center gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            className="min-w-fit"
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(`${username}`)}`}
          />
          <h4 className="text-small font-semibold leading-none text-default-600">
            {username}
            {isOwner && '(you)'}
          </h4>
        </div>
      </CardHeader>
      <CardBody className="pt-0 flex flex-col justify-between">
        <div>
          <p className="text-gray-600">{reflection}</p>
          {isOwner && (
            <Button
              variant="light"
              onClick={enableEditReflection}
              className="w-auto p-0 min-w-fit h-auto text-xs text-slate-600">
              <span>Edit</span>
            </Button>
          )}
        </div>

        <div>
          <Divider className="my-3" />
          <div className="flex items-start gap-1 justify-between">
            <div className="flex flex-wrap gap-1">
              <AnimatePresence initial={false}>
                {distinctReactions.map((reaction: SlideReaction) => (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}>
                    <Chip
                      onClick={() => handleEmojiSelect(reaction.reaction)}
                      className={cn(
                        'font-bold hover:bg-primary group/item duration-300 cursor-pointer',
                        {
                          'border border-[#7C3AED] bg-[#DAC8FA]':
                            participantEmotedOnReaction(reaction.reaction),
                        }
                      )}
                      variant="flat"
                      avatar={<em-emoji id={reaction.reaction} size={15} />}>
                      <span className="font-bold text-slate-600 group-hover/item:text-white ">
                        {getReactionCount(reaction.reaction)}
                      </span>
                    </Chip>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <EmojiPicker
              triggerIcon={
                <Button
                  variant="light"
                  className="w-[30px] h-[26px] p-0 min-w-fit">
                  <MdOutlineAddReaction className="text-slate-400 text-xl mt-[0.0625rem]" />
                </Button>
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onEmojiSelect={(selectedEmoji: any) =>
                handleEmojiSelect(selectedEmoji.id)
              }
            />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export function Reflection({
  slide,
  responses = [],
  responded,
  user,
  isHost,
  addReflection,
  updateReflection,
}: ReflectionProps) {
  const { updateTypingUsers, activeStateSession } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const [reflection, setReflection] = useState<{
    typedValue: null | string
    isTyping: boolean
    value: string
  }>({
    typedValue: null,
    value: '',
    isTyping: false,
  })
  const [editEnabled, setEditEnabled] = useState<boolean>(false)
  const { data: profile } = useProfile()
  const selfParticipant = useDyteSelector((m) => m.self)
  const debouncedReflection = useDebounce(reflection.typedValue, 500)
  const typingUsers = activeStateSession?.data?.typingUsers?.filter(
    (typingUser: { participantId: string }) =>
      typingUser.participantId !== selfParticipant.id
  )

  const getParticipantName = () => {
    if (!profile) {
      return selfParticipant.name
    }

    return `${profile.first_name} ${profile.last_name}`
  }

  const username = getParticipantName()

  const selfResponse = responses.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (res: any) => res.participant.enrollment.user_id === user.id
  )

  const otherResponses = responses.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (res: any) => res.participant.enrollment.user_id !== user.id
  )

  useEffect(() => {
    if (responded) {
      setReflection((prev) => ({
        ...prev,
        value: selfResponse.response.reflection,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (debouncedReflection !== null) {
      setReflection((prev) => ({
        ...prev,
        isTyping: false,
      }))
      updateTypingUsers({
        isTyping: false,
        participantId: selfParticipant.id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedReflection])

  const onChangeReflection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!reflection.isTyping) {
      updateTypingUsers({
        isTyping: true,
        participantId: selfParticipant.id,
        participantName: selfParticipant.name,
      })
    }
    setReflection({
      typedValue: event.target.value,
      isTyping: true,
      value: event.target.value,
    })
  }

  return (
    <div
      className="w-full min-h-full flex justify-center items-start"
      style={{
        backgroundColor: slide.content.backgroundColor,
      }}>
      <div className="w-4/5 mt-2 rounded-md relative">
        <div className="p-4">
          <h2
            className="w-full p-2 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-3xl font-bold"
            style={{
              color: slide.content.textColor,
            }}>
            {slide.content.title}
          </h2>

          <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
            {(!responded || editEnabled) && !isHost && (
              <Card className="shadow-lg border hover:shadow-xl duration-100 rounded-2xl">
                <CardHeader>
                  <div className="flex justify-start items-center gap-2">
                    <Avatar
                      isBordered
                      radius="full"
                      size="md"
                      className="min-w-fit"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`}
                    />
                    <span className="semibold">{username}</span>
                  </div>
                </CardHeader>
                <CardBody>
                  <Textarea
                    className="text-sm"
                    placeholder="Enter your reflection here."
                    value={reflection.value}
                    onChange={onChangeReflection}
                  />
                </CardBody>
                <CardFooter>
                  <div className="flex justify-end items-center gap-2 w-full">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (!responded) {
                          addReflection?.(slide, reflection.value, username)
                        } else {
                          updateReflection?.(
                            selfResponse.id,
                            reflection.value,
                            username
                          )
                        }
                        setEditEnabled(false)
                      }}>
                      submit
                    </Button>
                    {editEnabled && (
                      <Button size="sm" onClick={() => setEditEnabled(false)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            )}
            {responded && !editEnabled && (
              <ReflectionCard
                username={username}
                reflection={reflection.value}
                isOwner
                responseId={selfResponse.id}
                enableEditReflection={() => {
                  setEditEnabled((v) => !v)
                }}
              />
            )}
            {otherResponses?.map(
              (res: {
                id: string
                response: {
                  username: string
                  reflection: string
                }
              }) => (
                <ReflectionCard
                  username={res.response.username}
                  reflection={res.response.reflection}
                  isOwner={false}
                  responseId={res.id}
                />
              )
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {typingUsers?.map((typingUser: { participantName: string }) => (
              <User
                classNames={{
                  base: 'bg-[#DAC8FA] min-w-max bg-primary rounded-xl justify-start p-3',
                  name: 'font-semibold text-white',
                }}
                name={`${typingUser.participantName} is typing...`}
                avatarProps={{
                  src: `https://ui-avatars.com/api/?name=${encodeURIComponent(typingUser.participantName)}`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
