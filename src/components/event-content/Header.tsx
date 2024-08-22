import { useContext } from 'react'

import { useNavigate } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoIosArrowBack } from 'react-icons/io'

import { AddParticipantsButtonWithModal } from '../common/AddParticipantsButtonWithModal'
import { Toolbars } from '../common/content-types/MoraaSlide/Toolbars'
import { HelpButton } from '../common/HelpButton'
import { PreviewSwitcher } from '../common/PreviewSwitcher'
import { Tooltip } from '../common/ShortuctTooltip'
import { SessionActionButton } from '../common/StudioLayout/SessionActionButton'
import { Button } from '../ui/Button'

import { EventContext } from '@/contexts/EventContext'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { type EventContextType } from '@/types/event-context.type'
import { ContentType } from '@/utils/content.util'

export function Header({
  event,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any
}) {
  const navigate = useNavigate()
  const { isOwner, preview, currentFrame } = useContext(
    EventContext
  ) as EventContextType
  const { rightSidebarVisiblity, setRightSidebarVisiblity } = useStudioLayout()

  const toggleNotesSidebar = () => {
    setRightSidebarVisiblity(
      rightSidebarVisiblity === 'frame-notes' ? null : 'frame-notes'
    )
  }

  useHotkeys('n', toggleNotesSidebar, [rightSidebarVisiblity])

  const renderActionButtons = () => (
    <>
      <AddParticipantsButtonWithModal eventId={event.id} />
      <SessionActionButton eventId={event.id} eventStatus={event.status} />
      <PreviewSwitcher />
      <HelpButton />
    </>
  )

  if (!event) return null

  const editable = isOwner && !preview

  return (
    <div className="h-full px-3 py-1">
      <div className="flex items-center justify-between w-full h-12">
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

          <span className="font-medium">{event?.name}</span>
        </div>
        {editable && currentFrame?.type === ContentType.MORAA_SLIDE && (
          <Toolbars />
        )}
        <div className="flex items-center justify-start h-full gap-2">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  )
}
