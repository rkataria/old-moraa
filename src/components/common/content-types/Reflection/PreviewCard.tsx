import { Card, cn, CardHeader, Avatar, CardBody } from '@nextui-org/react'

import { Emojis } from './Emojis'

import { FrameReaction } from '@/types/event-session.type'
import { getAvatarForName } from '@/utils/utils'

export function PreviewCard({
  isAnonymous,
  username,
  reflection,
  reactions,
  className,
  style = {},
}: {
  isAnonymous?: boolean
  username: string
  reflection: string
  reactions: FrameReaction[]
  className?: string
  style?: React.CSSProperties
}) {
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
        <Emojis reactions={reactions} canReact={false} className="mt-4" />
      </CardBody>
    </Card>
  )
}
