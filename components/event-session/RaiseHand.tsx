import { useContext, useEffect, useState } from 'react'

import { sendNotification } from '@dytesdk/react-ui-kit'
import DyteClient from '@dytesdk/web-core'
import { HiOutlineHandRaised } from 'react-icons/hi2'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function RaiseHand({
  meeting,
  isHost,
}: {
  meeting: DyteClient
  isHost: boolean
}) {
  const { handRaisedHandler } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const [isHandRaised, setIsHandRaised] = useState(false)

  const raiseHand = async () => {
    setIsHandRaised(!isHandRaised)
    handRaisedHandler(meeting.self.id)
    if (isHandRaised) {
      return
    }
    await meeting.participants.broadcastMessage('hand-raise', {
      id: meeting.self.id,
      name: meeting.self.name,
    })
  }

  useEffect(() => {
    if (!meeting) return
    meeting.participants.on(
      'broadcastedMessage',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ payload }: { payload: any }) => {
        if (!payload.id) return
        const notificationObj = {
          id: new Date().getTime().toString(),
          message: `Hand Raised by ${payload.name}`,
          duration: 5000,
        }
        sendNotification(notificationObj, 'message')
      }
    )

    // eslint-disable-next-line consistent-return
    return () => {
      meeting.participants.removeAllListeners('broadcastedMessage')
    }
  }, [meeting])

  if (isHost) return null

  return (
    <button
      type="button"
      onClick={raiseHand}
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
