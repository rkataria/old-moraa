import {
  Avatar,
  Button,
  Card as NextUICard,
  CardBody,
  CardHeader,
  Chip,
} from '@nextui-org/react'
import { AnimatePresence, motion } from 'framer-motion'
import countBy from 'lodash.countby'
import { VscReactions } from 'react-icons/vsc'

import { RenderIf } from '../../RenderIf/RenderIf'

import { EmojiPicker } from '@/components/common/EmojiPicker'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { FrameReaction } from '@/types/event-session.type'
import { IReflectionResponse } from '@/types/frame.type'
import { cn, getAvatarForName } from '@/utils/utils'

type ReactionsProps = {
  responseId: CardProps['response']['id']
  canReact: boolean
}
function Reactions({ responseId, canReact }: ReactionsProps) {
  const { participant, emoteOnReflection, frameReactions } = useEventSession()

  // useEffect(() => {
  //   console.log('frameReactions', frameReactions)
  // }, [frameReactions])

  const reactions = frameReactions.filter(
    (reaction) => reaction.frame_response_id === responseId
  )

  const countsByReaction = countBy(reactions, 'reaction')
  const distinctReactions = Object.keys(countsByReaction)

  const participantEmotedOnReaction = (emojiId: string) => {
    if (!participant) return false

    return reactions.some(
      (reaction: FrameReaction) =>
        reaction.reaction === emojiId &&
        reaction.participant_id === participant.id
    )
  }

  const handleEmojiSelect = (selectedEmojiId: string) => {
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
    })
  }

  return (
    <div className="flex items-start gap-1 justify-between">
      <div className="flex flex-wrap gap-1.5">
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
                    'bg-primary/20': participantEmotedOnReaction(reaction),
                  }
                )}
                variant="flat"
                avatar={<em-emoji set="apple" id={reaction} size={22} />}>
                <span className="font-bold text-gray-600 group-hover/item:text-white ">
                  {countsByReaction[reaction]}
                </span>
              </Chip>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
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
  avatarUrl?: string
  enableEditReflection?: () => void
}

export function Card({
  response,
  isOwner,
  avatarUrl,
  enableEditReflection,
}: CardProps) {
  const {
    username,
    reflection,
    anonymous: isAnonymous = false,
  } = response.response
  const responseId = response.id
  const currentFrame = useCurrentFrame()

  const getAvatar = () => {
    if (isAnonymous) {
      return 'https://github.com/shadcn.png'
    }

    return getAvatarForName(username, avatarUrl)
  }

  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data
  )

  const reflectionStarted =
    session?.data?.framesConfig?.[currentFrame?.id || '']?.reflectionStarted

  const editable = isOwner && reflectionStarted

  return (
    <NextUICard className="rounded-2xl shadow-md border border-gray-50">
      <CardHeader className="p-4">
        <div className="flex justify-start items-center gap-2">
          <Avatar
            radius="full"
            size="sm"
            className="min-w-fit w-6 h-6"
            src={getAvatar()}
          />
          <h4 className="text-sm text-black/70">
            {isAnonymous ? 'Anonymous' : username}
            {isOwner && ' (you)'}
          </h4>
        </div>
      </CardHeader>
      <CardBody className="pt-0 px-4 flex flex-col justify-between">
        <div className="w-full">
          <p className="text-base text-gray-800">{reflection}</p>
          <RenderIf isTrue={editable}>
            <Button
              variant="light"
              onClick={enableEditReflection}
              className="w-auto p-0 min-w-fit mt-2.5 h-auto text-xs text-slate-400 hover:text-primary !bg-transparent">
              <span>Edit</span>
            </Button>
          </RenderIf>
        </div>
        <div className="mt-6">
          {/* <Divider className="my-3" /> */}
          <Reactions responseId={responseId} canReact={reflectionStarted} />
        </div>
      </CardBody>
    </NextUICard>
  )
}
