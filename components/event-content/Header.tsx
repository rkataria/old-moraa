import { useContext, useEffect } from 'react'

import axios from 'axios'
import { ChevronDownIcon } from 'lucide-react'
import Link from 'next/link'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
  Image,
} from '@nextui-org/react'

import { AddParticipantsButtonWithModal } from '../common/AddParticipantsButtonWithModal'
import { PreviewSwitcher } from '../common/PreviewSwitcher'
import { ScheduleEventButtonWithModal } from '../common/ScheduleEventButtonWithModal'
import { AIChatbotToggleButton } from '../common/StudioLayout/AIChatbotToggleButton'

import { EventContext } from '@/contexts/EventContext'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventStatus } from '@/services/types/enums'
import { type EventContextType } from '@/types/event-context.type'

export function Header({
  event,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any
}) {
  const { isOwner, preview } = useContext(EventContext) as EventContextType
  const scheduleModal = useDisclosure()
  const {
    resizableRightSidebarVisiblity,
    rightSidebarVisiblity,
    setResizableRightSidebarVisiblity,
    setRightSidebarVisiblity,
  } = useStudioLayout()

  const toggleAISidebar = () => {
    setResizableRightSidebarVisiblity(
      resizableRightSidebarVisiblity === 'ai-chat' ? null : 'ai-chat'
    )
  }

  const toggleNotesSidebar = () => {
    setRightSidebarVisiblity(
      rightSidebarVisiblity === 'frame-notes' ? null : 'frame-notes'
    )
  }

  useHotkeys('a', toggleAISidebar, [rightSidebarVisiblity, isOwner])
  useHotkeys('n', toggleNotesSidebar, [rightSidebarVisiblity, isOwner])

  const renderActionButtons = () => {
    if (preview) return null

    if (!isOwner) {
      return (
        <Link href={`/event-session/${event.id}`}>
          <Button title="Start Session" color="primary" size="sm" radius="md">
            Join live session
          </Button>
        </Link>
      )
    }

    return (
      <>
        <div className="flex items-center">
          <AIChatbotToggleButton />
          <AddParticipantsButtonWithModal eventId={event.id} />
        </div>

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
              <DropdownMenu
                className="p-0"
                closeOnSelect={false}
                onAction={(key) => {
                  if (key === 're-schedule') {
                    scheduleModal.onOpen()
                  }
                }}>
                <DropdownItem key="re-schedule" className="p-0" closeOnSelect>
                  <Button
                    variant="solid"
                    color="primary"
                    size="sm"
                    radius="md"
                    fullWidth>
                    Re-schedule event
                  </Button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        ) : null}

        <ScheduleEventButtonWithModal
          eventId={event.id}
          showLabel={event?.status !== EventStatus.SCHEDULED}
          disclosure={scheduleModal}
        />
      </>
    )
  }

  const getCheck = async () => {
    const res = await axios.get('/.well-known/vercel/overrides-flags')
    console.log('res', res)
  }

  useEffect(() => {
    getCheck()
  }, [])

  if (!event) return null

  return (
    <div className="h-full p-2">
      <div className="flex justify-between items-center h-12 w-full">
        <div className="flex justify-start items-center gap-3">
          {/* <Link href="/events">
            <Image src="/logo-icon-square.svg" />
          </Link> */}
          <Image src="/logo-icon-square.svg" />
          <span className="font-medium">{event?.name}</span>
        </div>
        <div className="flex justify-start items-center gap-2 h-full">
          {renderActionButtons()}
          {isOwner && <PreviewSwitcher />}
        </div>
      </div>
    </div>
  )
}
