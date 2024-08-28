import { LuGalleryVertical } from 'react-icons/lu'

import { ControlButton } from '../common/ControlButton'

import { useStoreDispatch } from '@/hooks/useRedux'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import { EventSessionMode } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function LobbyViewToggle() {
  const dispatch = useStoreDispatch()

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        variant: 'flat',
        className: cn('bg-black text-white transition-all duration-300'),
      }}
      tooltipProps={{
        content: 'Toggle Lobby View',
      }}
      onClick={() => {
        dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
      }}>
      <LuGalleryVertical size={20} />
    </ControlButton>
  )
}
