import { Chip } from '@heroui/react'
import { useRouter } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'

import { PublishButton } from './PublishButton'
import { AddParticipantsButtonWithModal } from '../common/AddParticipantsButtonWithModal'
import { MoraaLogo } from '../common/MoraaLogo'
import { PreviewSwitcher } from '../common/PreviewSwitcher'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { AIChatbotToggleButton } from '../common/StudioLayout/AIChatbotToggleButton'
import { SessionActionButton } from '../common/StudioLayout/SessionActionButton'

import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { getStatusColor } from '@/utils/event.util'

export function Header({
  event,
  refetchEvent,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetchEvent: any
}) {
  const router = useRouter()
  const { rightSidebarVisiblity, setRightSidebarVisiblity } = useStudioLayout()

  const { permissions } = useEventPermissions()

  const toggleNotesSidebar = () => {
    setRightSidebarVisiblity(
      rightSidebarVisiblity === 'frame-notes' ? null : 'frame-notes'
    )
  }

  useHotkeys('n', toggleNotesSidebar, [rightSidebarVisiblity])

  const renderActionButtons = () => (
    <>
      <AddParticipantsButtonWithModal />
      <AIChatbotToggleButton />

      <SessionActionButton eventId={event.id} eventStatus={event.status} />
      <PublishButton
        eventStatus={event.status}
        eventId={event.id}
        refetchEvent={refetchEvent}
      />
    </>
  )

  if (!event) return null

  return (
    <div className="flex items-center justify-between w-full h-full px-6 bg-white border-b">
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
        <div className="border-r-0 border-gray-200 font-semibold flex justify-start items-center gap-2 overflow-hidden">
          <span className="font-medium text-base whitespace-nowrap overflow-hidden text-ellipsis max-w-[28vw]">
            {event?.name}
          </span>
          <RenderIf isTrue={permissions.canUpdateFrame}>
            <Chip
              variant="dot"
              size="sm"
              className="rounded-lg border-1"
              color={getStatusColor(event.status)}>
              {event.status}
            </Chip>
          </RenderIf>
        </div>
      </div>

      <div className="flex justify-center">
        <PreviewSwitcher />
      </div>

      <div className="flex items-center justify-end h-full gap-3 flex-1">
        {renderActionButtons()}
      </div>
    </div>
  )
}
