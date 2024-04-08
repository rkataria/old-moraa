import { useContext, useEffect, useState } from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { useDebounce } from '@uidotdev/usehooks'
import { HiOutlineHandRaised } from 'react-icons/hi2'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function RaiseHand() {
  const { meeting } = useDyteMeeting()
  const selfParticipant = useDyteSelector((m) => m.self)
  const [selfSpeaker, setSelfSpeaker] = useState('')
  const { activeSession, onToggleHandRaised, participant } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const isHandRaised = activeSession?.data?.handsRaised?.includes(
    selfParticipant.id
  )

  const debouncedSelfSpeaker = useDebounce(selfSpeaker, 200)

  useEffect(() => {
    if (!debouncedSelfSpeaker) return
    onToggleHandRaised({
      handRaise: false,
      participantId: selfParticipant.id,
      participantName: selfParticipant.name,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSelfSpeaker])

  useEffect(() => {
    const handleActiveSpeaker = (speaker: { peerId: string }) => {
      if (speaker.peerId === selfParticipant.id && isHandRaised) {
        setSelfSpeaker(`${speaker.peerId} ${Math.random()}`)
      }
    }
    meeting.participants.on('activeSpeaker', handleActiveSpeaker)
  }, [meeting.participants, isHandRaised, selfParticipant.id])

  if (!participant) return null

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
      <p className="text-xs">{isHandRaised ? 'Lower hand' : 'Raise Hand'}</p>
    </button>
  )
}
