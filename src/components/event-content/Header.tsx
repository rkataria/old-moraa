import { Chip } from '@nextui-org/react'
import { useRouter } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'

import { PublishButton } from './PublishButton'
import { StudioTabs } from './StudioTabs'
import { AddParticipantsButtonWithModal } from '../common/AddParticipantsButtonWithModal'
import { Logo } from '../common/Logo'
import { PreviewSwitcher } from '../common/PreviewSwitcher'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { AIChatbotToggleButton } from '../common/StudioLayout/AIChatbotToggleButton'
import { SessionActionButton } from '../common/StudioLayout/SessionActionButton'

import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventStatus } from '@/types/enums'
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
      <AIChatbotToggleButton />
      <PreviewSwitcher />

      {/* <HelpButton /> */}
      <AddParticipantsButtonWithModal eventId={event.id} />
      <RenderIf
        isTrue={
          event.status !== EventStatus.DRAFT && permissions.canUpdateFrame
        }>
        {/* <ScheduleEventButtonWithModal
          buttonProps={{
            variant: 'bordered',
            className: 'border-1',
          }}
          showLabel
          id="re-schedule"
          actionButtonLabel="Re-schedule"
        /> */}
      </RenderIf>

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
    <div className="flex items-center justify-between w-full h-full px-3 bg-transparent">
      <div className="flex justify-end items-center gap-2 h-full">
        <div className="pr-4 border-r-2 border-gray-200">
          <Logo
            onClick={() => router.navigate({ to: '/events' })}
            className="cursor-pointer text-primary"
          />
        </div>
        <div className="pr-4 pl-2 border-r-0 border-gray-200 font-semibold flex justify-start items-center gap-4">
          <span className="font-medium text-base line-clamp-1 max-w-40">
            {event?.name}
          </span>
          <RenderIf isTrue={permissions.canUpdateFrame}>
            <Chip
              variant="flat"
              size="sm"
              className="rounded-lg"
              color={getStatusColor(event.status)}>
              {event.status}
            </Chip>
          </RenderIf>
        </div>
        <StudioTabs />
      </div>

      <div className="flex items-center justify-start h-full gap-2">
        {renderActionButtons()}
      </div>
    </div>
  )
}
