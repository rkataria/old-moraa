import { useContext } from 'react'

import { ChevronDownIcon, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go'

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
import { EditEventButtonWithModal } from '../common/PublishEventButtonWithModal'
import { ScheduleEventButtonWithModal } from '../common/ScheduleEventButtonWithModal'

import { EventContext } from '@/contexts/EventContext'
import { EventStatus } from '@/services/types/enums'
import { type EventContextType } from '@/types/event-context.type'

export function Header({
  event,
  leftSidebarVisible,
  onLeftSidebarToggle,
  onAiChatOverlayToggle,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any
  leftSidebarVisible: boolean
  onLeftSidebarToggle: (value: boolean) => void
  onAiChatOverlayToggle: () => void
}) {
  const { isOwner, preview } = useContext(EventContext) as EventContextType

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
          onClick={onAiChatOverlayToggle}
          className="flex justify-center items-center transition-all duration-200 cursor-pointer font-normal text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 !rounded-full p-3">
          <Sparkles />
        </Button>
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
          <Button
            isIconOnly
            variant="light"
            onClick={() => onLeftSidebarToggle(!leftSidebarVisible)}>
            {leftSidebarVisible ? (
              <GoSidebarCollapse size={24} className="rotate-180" />
            ) : (
              <GoSidebarExpand size={24} className="rotate-180" />
            )}
          </Button>
          <span className="font-bold">{event?.name}</span>
          {!preview && isOwner && (
            <EditEventButtonWithModal eventId={event.id} />
          )}
          {isOwner && <PreviewSwitcher />}
        </div>
        <div className="flex justify-start items-center gap-2 bg-white px-2 h-full">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  )
}
