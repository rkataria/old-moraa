import { useRouter } from '@tanstack/react-router'

import { ScheduleEventButtonWithModal } from '../ScheduleEventButtonWithModal'

import { Button } from '@/components/ui/Button'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventStatus } from '@/types/enums'

// function ScheduleSessionButton({
//   scheduleModal,
// }: {
//   scheduleModal: UseDisclosureReturn
// }) {
//   const { permissions } = useEventPermissions()

//   if (!permissions.canUpdateMeeting) {
//     return null
//   }

//   return (
//     <Dropdown placement="bottom-end" className="rounded-md">
//       <DropdownTrigger>
//         <Button color="primary" size="sm" isIconOnly className="rounded-s-none">
//           <ChevronDownIcon />
//         </Button>
//       </DropdownTrigger>
//       <DropdownMenu
//         className="p-0"
//         onAction={(key) => {
//           if (key === 're-schedule') {
//             scheduleModal.onOpen()
//           }
//         }}>
//         <DropdownItem
//           key="re-schedule"
//           className="p-2 rounded-md h-8 bg-gray-100 hover:bg-gray-200"
//           closeOnSelect>
//           Re-schedule event
//         </DropdownItem>
//       </DropdownMenu>
//     </Dropdown>
//   )
// }

function ActionButton({
  eventId,
  eventStatus,
}: {
  eventId: string
  eventStatus: string
}) {
  const router = useRouter()

  const { permissions } = useEventPermissions()

  if (
    permissions.canAcessAllSessionControls &&
    eventStatus === EventStatus.ACTIVE
  ) {
    return (
      <Button
        color="primary"
        onClick={() => router.navigate({ to: `/event-session/${eventId}` })}
        size="sm"
        title="Start session">
        Start live session
      </Button>
    )
  }

  if (permissions.canUpdateMeeting && eventStatus === EventStatus.DRAFT) {
    return <ScheduleEventButtonWithModal id="schedule" />
  }

  if (eventStatus === EventStatus.ACTIVE) {
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
  const { permissions } = useEventPermissions()

  if (!permissions.canAccessSession) {
    return null
  }

  return <ActionButton eventId={eventId} eventStatus={eventStatus} />
}
