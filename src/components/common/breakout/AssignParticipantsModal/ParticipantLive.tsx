import { useDyteMeeting } from '@dytesdk/react-web-core'
import { Avatar } from '@nextui-org/react'

import { useDyteParticipants } from '@/hooks/useDyteParticipants'
import { cn } from '@/utils/utils'

type ParticipantLiveProps = {
  participant: {
    id: string
    name: string
    email: string | null
    avatar: string | null | undefined
  }
  hideEmail?: boolean
}

export function ParticipantLive({
  participant,
  hideEmail,
}: ParticipantLiveProps) {
  const { meeting } = useDyteMeeting()
  const { joinedParticipants } = useDyteParticipants()

  if (!meeting) {
    return null
  }

  const isParticipantInMeeting =
    meeting.self.customParticipantId === participant.id
      ? true
      : joinedParticipants.some((p) => p.customParticipantId === participant.id)

  return (
    <div
      className={cn('flex gap-2 items-center', {
        'text-red-500': !isParticipantInMeeting,
      })}>
      <Avatar
        alt={participant.name}
        className="flex-shrink-0"
        size="sm"
        src={participant.avatar as string}
        name={participant.name}
        showFallback
      />
      <div className="flex flex-col">
        <span
          className="text-small"
          title={hideEmail ? participant.email! : ''}>
          {participant.name}
        </span>
        {!hideEmail && (
          <span className="text-tiny text-default-400">
            {participant.email}
          </span>
        )}
      </div>
    </div>
  )
}
