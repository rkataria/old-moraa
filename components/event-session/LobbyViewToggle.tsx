import { useContext } from 'react'

import { BiSolidGridAlt } from 'react-icons/bi'
import { LuGalleryVertical } from 'react-icons/lu'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function LobbyViewToggle() {
  const { eventSessionMode, setEventSessionMode } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  return (
    <button
      tabIndex={-1}
      type="button"
      disabled={eventSessionMode === 'Presentation'}
      className={cn(
        'flex flex-col justify-center items-center gap-[5px] w-14 h-10 rounded-sm',
        {
          'bg-transparent text-gray-700': eventSessionMode === 'Presentation',
          'bg-white text-black': eventSessionMode === 'Lobby',
          'bg-black hover:bg-[#1E1E1E] text-white':
            eventSessionMode === 'Preview',
        }
      )}
      style={{
        backgroundColor:
          eventSessionMode === 'Lobby'
            ? 'white'
            : 'var(--dyte-controlbar-button-background-color, rgb(var(--dyte-colors-background-1000, 8 8 8)))',
      }}
      onClick={() => {
        if (eventSessionMode === 'Presentation') return

        if (eventSessionMode === 'Lobby') {
          setEventSessionMode('Preview')
        } else {
          setEventSessionMode('Lobby')
        }
      }}>
      {eventSessionMode === 'Lobby' ? (
        <LuGalleryVertical className="text-2xl" />
      ) : (
        <BiSolidGridAlt className="text-2xl" />
      )}
      {/* <p className="text-xs">
        {eventSessionMode === 'Lobby' ? 'Preview' : 'Lobby'}
      </p> */}
    </button>
  )
}
