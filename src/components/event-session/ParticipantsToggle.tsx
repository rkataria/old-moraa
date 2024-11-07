import { ButtonGroup } from '@nextui-org/button'
import { useParams } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'
import { LuUserPlus2 } from 'react-icons/lu'

import { AddParticipantsButtonWithModal } from '../common/AddParticipantsButtonWithModal'
import { ControlButton } from '../common/ControlButton'

import { useEventSession } from '@/contexts/EventSessionContext'
import { cn, KeyboardShortcuts } from '@/utils/utils'

export function ParticipantsToggle({
  isParticipantsSidebarOpen,
  onClick,
}: {
  isParticipantsSidebarOpen: boolean
  onClick: () => void
}) {
  const { isHost } = useEventSession()
  const { eventId } = useParams({ strict: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleShortCut = (e: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return
    onClick()
  }
  useHotkeys('p', handleShortCut)

  return (
    <ButtonGroup className="live-button rounded-md">
      <ControlButton
        buttonProps={{
          size: 'sm',
          className: cn('live-button rounded-r-none', {
            active: isParticipantsSidebarOpen,
          }),
        }}
        tooltipProps={{
          label: KeyboardShortcuts.Live.participants.label,
          actionKey: KeyboardShortcuts.Live.participants.key,
        }}
        onClick={onClick}>
        People
      </ControlButton>
      {isHost && (
        <AddParticipantsButtonWithModal
          eventId={eventId!}
          triggerButtonProps={{
            isIconOnly: true,
            className: 'bg-gray-100 hover:bg-gray-200 rounded-l-none',
            children: <LuUserPlus2 />,
          }}
        />
      )}
    </ButtonGroup>
  )
}
