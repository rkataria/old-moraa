import { DateTime } from 'luxon'
import { GoDot, GoDotFill } from 'react-icons/go'

import { Chip, Image, User } from '@nextui-org/react'

import { EventActions } from './EventActions'
import { Loading } from '../common/Loading'

import { getCurrentTimeInLocalZoneFromTimeZone } from '@/utils/date'
import { getStatusColor } from '@/utils/event.util'
import { getProfileName } from '@/utils/profile.util'
import { getAvatarForName } from '@/utils/utils'

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
    return <Loading isFullSize />
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAvatar = (profile: any) => {
    if (profile?.avatar_url) {
      return profile?.avatar_url
    }

    if (getProfileName(profile)) {
      return getAvatarForName(getProfileName(profile)!)
    }

    return 'https://github.com/shadcn.png'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 min-[1920px]:grid-cols-5">
      {eventRows.map((event) => (
        <div className="border rounded-lg p-[1.25rem] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Image
                  src={
                    event?.image_url ||
                    'https://images.unsplash.com/photo-1525351159099-81893194469e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBhcnR5JTIwaW52aXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D'
                  }
                  classNames={{
                    wrapper: 'aspect-square w-20 border',
                    img: 'h-full object-cover',
                  }}
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
              <EventActions
                as="dropdown"
                event={event}
                isOwner={event.owner_id === currentUserId}
                onDone={refetch}
              />
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
            <User
              name={getProfileName(event.profile)}
              avatarProps={{
                classNames: { base: 'w-6 h-6 min-w-6' },
                src: getAvatar(event.profile),
              }}
              classNames={{ name: 'font-medium text-xs text-black/60' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
