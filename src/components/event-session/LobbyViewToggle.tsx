import { useContext } from 'react'

import { LuGalleryVertical } from 'react-icons/lu'

import { ControlButton } from '../common/ControlButton'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function LobbyViewToggle() {
  const { setEventSessionMode } = useContext(
    EventSessionContext
  ) as EventSessionContextType

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
        setEventSessionMode('Lobby')
      }}>
      <LuGalleryVertical size={20} />
    </ControlButton>
  )
}
