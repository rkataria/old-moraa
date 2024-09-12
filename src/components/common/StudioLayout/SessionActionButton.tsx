import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react'
import { useRouter } from '@tanstack/react-router'
import { ChevronDownIcon } from 'lucide-react'

import { ScheduleEventButtonWithModal } from '../ScheduleEventButtonWithModal'

import type { UseDisclosureReturn } from '@nextui-org/use-disclosure'

import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventStatus } from '@/types/enums'

function ScheduleSessionButton({
  scheduleModal,
}: {
  scheduleModal: UseDisclosureReturn
}) {
  const { permissions } = useEventPermissions()

  if (!permissions.canUpdateMeeting) {
    return null
  }

  return (
    <Dropdown placement="bottom-end" className="rounded-md">
      <DropdownTrigger>
        <Button color="primary" size="sm" isIconOnly className="rounded-s-none">
          <ChevronDownIcon />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        className="p-0"
        onAction={(key) => {
          if (key === 're-schedule') {
            scheduleModal.onOpen()
          }
        }}>
        <DropdownItem
          key="re-schedule"
          className="p-2 rounded-md h-8 bg-gray-100 hover:bg-gray-200"
          closeOnSelect>
          Re-schedule event
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

function ActionButton({
  eventId,
  eventStatus,
}: {
  eventId: string
  eventStatus: string
}) {
  const router = useRouter()
  const scheduleModal = useDisclosure()

  const { permissions } = useEventPermissions()

  if (
    permissions.canAcessAllSessionControls &&
    eventStatus === EventStatus.SCHEDULED
  ) {
    return (
      <>
        <div className="flex justify-center items-center gap-0">
          <Button
            color="primary"
            onClick={() => router.navigate({ to: `/event-session/${eventId}` })}
            size="sm"
            title="Start session"
            className="rounded-e-none">
            Start live session
          </Button>
          <ScheduleSessionButton scheduleModal={scheduleModal} />
        </div>
        <ScheduleEventButtonWithModal
          id="re-schedule"
          showLabel={false}
          disclosure={scheduleModal}
        />
      </>
    )
  }

  if (permissions.canUpdateMeeting) {
    return <ScheduleEventButtonWithModal id="schedule" />
  }

  if (eventStatus === EventStatus.SCHEDULED) {
    return (
      <Button
        onClick={() => router.navigate({ to: `/event-session/${eventId}` })}
        size="sm"
        variant="solid"
        color="primary"
        title="Join live session">
        Join live session
      </Button>
    )
  }

  return null
}

export function SessionActionButton({
  eventId,
  eventStatus,
}: {
  eventId: string
  eventStatus: string
}) {
  const { preview } = useEventContext()
  const { permissions } = useEventPermissions()

  if (!permissions.canAccessSession) {
    return null
  }

  if (!preview && permissions.canUpdateFrame) return null

  return <ActionButton eventId={eventId} eventStatus={eventStatus} />
}
