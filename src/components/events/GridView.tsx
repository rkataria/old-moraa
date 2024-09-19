/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { Avatar, Card, CardBody, Chip, Image } from '@nextui-org/react'
import { useRouter } from '@tanstack/react-router'
import { DateTime } from 'luxon'

import { EventActions } from './EventActions'
import { Loading } from '../common/Loading'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { Tooltip } from '../common/ShortuctTooltip'
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
  const router = useRouter()
  if (isLoading) {
    return <Loading />
  }

  const handleCardClick = (eventId: string) => {
    router.navigate({ to: `/events/${eventId}`, search: { action: 'view' } })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 min-[1920px]:grid-cols-5">
      {eventRows.map((event) => (
        <Card
          className="border-none bg-background/60 dark:bg-default-100/50 cursor-pointer hover:shadow-xl"
          shadow="sm"
          isPressable
          onPress={() => handleCardClick(event.id)}>
          <CardBody>
            <Avatar
              name={event.name}
              src={event.image_url}
              fallback={
                event.image_url && (
                  <Image src={IMAGE_PLACEHOLDER} className="w-full h-full" />
                )
              }
              classNames={{
                base: 'w-full h-40 rounded-lg aspect-square',
                img: 'h-full object-cover',
                fallback: 'w-full h-full',
              }}
              showFallback={event.image_url}
            />

            <div className="flex items-center justify-between w-full mt-5">
              <Chip
                variant="flat"
                size="sm"
                radius="full"
                color={getStatusColor(event.status)}
                classNames={{ base: 'text-center' }}>
                {event.status}
              </Chip>

              <EventActions
                as="dropdown"
                event={event}
                isOwner={event.owner_id === currentUserId}
                onDone={refetch}
              />
            </div>

            <RenderIf isTrue={event.start_date && event.end_date}>
              <Tooltip
                label={
                  <div className="flex items-center gap-4">
                    <p>
                      {getCurrentTimeInLocalZoneFromTimeZone({
                        dateTimeString: event.start_date,
                        utcTimeZone: event.timezone,
                        format: 'dd MMM yyyy',
                      }) || 'NA'}{' '}
                    </p>
                    -
                    <p>
                      {getCurrentTimeInLocalZoneFromTimeZone({
                        dateTimeString: event.end_date,
                        utcTimeZone: event.timezone,
                        format: 'dd MMM yyyy',
                      }) || 'NA'}{' '}
                    </p>
                  </div>
                }>
                <div className="flex gap-4 items-center mt-3">
                  <p className="text-gray-600 text-xs">
                    {getCurrentTimeInLocalZoneFromTimeZone({
                      dateTimeString: event.start_date,
                      utcTimeZone: event.timezone,
                      format: 'ccc',
                    })}
                    {' , '}
                    {getCurrentTimeInLocalZoneFromTimeZone({
                      dateTimeString: event.start_date,
                      utcTimeZone: event.timezone,
                      format: 'hh:mm a',
                    }) || 'NA'}
                  </p>
                  -
                  <p className="text-gray-600 text-xs">
                    {getCurrentTimeInLocalZoneFromTimeZone({
                      dateTimeString: event.end_date,
                      utcTimeZone: event.timezone,
                      format: 'ccc',
                    })}
                    {' , '}
                    {getCurrentTimeInLocalZoneFromTimeZone({
                      dateTimeString: event.end_date,
                      utcTimeZone: event.timezone,
                      format: 'hh:mm a',
                    }) || 'NA'}
                  </p>
                </div>
              </Tooltip>
            </RenderIf>

            <p className="text-lg font-medium mt-3 line-clamp-2">
              {event.name}
            </p>

            <p className="mt-1 text-xs line-clamp-3 mb-14">
              {event.description}
            </p>

            <div className="w-full absolute bottom-0 left-0 flex items-center justify-between p-4">
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
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
