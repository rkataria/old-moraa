import { ReactNode, useState } from 'react'

import { Divider, Tab, Tabs } from '@nextui-org/react'

import { RenderIf } from '../common/RenderIf/RenderIf'
import { IUserProfile, UserAvatar } from '../common/UserAvatar'

export function Participantslist({
  participants = [],
  rightLabelContent,
  hideOnEmptyList = true,
  visibleInvitedTab = true,
  visibleHostBy = true,
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

  rightLabelContent?: ReactNode
  hideOnEmptyList?: boolean
  visibleInvitedTab?: boolean
  visibleHostBy?: boolean
}) {
  const [selected, setSelected] = useState('going')
  if (!participants) return null

  const host = participants.find((p) => p.event_role === 'Host')

  const registeredUsers = participants.filter(
    (p) => p.profile && p.event_role !== 'Host'
  )
  const nonRegisteredUsers = participants.filter(
    (p) => !p.profile && p.event_role !== 'Host'
  )
  const participantsWithoutHost = participants.filter(
    (p) => p.event_role !== 'Host'
  )

  if (participantsWithoutHost.length === 0 && hideOnEmptyList) {
    return null
  }

  const list = selected === 'going' ? registeredUsers : nonRegisteredUsers

  return (
    <div>
      <RenderIf isTrue={visibleHostBy}>
        <div>
          <p className="text-sm font-medium text-slate-500">Hosted by</p>
          <Divider className="mt-2 mb-3" />
          <UserAvatar
            tooltipProps={{ isDisabled: true }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            profile={host?.profile as any}
            withName
            nameClass="font-medium"
          />
        </div>
      </RenderIf>

      <div className="flex items-center justify-between">
        <Tabs
          key="underlined"
          aria-label="Tabs variants"
          variant="underlined"
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as string)}
          classNames={{
            tabList: 'gap-6 w-full relative rounded-none p-0',
            cursor: 'w-full bg-primary',
            tab: 'max-w-fit px-0 h-12',
            tabContent: 'group-data-[selected=true]:text-primary',
          }}>
          <Tab key="going" title={`${registeredUsers.length} Going`} />
          {visibleInvitedTab && (
            <Tab key="invited" title={`${nonRegisteredUsers.length} Invited`} />
          )}
        </Tabs>
        <p className="flex items-center justify-between text-sm font-medium text-slate-500">
          {rightLabelContent}
        </p>
      </div>

      {participantsWithoutHost.length !== 0 && (
        <Divider className="mt-0 mb-3" />
      )}

      <div className="flex flex-wrap gap-6">
        {list.map((participant) => (
          <UserAvatar
            name={!participant.profile ? participant.email : ''}
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
