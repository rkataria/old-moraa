import { DateTime } from 'luxon'
import { GoDot, GoDotFill } from 'react-icons/go'

import { Avatar, Chip, Image } from '@nextui-org/react'

import { EventActions } from './EventActions'
import { Loading } from '../common/Loading'
import { UserAvatar } from '../common/UserAvatar'

import { IMAGE_PLACEHOLDER } from '@/constants/common'
import { getCurrentTimeInLocalZoneFromTimeZone } from '@/utils/date'
import { getStatusColor } from '@/utils/event.util'

export function GridView({
  eventRows,
  isLoading,
  currentUserId,
  refetch,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventRows: any[]
  isLoading: boolean
  currentUserId: string
  refetch: () => void
}) {
  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 min-[1920px]:grid-cols-5">
      {eventRows.map((event) => (
        <div className="relative border rounded-lg p-[1.25rem] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar
                  name={event.name}
                  src={event.image_url}
                  fallback={
                    event.image_url && (
                      <Image
                        src={IMAGE_PLACEHOLDER}
                        className="w-full h-full"
                      />
                    )
                  }
                  classNames={{
                    base: 'aspect-square w-20 border h-full rounded-lg',
                    img: 'h-full object-cover',
                    fallback: 'w-full h-full',
                  }}
                  showFallback={event.image_url}
                />
                <div>
                  <Chip
                    variant="flat"
                    size="sm"
                    radius="full"
                    color={getStatusColor(event.status)}
                    classNames={{ base: 'text-center' }}>
                    {event.status}
                  </Chip>

                  <div className="relative grid gap-1 before:absolute before:content-[''] before:w-px before:h-[38%] before:-translate-y-2/4 before:border-l-[2px] before:border-l-black/20 before:border-dotted before:left-[9px] before:top-2/4 mt-2">
                    <div className="flex items-center gap-6 justify-between">
                      <p className="text-gray-400 flex items-center gap-1 text-sm min-w-max">
                        <GoDotFill className="text-xl text-green-500" />
                        <p className="text-gray-600 text-xs">
                          {getCurrentTimeInLocalZoneFromTimeZone({
                            dateTimeString: event.start_date,
                            utcTimeZone: event.timezone,
                            format: 'dd MMM yyyy',
                          }) || 'NA'}{' '}
                          (
                          {getCurrentTimeInLocalZoneFromTimeZone({
                            dateTimeString: event.start_date,
                            utcTimeZone: event.timezone,
                            format: 'hh:mm a',
                          }) || 'NA'}
                          )
                        </p>
                      </p>
                    </div>
                    <div className="flex items-center gap-6 justify-between">
                      <p className="text-gray-400 flex items-center gap-1 text-sm min-w-max">
                        <GoDot className="text-xl text-red-500" />
                        <p className="text-gray-600 text-xs">
                          {getCurrentTimeInLocalZoneFromTimeZone({
                            dateTimeString: event.end_date,
                            utcTimeZone: event.timezone,
                            format: 'dd MMM yyyy',
                          }) || 'NA'}{' '}
                          (
                          {getCurrentTimeInLocalZoneFromTimeZone({
                            dateTimeString: event.end_date,
                            utcTimeZone: event.timezone,
                            format: 'hh:mm a',
                          }) || 'NA'}
                          )
                        </p>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-semibold text-black/80 tracking-tight leading-[18px] text-sm">
                {event.name}
              </p>
              <p className="text-gray-600 text-sm tracking-tight mt-2 break-all">
                {event.description}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-black/60">
              {DateTime.fromISO(event.created_at).toLocaleString({
                year: 'numeric',
                month: 'short',
                day: '2-digit',
              })}
            </p>
            <UserAvatar
              profile={event.profile}
              withName
              avatarProps={{
                classNames: { base: 'w-6 h-6 min-w-6' },
              }}
              nameClass="font-medium text-xs text-black/60"
            />
          </div>
          <div className="absolute right-3 top-4">
            <EventActions
              as="dropdown"
              event={event}
              isOwner={event.owner_id === currentUserId}
              onDone={refetch}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
