import { useMemo } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronDownIcon } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go'

import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'

import { AddParticipantsButtonWithModal } from '../common/AddParticipantsButtonWithModal'
import { EditEventButtonWithModal } from '../common/PublishEventButtonWithModal'
import { ScheduleEventButtonWithModal } from '../common/ScheduleEventButtonWithModal'

import { useAuth } from '@/hooks/useAuth'
import { EventService } from '@/services/event/event-service'
import { EventStatus } from '@/services/types/enums'

export function Header({
  event,
  leftSidebarVisible,
  onLeftSidebarToggle,
  isSlidePublished,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any
  leftSidebarVisible: boolean
  onLeftSidebarToggle: (value: boolean) => void
  isSlidePublished?: boolean
}) {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()
  const publishEventMutation = useMutation({
    mutationFn: () =>
      EventService.publishEvent({ eventId: event.id }).then(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(async () => {
              queryClient
                .refetchQueries({
                  queryKey: ['event', event.id, true],
                })
                .then(resolve)
                .catch(reject)
            }, 1000)
          })
      ),
    onSuccess: () => toast.success('Event published'),
    onError: () => toast.success('Failed to publish even'),
  })

  const userId = currentUser?.id
  const isOwner = useMemo(() => userId === event?.owner_id, [userId, event])

  if (!event) return null

  return (
    <div className="h-full p-2">
      <div className="flex justify-between items-center h-12 w-full">
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
          {isOwner && <EditEventButtonWithModal eventId={event.id} />}
        </div>
        <div className="flex justify-start items-center gap-2 bg-white px-2 h-full">
          {isOwner && <AddParticipantsButtonWithModal eventId={event.id} />}
          {isOwner && !isSlidePublished && (
            <Button
              color="success"
              variant="solid"
              size="sm"
              onClick={() => publishEventMutation.mutate()}
              isLoading={publishEventMutation.isPending}>
              Publish
            </Button>
          )}
          {isOwner ? (
            EventStatus.SCHEDULED === event?.status ? (
              <ButtonGroup variant="solid" color="primary" size="sm">
                <Button title="Start Session">
                  <Link href={`/event-session/${event.id}`}>
                    Start live session
                  </Link>
                </Button>
                <Dropdown
                  placement="bottom-end"
                  closeOnSelect={false}
                  shouldCloseOnInteractOutside={(Element) => {
                    const wrapperElement = document.getElementById(
                      'schedule-event-form'
                    )

                    return !wrapperElement?.contains(Element)
                  }}>
                  <DropdownTrigger>
                    <Button isIconOnly>
                      <ChevronDownIcon />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu className="p-0" closeOnSelect={false}>
                    <DropdownItem
                      key="merge"
                      className="p-0"
                      closeOnSelect={false}>
                      <ScheduleEventButtonWithModal
                        eventId={event.id}
                        actionButtonLabel="Re-schedule event"
                      />
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ButtonGroup>
            ) : (
              <ScheduleEventButtonWithModal eventId={event.id} />
            )
          ) : (
            <Button
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
              href={`/event-session/${event.id}`}
              title="Start Session">
              Join live session
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
