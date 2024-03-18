import { useMemo } from 'react'

import clsx from 'clsx'
import Link from 'next/link'
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go'

import { Button } from '@nextui-org/react'

import { AddParticipantsButtonWithModal } from '../common/AddParticipantsButtonWithModal'
import { PublishEventButtonWithModal } from '../common/PublishEventButtonWithModal'

import { useAuth } from '@/hooks/useAuth'

enum EventType {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
}

const styles = {
  button: {
    default:
      'flex justify-center items-center hover:bg-gray-800 hover:text-white transition-all duration-200 p-2 rounded-md',
  },
}

export function Header({
  event,
  leftSidebarVisible,
  onLeftSidebarToggle,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any
  leftSidebarVisible: boolean
  onLeftSidebarToggle: (value: boolean) => void
}) {
  const { currentUser } = useAuth()

  const userId = currentUser?.id
  const isOwner = useMemo(() => userId === event?.owner_id, [userId, event])

  return (
    <div className="flex justify-between items-center h-16 w-full p-2">
      <div className="flex justify-start items-center gap-2">
        <Button
          isIconOnly
          variant="light"
          onClick={() => onLeftSidebarToggle(!leftSidebarVisible)}>
          {leftSidebarVisible ? (
            <GoSidebarCollapse size={24} className="rotate-180" />
          ) : (
            <GoSidebarExpand size={24} className="rotate-180" />
          )}
        </Button>
        <span className="font-bold">{event?.name}</span>
      </div>
      <div className="flex justify-start items-center gap-2 bg-white px-2 h-full">
        {event?.status === EventType.DRAFT && userId === event.owner_id && (
          <PublishEventButtonWithModal eventId={event.id} />
        )}
        {event?.status === EventType.PUBLISHED && (
          <>
            {isOwner && <AddParticipantsButtonWithModal eventId={event.id} />}
            <Link
              href={`/event-session/${event.id}`}
              className={clsx(
                styles.button.default,
                'font-semibold text-sm bg-black text-white !rounded-full px-4'
              )}
              title="Start Session">
              {isOwner ? 'Start' : 'Join'} Session
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
