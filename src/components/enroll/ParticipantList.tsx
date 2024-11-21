import { ReactNode } from 'react'

import { Divider } from '@nextui-org/react'

import { IUserProfile, UserAvatar } from '../common/UserAvatar'

export function Participantslist({
  participants = [],
  label,
  rightLabelContent,
  hideOnEmptyList = true,
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

  label?: string
  rightLabelContent?: ReactNode
  hideOnEmptyList?: boolean
}) {
  if (!participants) return null
  const participantsWithoutHost = participants.filter(
    (p) => p.event_role !== 'Host'
  )

  if (participantsWithoutHost.length === 0 && hideOnEmptyList) {
    return null
  }

  return (
    <div>
      <p className="flex items-center justify-between text-sm font-medium text-slate-500">
        {participantsWithoutHost.length} {label || 'Going'}
        {rightLabelContent}
      </p>
      {participantsWithoutHost.length !== 0 && (
        <Divider className="mt-2 mb-3" />
      )}

      <div className="flex flex-wrap gap-6">
        {participantsWithoutHost.map((participant) => (
          <UserAvatar
            tooltipProps={{ isDisabled: true }}
            profile={participant.profile as IUserProfile}
            withName
            nameClass="font-medium"
          />
        ))}
      </div>
    </div>
  )
}
