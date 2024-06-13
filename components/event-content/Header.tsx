import { useContext } from 'react'

import { ChevronDownIcon, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useHotkeys } from 'react-hotkeys-hook'
import { LuClipboardEdit } from 'react-icons/lu'
import { MdArrowBack } from 'react-icons/md'

import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'

import { AddParticipantsButtonWithModal } from '../common/AddParticipantsButtonWithModal'
import { PreviewSwitcher } from '../common/PreviewSwitcher'
import { ScheduleEventButtonWithModal } from '../common/ScheduleEventButtonWithModal'

import { EventContext } from '@/contexts/EventContext'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventStatus } from '@/services/types/enums'
import { type EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function Header({
  event,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any
}) {
  const { isOwner, preview } = useContext(EventContext) as EventContextType
  const { rightSidebarVisiblity, setRightSidebarVisiblity } = useStudioLayout()

  const toggleAISidebar = () => {
    setRightSidebarVisiblity(
      rightSidebarVisiblity === 'ai-chat' ? null : 'ai-chat'
    )
  }

  const toggleNotesSidebar = () => {
    setRightSidebarVisiblity(rightSidebarVisiblity === 'notes' ? null : 'notes')
  }

  useHotkeys('a', toggleAISidebar, [rightSidebarVisiblity, isOwner])
  useHotkeys('n', toggleNotesSidebar, [rightSidebarVisiblity, isOwner])

  const renderActionButtons = () => {
    if (preview) return null

    if (!isOwner) {
      return (
        <Link href={`/event-session/${event.id}`}>
          <Button title="Start Session">Join live session</Button>
        </Link>
      )
    }

    return (
      <>
        <Button
          isIconOnly
          radius="full"
          variant="flat"
          className={cn('cursor-pointer', {
            'bg-black text-white': rightSidebarVisiblity === 'ai-chat',
          })}
          onClick={toggleAISidebar}>
          <Sparkles size={18} />
        </Button>
        {isOwner && (
          <Button
            isIconOnly
            onClick={toggleNotesSidebar}
            radius="full"
            variant="flat"
            className={cn('cursor-pointer', {
              'bg-black text-white': rightSidebarVisiblity === 'notes',
            })}>
            <LuClipboardEdit size={20} />
          </Button>
        )}
        {/* <EditEventButtonWithModal eventId={event.id} /> */}
        <AddParticipantsButtonWithModal eventId={event.id} />
        {EventStatus.SCHEDULED === event?.status ? (
          <ButtonGroup variant="solid" color="primary" size="sm" radius="md">
            <Button title="Start Session">
              <Link href={`/event-session/${event.id}`}>
                Start live session
              </Link>
            </Button>
            <Dropdown
              placement="bottom-end"
              closeOnSelect={false}
              shouldCloseOnInteractOutside={(Element) => {
                const wrapperElement = document.getElementById(
                  'schedule-event-form'
                )

                return !wrapperElement?.contains(Element)
              }}>
              <DropdownTrigger>
                <Button isIconOnly>
                  <ChevronDownIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu className="p-0" closeOnSelect={false}>
                <DropdownItem key="merge" className="p-0" closeOnSelect={false}>
                  <ScheduleEventButtonWithModal
                    eventId={event.id}
                    actionButtonLabel="Re-schedule event"
                  />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        ) : (
          <ScheduleEventButtonWithModal eventId={event.id} />
        )}
      </>
    )
  }

  if (!event) return null

  return (
    <div className="h-full p-2 bg-white">
      <div className="flex justify-between items-center h-12 w-full">
        <div className="flex justify-start items-center gap-2">
          <Link href="/events">
            <Button isIconOnly variant="light">
              <MdArrowBack size={18} />
            </Button>
          </Link>
          <span className="font-bold">{event?.name}</span>
          {isOwner && <PreviewSwitcher />}
        </div>
        <div className="flex justify-start items-center gap-2 bg-white px-2 h-full">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  )
}
