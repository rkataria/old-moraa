'use client'

import React from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import countBy from 'lodash.countby'
import { MdOutlineAddReaction } from 'react-icons/md'

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
} from '@nextui-org/react'

import { EmojiPicker } from '@/components/common/EmojiPicker'
import { useEventSession } from '@/contexts/EventSessionContext'
import { SlideReaction } from '@/types/event-session.type'
import { IReflectionResponse } from '@/types/slide.type'
import { cn, getAvatarForName } from '@/utils/utils'

type ReactionsProps = {
  responseId: ReflectionCardProps['response']['id']
}
function Reactions({ responseId }: ReactionsProps) {
  const { participant, emoteOnReflection, slideReactions } = useEventSession()

  const reactions = slideReactions.filter(
    (reaction) => reaction.slide_response_id === responseId
  )

  const countsByReaction = countBy(reactions, 'reaction')
  const distinctReactions = Object.keys(countsByReaction)

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
      (reaction: SlideReaction) => reaction.participant_id === participant.id
    )

    const getEmoteAction = () => {
      if (!participantEmote) return 'INSERT'
      if (participantEmote.reaction === selectedEmojiId) return 'DELETE'

      return 'UPDATE'
    }

    const emoteAction = getEmoteAction()

    emoteOnReflection?.({
      participantId: participant.id,
      reaction: selectedEmojiId,
      slideResponseId: responseId,
      reactionId: participantEmote?.id,
      action: emoteAction,
    })
  }

  return (
    <div className="flex items-start gap-1 justify-between">
      <div className="flex flex-wrap gap-1">
        <AnimatePresence initial={false}>
          {distinctReactions.map((reaction: string) => (
            <motion.div
              key={reaction}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}>
              <Chip
                onClick={() => handleEmojiSelect(reaction)}
                className={cn(
                  'font-bold hover:bg-primary group/item duration-300 cursor-pointer',
                  {
                    'border border-[#7C3AED] bg-[#DAC8FA]':
                      participantEmotedOnReaction(reaction),
                  }
                )}
                variant="flat"
                avatar={<em-emoji set="apple" id={reaction} size={20} />}>
                <span className="font-bold text-slate-600 group-hover/item:text-white ">
                  {countsByReaction[reaction]}
                </span>
              </Chip>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <EmojiPicker
        triggerIcon={
          <Button variant="light" className="w-[30px] h-[26px] p-0 min-w-fit">
            <MdOutlineAddReaction className="text-slate-400 text-xl mt-[0.0625rem]" />
          </Button>
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEmojiSelect={(selectedEmoji: any) =>
          handleEmojiSelect(selectedEmoji.id)
        }
      />
    </div>
  )
}

type ReflectionCardProps = {
  response: IReflectionResponse
  isOwner: boolean
  avatarUrl?: string
  enableEditReflection?: () => void
}

export function ReflectionCard({
  response,
  isOwner,
  avatarUrl,
  enableEditReflection,
}: ReflectionCardProps) {
  const {
    username,
    reflection,
    anonymous: isAnonymous = false,
  } = response.response
  const responseId = response.id

  const getAvatar = () => {
    if (isAnonymous) {
      return 'https://github.com/shadcn.png'
    }

    return getAvatarForName(username, avatarUrl)
  }

  return (
    <Card className="shadow-lg border hover:shadow-xl duration-100 rounded-2xl">
      <CardHeader className="z-0">
        <div className="flex justify-start items-center gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            className="min-w-fit"
            src={getAvatar()}
          />
          <h4 className="text-small font-semibold leading-none text-default-600">
            {isAnonymous ? 'Anonymous' : username}
            {isOwner && ' (you)'}
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
          <Reactions responseId={responseId} />
        </div>
      </CardBody>
    </Card>
  )
}
