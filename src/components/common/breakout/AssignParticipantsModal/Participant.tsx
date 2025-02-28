import { Avatar } from '@heroui/react'

import { cn } from '@/utils/utils'

type ParticipantProps = {
  participant: {
    id: string
    name: string
    email: string | null
    avatar: string | null | undefined
  }
  hideEmail?: boolean
}

export function Participant({ participant, hideEmail }: ParticipantProps) {
  return (
    <div className={cn('flex gap-2 items-center', {})}>
      <Avatar
        alt={participant.name}
        className="flex-shrink-0"
        size="sm"
        src={participant.avatar as string}
        name={participant.name}
        showFallback
      />
      <div className="flex flex-col">
        <span className="text-small">{participant.name}</span>
        {!hideEmail && (
          <span className="text-tiny text-default-400">
            {participant.email}
          </span>
        )}
      </div>
    </div>
  )
}
