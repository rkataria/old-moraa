import { useContext } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { HiOutlineHandRaised } from 'react-icons/hi2'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function RaiseHand() {
  const selfParticipant = useDyteSelector((m) => m.self)
  const { isHost, activeSession, onToggleHandRaised, participant } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  if (isHost || !participant) return null

  const isHandRaised = activeSession?.data?.handsRaised?.includes(
    selfParticipant.id
  )

  return (
    <button
      type="button"
      onClick={() =>
        onToggleHandRaised({
          handRaise: !isHandRaised,
          participantId: selfParticipant.id,
          participantName: selfParticipant.name,
        })
      }
      className={cn(
        'flex flex-col items-center gap-[5px] p-1 w-[84px] rounded-sm',
        {
          'bg-white text-black': isHandRaised,
          'hover:bg-[#1E1E1E] text-white': !isHandRaised,
        }
      )}>
      <HiOutlineHandRaised className="text-2xl" />
      <p className="text-xs">{isHandRaised ? 'Hand Raised' : 'Raise Hand'}</p>
    </button>
  )
}
