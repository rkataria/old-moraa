import { useContext } from 'react'

import { Button } from '@nextui-org/button'
import { Link } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoIosArrowBack } from 'react-icons/io'

import { AddParticipantsButtonWithModal } from '../common/AddParticipantsButtonWithModal'
import { Toolbars } from '../common/content-types/MoraaSlide/Toolbars'
import { PreviewSwitcher } from '../common/PreviewSwitcher'
import { SessionActionButton } from '../common/StudioLayout/SessionActionButton'

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
    </>
  )

  if (!event) return null

  const editable = isOwner && !preview

  return (
    <div className="h-full p-2">
      <div className="flex items-center justify-between w-full h-12">
        <div className="flex items-center justify-start gap-1">
          <Link to="/events">
            <Button isIconOnly variant="light">
              <IoIosArrowBack size={20} />
            </Button>
          </Link>
          <span className="font-medium">{event?.name}</span>
        </div>
        {editable && currentFrame?.type === ContentType.MORAA_SLIDE && (
          <Toolbars />
        )}
        <div className="flex items-center justify-start h-full gap-1">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  )
}
