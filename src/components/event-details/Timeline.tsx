import { Card, CardBody } from '@nextui-org/react'
import { MdOutlineEditCalendar } from 'react-icons/md'

import { EventDate } from './Date'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { ScheduleEventButtonWithModal } from '../common/ScheduleEventButtonWithModal'
import { IUserProfile, UserAvatar } from '../common/UserAvatar'

import { EventModel } from '@/types/models'

export function EventTimeline({
  event,
  hosts,
  canUpdateDate = false,
  hideHostInfo = true,
}: {
  event: EventModel
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hosts: any
  canUpdateDate?: boolean
  hideHostInfo?: boolean
}) {
  const host = hosts?.[0]

  if (!event.start_date || !event.end_date) {
    return null
  }

  return (
    <Card shadow="none" className="bg-default/30 backdrop-blur-xl">
      <CardBody className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <RenderIf isTrue={!!event?.start_date && !!event?.timezone}>
            <EventDate
              startDate={event?.start_date as string}
              endDate={event?.end_date as string}
              timezone={event?.timezone as string}
            />
          </RenderIf>
          <RenderIf isTrue={canUpdateDate}>
            <ScheduleEventButtonWithModal
              actionButtonLabel=""
              buttonProps={{
                variant: 'light',
                color: 'primary',
                gradient: 'none',
                isIconOnly: true,
                startContent: <MdOutlineEditCalendar size={16} />,
              }}
            />
          </RenderIf>
        </div>
        <RenderIf isTrue={!!host?.profile && !hideHostInfo}>
          <div className="flex justify-between items-center border-t pt-2">
            <span className="font-semibold">Hosted by</span>
            <UserAvatar
              name={!host?.profile ? host?.email : ''}
              tooltipProps={{ isDisabled: true }}
              profile={host?.profile as IUserProfile}
              withName
              avatarProps={{
                size: 'sm',
              }}
            />
          </div>
        </RenderIf>
      </CardBody>
    </Card>
  )
}
