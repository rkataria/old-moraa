import { Chip } from '@nextui-org/react'
import { useNavigate } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoIosArrowBack } from 'react-icons/io'

import { PublishButton } from './PublishButton'
import { AddParticipantsButtonWithModal } from '../common/AddParticipantsButtonWithModal'
import { HelpButton } from '../common/HelpButton'
import { PreviewSwitcher } from '../common/PreviewSwitcher'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { ScheduleEventButtonWithModal } from '../common/ScheduleEventButtonWithModal'
import { Tooltip } from '../common/ShortuctTooltip'
import { AIChatbotToggleButton } from '../common/StudioLayout/AIChatbotToggleButton'
import { SessionActionButton } from '../common/StudioLayout/SessionActionButton'
import { Button } from '../ui/Button'

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
  const navigate = useNavigate()

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
      <HelpButton />
      <AddParticipantsButtonWithModal eventId={event.id} />
      <RenderIf
        isTrue={
          event.status !== EventStatus.DRAFT && permissions.canUpdateFrame
        }>
        <ScheduleEventButtonWithModal
          buttonProps={{
            variant: 'bordered',
            className: 'border-1',
          }}
          showLabel
          id="re-schedule"
          actionButtonLabel="Re-schedule"
        />
      </RenderIf>

      <SessionActionButton eventId={event.id} eventStatus={event.status} />
      <PublishButton
        eventStatus={event.status}
        eventId={event.id}
        refetchEvent={refetchEvent}
      />
      <PreviewSwitcher />
    </>
  )

  if (!event) return null

  return (
    <div className="h-full p-2">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-start gap-2">
          <Tooltip label="Back to dashboard">
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onClick={() => navigate({ to: '/events' })}>
              <IoIosArrowBack size={16} />
            </Button>
          </Tooltip>
          <div className="flex items-center gap-6">
            <span className="font-medium">{event?.name}</span>
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
        </div>

        <div className="flex items-center justify-start h-full gap-2">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  )
}
