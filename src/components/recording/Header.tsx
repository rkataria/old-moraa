import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react'
import { useParams, useRouter } from '@tanstack/react-router'

import { MoraaLogo } from '../common/MoraaLogo'

import { useEvent } from '@/hooks/useEvent'

export function Header() {
  const router = useRouter()
  const { eventId, recordingId } = useParams({ strict: false })
  const { event } = useEvent({ id: eventId as string })

  if (!event) return null

  return (
    <div className="flex items-center justify-between w-full h-[56px] px-6 p-4 sticky top-0 bg-white z-[10] border-b">
      <div className="flex items-center gap-2 h-full flex-1">
        <div className="pr-4 border-r-2 border-gray-200 flex items-center">
          <MoraaLogo
            color="primary"
            className="cursor-pointer"
            logoOnly
            onClick={() =>
              router.navigate({
                to: '/events',
              })
            }
          />
        </div>
        <Breadcrumbs
          itemClasses={{
            separator: 'px-2',
          }}
          separator="/">
          <BreadcrumbItem
            onPress={() => router.navigate({ to: `/events/${eventId}` })}>
            {event.name}
          </BreadcrumbItem>
          <BreadcrumbItem
            isCurrent={!!eventId && !recordingId}
            onPress={() =>
              router.navigate({ to: `/events/${eventId}/recordings` })
            }>
            Recordings
          </BreadcrumbItem>
          <BreadcrumbItem isCurrent={!!eventId && !!recordingId}>
            Recording
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
    </div>
  )
}
