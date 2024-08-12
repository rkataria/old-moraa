import { useContext } from 'react'

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
          <Button variant="solid" color="primary" radius="md" fullWidth>
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
        <ButtonGroup
          variant="solid"
          color="secondary"
          size="md"
          radius="md"
          className="shadow-md">
          <Button
            as={Link}
            to={`/event-session/${eventId}`}
            title="Start Session">
            <Link to={`/event-session/${eventId}`}>Start live session</Link>
          </Button>
          <ScheduleSessionButton scheduleModal={scheduleModal} />
        </ButtonGroup>

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
        variant="solid"
        radius="md"
        color="secondary"
        as={Link}
        to={`/event-session/${eventId}`}
        className="shadow-md"
        title="Join Session">
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
  const { preview } = useContext(EventContext) as EventContextType

  const { permissions } = useEventPermissions()

  if (!permissions.canAccessSession) {
    return null
  }
  console.log(preview)
  if (!preview) return null

  return <ActionButton eventId={eventId} eventStatus={eventStatus} />
}
