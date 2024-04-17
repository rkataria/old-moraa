import { useContext } from 'react'

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
import { PreviewSwitcher } from '../common/PreviewSwitcher'
import { EditEventButtonWithModal } from '../common/PublishEventButtonWithModal'
import { ScheduleEventButtonWithModal } from '../common/ScheduleEventButtonWithModal'

import { EventContext } from '@/contexts/EventContext'
import { EventService } from '@/services/event/event-service'
import { EventStatus } from '@/services/types/enums'
import { type EventContextType } from '@/types/event-context.type'

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
  const { isOwner, preview } = useContext(EventContext) as EventContextType
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

  const renderActionButtons = () => {
    if (preview) return null

    if (!isOwner) {
      return (
        <Link href={`/event-session/${event.id}`}>
          <Button title="Start Session">Join live session</Button>
        </Link>
      )
    }

    return (
      <>
        <AddParticipantsButtonWithModal eventId={event.id} />
        {!isSlidePublished && (
          <Button
            color="success"
            variant="solid"
            size="sm"
            radius="md"
            onClick={() => publishEventMutation.mutate()}
            isLoading={publishEventMutation.isPending}>
            Publish
          </Button>
        )}
        {EventStatus.SCHEDULED === event?.status ? (
          <ButtonGroup variant="solid" color="primary" size="sm" radius="md">
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
                <DropdownItem key="merge" className="p-0" closeOnSelect={false}>
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
        )}
      </>
    )
  }

  if (!event) return null

  return (
    <div className="h-full p-2 bg-white">
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
          {!preview && isOwner && (
            <EditEventButtonWithModal eventId={event.id} />
          )}
          {isOwner && <PreviewSwitcher />}
        </div>
        <div className="flex justify-start items-center gap-2 bg-white px-2 h-full">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  )
}
