import { useContext } from 'react'

import Link from 'next/link'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoMdArrowBack } from 'react-icons/io'

import { Button, Image } from '@nextui-org/react'

import { AddParticipantsButtonWithModal } from '../common/AddParticipantsButtonWithModal'
import { Toolbars } from '../common/content-types/MoraaSlide/Toolbars'
import { PreviewSwitcher } from '../common/PreviewSwitcher'
import { AIChatbotToggleButton } from '../common/StudioLayout/AIChatbotToggleButton'
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

  const renderActionButtons = () => {
    if (preview) return null

    return (
      <>
        <div className="flex items-center">
          <AIChatbotToggleButton />
          <AddParticipantsButtonWithModal eventId={event.id} />
        </div>

        <SessionActionButton eventId={event.id} eventStatus={event.status} />
      </>
    )
  }

  if (!event) return null

  const editable = isOwner && !preview

  return (
    <div className="h-full p-2">
      <div className="flex justify-between items-center h-12 w-full">
        <div className="flex justify-start items-center gap-3">
          <Link href="/events">
            <Button className="!bg-transparent px-0">
              <IoMdArrowBack />
              Back
            </Button>
          </Link>
          <Link href="/events">
            <Image src="/logo-icon-square.svg" />
          </Link>
          <span className="font-medium">{event?.name}</span>
        </div>
        {editable && currentFrame?.type === ContentType.MORAA_SLIDE && (
          <Toolbars />
        )}
        <div className="flex justify-start items-center gap-2 h-full">
          {renderActionButtons()}
          <PreviewSwitcher />
        </div>
      </div>
    </div>
  )
}
