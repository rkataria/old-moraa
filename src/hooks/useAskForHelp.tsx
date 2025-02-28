/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from 'react'

import { Link } from '@heroui/react'
import toast from 'react-hot-toast'
import { IoClose } from 'react-icons/io5'

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
          ({ id }) => (
            <div className="flex items-center justify-center">
              <p>
                {event.payload.userName} asked for help from breakout room,{' '}
                <Link
                  href="#"
                  className="contents"
                  size="sm"
                  onClick={() => {
                    breakoutRoomsInstance?.joinRoom(event.payload.meetingId)
                    setTimeout(() => {
                      toast.dismiss(id)
                    }, 3000)
                  }}>
                  Join Room.
                </Link>
              </p>
              <IoClose
                className="m-2 cursor-pointer text-xl"
                onClick={() => toast.dismiss(id)}
              />
            </div>
          ),
          { duration: 1000 * 60, position: 'bottom-right' }
        )
      }
    )
  }, [breakoutRoomsInstance, eventRealtimeChannel, isHost])

  return null
}
