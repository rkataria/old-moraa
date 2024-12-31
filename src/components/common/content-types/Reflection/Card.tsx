import {
  Button,
  Card as NextUICard,
  CardBody,
  CardHeader,
  Avatar,
} from '@nextui-org/react'
import { VscReactions } from 'react-icons/vsc'

import { Emojis } from './Emojis'
import { RenderIf } from '../../RenderIf/RenderIf'

import { EmojiPicker } from '@/components/common/EmojiPicker'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { FrameReaction } from '@/types/event-session.type'
import { IReflectionResponse } from '@/types/frame.type'
import { getAvatarForName } from '@/utils/utils'

type ReactionsProps = {
  responseId: CardProps['response']['id']
  canReact: boolean
  userName: string
  avatarUrl: string
}
function Reactions({
  responseId,
  canReact,
  userName,
  avatarUrl,
}: ReactionsProps) {
  const { participant, emoteOnReflection, frameReactions } = useEventSession()

  const reactions = frameReactions.filter(
    (reaction) => reaction.frame_response_id === responseId
  )

  const participantEmotedOnReaction = (emojiId: string) => {
    if (!participant) return false

    return reactions.some(
      (reaction: FrameReaction) =>
        reaction.reaction === emojiId &&
        reaction.participant_id === participant.id
    )
  }

  const handleEmojiSelect = (selectedEmojiId: string) => {
    if (!canReact) return

    const participantEmote = reactions.find(
      (reaction: FrameReaction) => reaction.participant_id === participant.id
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
      frameResponseId: responseId,
      reactionId: participantEmote?.id,
      action: emoteAction,
      details: {
        name: userName,
        avatar_url: avatarUrl,
      },
    })
  }

  return (
    <div className="flex items-start gap-1 justify-between">
      <Emojis
        reactions={reactions}
        canReact={canReact}
        handleEmojiSelect={handleEmojiSelect}
        participantEmotedOnReaction={participantEmotedOnReaction}
      />
      <RenderIf isTrue={canReact}>
        <div>
          <EmojiPicker
            triggerIcon={
              <Button
                variant="light"
                className="w-[30px] h-[26px] p-0 min-w-fit">
                <VscReactions
                  className="text-gray-400 mt-[0.0625rem]"
                  size={24}
                />
              </Button>
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onEmojiSelect={(selectedEmoji: any) =>
              handleEmojiSelect(selectedEmoji.id)
            }
          />
        </div>
      </RenderIf>
    </div>
  )
}

type CardProps = {
  response: IReflectionResponse
  isOwner: boolean
  userName: string
  avatarUrl: string
  enableEditReflection?: () => void
}

export function Card({
  response,
  isOwner,
  userName,
  avatarUrl,
  enableEditReflection,
}: CardProps) {
  const reflectedUserAvatarUrl =
    response.participant.enrollment?.profile?.avatar_url
  const {
    username: reflectedUsername,
    reflection,
    anonymous: isAnonymous = false,
  } = response.response
  const responseId = response.id
  const currentFrame = useCurrentFrame()

  const getAvatar = () => {
    if (isAnonymous) {
      return 'https://github.com/shadcn.png'
    }

    return getAvatarForName(reflectedUsername, reflectedUserAvatarUrl)
  }

  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data
  )

  const reflectionStartedInMainRoom =
    session?.data?.framesConfig?.[currentFrame?.id || '']?.reflectionStarted

  const isInBreakoutMeeting = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )

  const canReact = () => {
    if (isInBreakoutMeeting) return true

    return reflectionStartedInMainRoom
  }

  const isEditable = () => {
    if (isInBreakoutMeeting) return true

    return isOwner && reflectionStartedInMainRoom
  }

  return (
    <NextUICard className="rounded-2xl shadow-md border border-gray-50">
      <CardHeader className="p-4">
        <div className="flex justify-start items-center gap-2">
          <Avatar
            radius="full"
            size="sm"
            className="min-w-6 w-6 h-6"
            src={getAvatar()}
          />
          <h4 className="text-sm text-black/70">
            {isAnonymous ? 'Anonymous' : reflectedUsername}
            {isOwner && ' (you)'}
          </h4>
        </div>
      </CardHeader>
      <CardBody className="pt-0 px-4 flex flex-col justify-between">
        <div className="w-full">
          <p className="text-base text-gray-800">{reflection}</p>
          <RenderIf isTrue={isEditable()}>
            <Button
              variant="light"
              onClick={enableEditReflection}
              className="w-auto p-0 min-w-fit mt-2.5 h-auto text-xs text-slate-400 hover:text-primary !bg-transparent">
              <span>Edit</span>
            </Button>
          </RenderIf>
        </div>
        <div className="mt-6">
          <Reactions
            responseId={responseId}
            userName={userName}
            avatarUrl={avatarUrl}
            canReact={canReact()}
          />
        </div>
      </CardBody>
    </NextUICard>
  )
}
