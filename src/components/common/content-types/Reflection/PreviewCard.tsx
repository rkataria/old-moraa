import { Card, cn, CardHeader, Avatar, CardBody, Chip } from '@nextui-org/react'
import uniqBy from 'lodash.uniqby'
import { VscReactions } from 'react-icons/vsc'

import { RenderIf } from '../../RenderIf/RenderIf'

import { FrameReaction } from '@/types/event-session.type'
import { getAvatarForName } from '@/utils/utils'

export function PreviewCard({
  isAnonymous,
  username,
  reflection,
  reactions,
  className,
  style = {},
  visibleAddReaction = true,
}: {
  isAnonymous?: boolean
  username: string
  reflection: string
  reactions: FrameReaction[]
  className?: string
  style?: React.CSSProperties
  visibleAddReaction?: boolean
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
      className={cn('rounded-2xl shadow-md border border-gray-50', className)}
      style={style}>
      <CardHeader className="p-4">
        <div className="flex justify-start items-center gap-2">
          <Avatar
            radius="full"
            size="sm"
            className="min-w-fit w-6 h-6"
            src={getAvatarForName(`${isAnonymous ? 'A' : username}`)}
          />

          <h4 className="text-sm text-black/70">
            {isAnonymous ? 'Anonymous' : username}
          </h4>
        </div>
      </CardHeader>
      <CardBody className="pt-0 px-4 flex flex-col justify-between">
        <div className="w-full">
          <p className="text-base text-gray-800">{reflection}</p>
        </div>
        <div className="flex items-center gap-1 justify-between mt-4">
          <div className="flex flex-wrap gap-1">
            {distinctReactions.map((reaction: FrameReaction) => (
              <Chip
                className={cn('font-bold')}
                variant="flat"
                color="primary"
                avatar={
                  <em-emoji set="apple" id={reaction.reaction} size={20} />
                }>
                <span className="font-bold text-primary-600">
                  {getReactionCount(reaction.reaction)}
                </span>
              </Chip>
            ))}
          </div>
          <RenderIf isTrue={visibleAddReaction}>
            <VscReactions className="text-gray-400" size={24} />
          </RenderIf>
        </div>
      </CardBody>
    </Card>
  )
}
