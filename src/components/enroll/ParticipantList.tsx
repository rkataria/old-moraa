import { Divider } from '@nextui-org/react'

import { IUserProfile, UserAvatar } from '../common/UserAvatar'

export function Participantslist({
  participants = [],
}: {
  participants:
    | {
        id: string
        email: string
        event_role: string
        profile: IUserProfile | IUserProfile[]
      }[]
    | null
    | undefined
}) {
  if (!participants) return null
  const participantsWithoutHost = participants.filter(
    (p) => p.event_role !== 'Host'
  )

  if (participantsWithoutHost.length === 0) {
    return null
  }

  return (
    <div>
      <p className="text-sm font-medium text-slate-500">
        {participantsWithoutHost.length} Going
      </p>
      <Divider className="mt-2 mb-3" />
      <div className="flex flex-wrap gap-6">
        {participantsWithoutHost.map((participant) => (
          <UserAvatar
            profile={participant.profile as IUserProfile}
            withName
            nameClass="font-medium"
          />
        ))}
      </div>
    </div>
  )
}
