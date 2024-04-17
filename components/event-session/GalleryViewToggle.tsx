import { useContext } from 'react'

import { BiSolidGridAlt } from 'react-icons/bi'
import { LuGalleryVertical } from 'react-icons/lu'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function GalleryViewToggle() {
  const { eventSessionMode, setEventSessionMode } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  return (
    <button
      tabIndex={-1}
      disabled={eventSessionMode === 'Presentation'}
      type="button"
      onClick={() => {
        if (eventSessionMode === 'Presentation') return

        if (eventSessionMode === 'Lobby') {
          setEventSessionMode('Preview')
        } else {
          setEventSessionMode('Lobby')
        }
      }}
      className={cn(
        'flex flex-col items-center gap-[5px] p-1 w-[84px] rounded-sm',
        {
          'bg-transparent text-gray-700': eventSessionMode === 'Presentation',
          'bg-white text-black': eventSessionMode === 'Lobby',
          'bg-black hover:bg-[#1E1E1E] text-white':
            eventSessionMode === 'Preview',
        }
      )}>
      {eventSessionMode === 'Lobby' ? (
        <LuGalleryVertical className="text-2xl" />
      ) : (
        <BiSolidGridAlt className="text-2xl" />
      )}
      <p className="text-xs">
        {eventSessionMode === 'Lobby' ? 'Preview' : 'Gallery View'}
      </p>
    </button>
  )
}
