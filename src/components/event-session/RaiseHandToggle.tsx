import { useContext, useEffect, useState } from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { useDebounce } from '@uidotdev/usehooks'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoHandRight, IoHandRightOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn, KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

export function RaiseHandToggle() {
  const { meeting } = useDyteMeeting()
  const selfParticipant = useDyteSelector((m) => m.self)
  const [selfSpeaker, setSelfSpeaker] = useState('')
  const { activeSession, onToggleHandRaised, participant } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const isHandRaised = activeSession?.handsRaised?.includes(selfParticipant.id)

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

  const handleRaiseHand = () => {
    onToggleHandRaised({
      handRaise: !isHandRaised,
      participantId: selfParticipant.id,
      participantName: selfParticipant.name,
    })
  }

  useHotkeys(
    KeyboardShortcuts.Live.raiseAndLowerHand.key,
    handleRaiseHand,
    [isHandRaised, selfParticipant],
    liveHotKeyProps
  )

  if (!participant) return null

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        size: 'sm',
        variant: 'flat',
        className: cn('live-button', {
          '!text-yellow-500 hover:!text-yellow-500': isHandRaised,
        }),
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.raiseAndLowerHand.label,
        actionKey: KeyboardShortcuts.Live.raiseAndLowerHand.key,
      }}
      onClick={handleRaiseHand}>
      {isHandRaised ? (
        <IoHandRight size={20} />
      ) : (
        <IoHandRightOutline size={20} />
      )}
    </ControlButton>
  )
}
