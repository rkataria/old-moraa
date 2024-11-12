/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from 'react'

import { Link } from '@nextui-org/react'
import toast from 'react-hot-toast'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useRealtimeChannel } from '@/contexts/RealtimeChannelContext'

export function useAskForHelp() {
  const { eventRealtimeChannel } = useRealtimeChannel()
  const { breakoutRoomsInstance } = useBreakoutManagerContext()
  const { isHost } = useEventSession()

  useEffect(() => {
    if (!isHost || !breakoutRoomsInstance || !eventRealtimeChannel) return

    eventRealtimeChannel.on(
      'broadcast',
      {
        event: 'breakout-ask-for-help',
      },
      (event) => {
        if (!event.payload.meetingId) return

        toast(
          <div className="flex items-center justify-center">
            <p>
              {event.payload.userName} asked for help from breakout room,{' '}
              <Link
                href="#"
                className="contents"
                size="sm"
                onClick={() =>
                  breakoutRoomsInstance?.joinRoom(event.payload.meetingId)
                }>
                Join Room.
              </Link>
            </p>
          </div>,
          { duration: 1000 * 60 }
        )
      }
    )
  }, [breakoutRoomsInstance, eventRealtimeChannel, isHost])

  return null
}
