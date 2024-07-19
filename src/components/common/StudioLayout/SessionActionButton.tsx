import {
  Button,
  ButtonGroup,
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

import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventStatus } from '@/services/types/enums'

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
      shouldCloseOnInteractOutside={(Element) => {
        const wrapperElement = document.getElementById('schedule-event-form')

        return !wrapperElement?.contains(Element)
      }}>
      <DropdownTrigger>
        <Button isIconOnly>
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
        <DropdownItem key="re-schedule" className="p-0" closeOnSelect>
          <Button
            variant="solid"
            color="primary"
            size="sm"
            radius="md"
            fullWidth>
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
        <ButtonGroup variant="solid" color="primary" size="sm" radius="md">
          <Button
            as={Link}
            to={`/event-session/${eventId}`}
            title="Start Session">
            <Link to={`/event-session/${eventId}`}>Start live session</Link>
          </Button>
          <ScheduleSessionButton scheduleModal={scheduleModal} />
        </ButtonGroup>

        <ScheduleEventButtonWithModal
          id="gamma"
          showLabel={false}
          disclosure={scheduleModal}
        />
      </>
    )
  }

  if (permissions.canUpdateMeeting) {
    return <ScheduleEventButtonWithModal id="beta" />
  }

  if (eventStatus === EventStatus.SCHEDULED) {
    return (
      <Button as={Link} to={`/event-session/${eventId}`} title="Join Session">
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
  const { permissions } = useEventPermissions()

  if (!permissions.canAccessSession) {
    return null
  }

  return <ActionButton eventId={eventId} eventStatus={eventStatus} />
}
