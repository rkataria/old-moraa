import { useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'

import { ControlButton } from '../common/ControlButton'
import { UsersIcon } from '../svg'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  closeRightSidebarAction,
  setRightSidebarAction,
} from '@/stores/slices/layout/live.slice'
import { cn, KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

type ParticipantsToggleProps = {
  showLabel?: boolean
}

export function ParticipantsToggle({ showLabel }: ParticipantsToggleProps) {
  const { rightSidebarMode } = useStoreSelector((state) => state.layout.live)
  const areParticipantsWaitingInLobby = useDyteSelector(
    (state) => !!state.participants.waitlisted.size
  )
  const { dyteStates, setDyteStates } = useEventSession()
  const dispatch = useStoreDispatch()

  const handleToggle = () => {
    if (rightSidebarMode === 'participants') {
      dispatch(closeRightSidebarAction())
      setDyteStates({
        ...dyteStates,
        sidebar: null,
      })
    } else {
      setDyteStates({
        activeSidebar: true,
        sidebar: 'participants',
      })
      dispatch(setRightSidebarAction('participants'))
    }
  }

  useHotkeys('p', handleToggle, liveHotKeyProps)

  const isParticipantsSidebarOpen = rightSidebarMode === 'participants'

  return (
    <ControlButton
      buttonProps={{
        size: 'sm',
        variant: 'light',
        isIconOnly: !showLabel,
        disableRipple: true,
        disableAnimation: true,
        className: cn('live-button', {
          active: isParticipantsSidebarOpen,
        }),
        startContent: (
          <UsersIcon
            filled={isParticipantsSidebarOpen || areParticipantsWaitingInLobby}
            className={cn({
              'animate-pulse text-red-500': areParticipantsWaitingInLobby,
            })}
          />
        ),
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.participants.label,
        actionKey: KeyboardShortcuts.Live.participants.key,
      }}
      onClick={handleToggle}>
      {showLabel ? 'People' : null}
    </ControlButton>
  )
}
