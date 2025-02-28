import { useDisclosure } from '@heroui/react'

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
//           <div className="flex items-center gap-3">
//             <RiCalendarScheduleLine size={19} className="text-gray-600" />
//             Re-schedule event
//           </div>
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
  const scheduleModal = useDisclosure()

  const { permissions } = useEventPermissions()

  if (
    permissions.canAcessAllSessionControls &&
    eventStatus === EventStatus.ACTIVE
  ) {
    return (
      <div className="flex items-center">
        <Button
          color="primary"
          onClick={() => window.open(`/event-session/${eventId}`, '__blank')}
          size="sm"
          title="Start session">
          Start Live session
        </Button>
        <ScheduleEventButtonWithModal
          id="re-schedule"
          showLabel={false}
          disclosure={scheduleModal}
        />
      </div>
    )
  }

  if (permissions.canUpdateMeeting && eventStatus === EventStatus.DRAFT) {
    return <ScheduleEventButtonWithModal id="schedule" />
  }

  if (eventStatus === EventStatus.ACTIVE) {
    return (
      <Button
        color="primary"
        title="Join live session"
        onClick={() => window.open(`/event-session/${eventId}`, '__blank')}>
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
