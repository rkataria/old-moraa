/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'
import { useIdle } from '@uidotdev/usehooks'
import useSound from 'use-sound'

import { useEventSession } from '@/contexts/EventSessionContext'
import useCountdown from '@/hooks/useCountdown'

export function IdleModeConfirmation() {
  const { isHost } = useEventSession()
  const { meeting } = useDyteMeeting()
  const joinedParticipants = useDyteSelector((m) => m.participants.joined)
  const [playSwitchOnSound] = useSound('/switch-on.mp3', {
    volume: 1,
  })
  const [open, setOpen] = useState(true)
  const idle = useIdle(1000 * 60 * 10)

  useEffect(() => {
    if (!open) {
      setOpen(idle)
    }
  }, [idle, open])

  if (!idle) return null

  const isOnlyHostInMeeting = isHost && joinedParticipants.size === 0

  if (!isOnlyHostInMeeting) return null

  const leaveMeeting = () => {
    meeting.leave()
  }

  playSwitchOnSound()

  return (
    <Modal size="md" isOpen={open} onClose={() => setOpen(false)}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Idle Mode</ModalHeader>
            <ModalBody>
              <p className="pb-4">
                You have been idle for 10 minutes. If you don't respond, you
                will be disconnected from the meeting in{' '}
                <Countdown
                  onEnd={() => {
                    leaveMeeting()
                    setOpen(false)
                  }}
                />{' '}
                secs.
              </p>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

function Countdown({ onEnd }: { onEnd: () => void }) {
  const { seconds, startCountdown } = useCountdown(30, onEnd)

  useEffect(() => {
    startCountdown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <b>{seconds}</b>
}
