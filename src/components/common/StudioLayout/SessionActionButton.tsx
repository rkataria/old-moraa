import { useContext } from 'react'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react'
import { Link } from '@tanstack/react-router'
import { ChevronDownIcon } from 'lucide-react'

import { ScheduleEventButtonWithModal } from '../ScheduleEventButtonWithModal'

import type { UseDisclosureReturn } from '@nextui-org/use-disclosure'

import { Button } from '@/components/ui/Button'
import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventStatus } from '@/services/types/enums'
import { EventContextType } from '@/types/event-context.type'

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
    <Dropdown
      placement="bottom-end"
      closeOnSelect={false}
      className="rounded-md"
      shouldCloseOnInteractOutside={(Element) => {
        const wrapperElement = document.getElementById('schedule-event-form')

        return !wrapperElement?.contains(Element)
      }}>
      <DropdownTrigger>
        <Button size="sm" isIconOnly className="rounded-s-none">
          <ChevronDownIcon />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        className="p-0"
        closeOnSelect={false}
        onAction={(key) => {
          if (key === 're-schedule') {
            scheduleModal.onOpen()
          }
        }}>
        <DropdownItem
          key="re-schedule"
          className="p-0 rounded-md"
          closeOnSelect>
          <Button size="sm" variant="solid" fullWidth>
            Re-schedule event
          </Button>
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
  const scheduleModal = useDisclosure()

  const { permissions } = useEventPermissions()

  if (
    permissions.canAcessAllSessionControls &&
    eventStatus === EventStatus.SCHEDULED
  ) {
    return (
      <>
        <div className="flex justify-center items-center gap-0">
          <Link to={`/event-session/${eventId}`}>
            <Button
              as={Link}
              size="sm"
              title="Start session"
              className="rounded-e-none">
              Start live session
            </Button>
          </Link>
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
      <Link to={`/event-session/${eventId}`}>
        <Button
          as={Link}
          size="sm"
          variant="solid"
          color="secondary"
          title="Join live session">
          Join live session
        </Button>
      </Link>
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
  const { preview } = useContext(EventContext) as EventContextType

  const { permissions } = useEventPermissions()

  if (!permissions.canAccessSession) {
    return null
  }
  if (!preview) return null

  return <ActionButton eventId={eventId} eventStatus={eventStatus} />
}
