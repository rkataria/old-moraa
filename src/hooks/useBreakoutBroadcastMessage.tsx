import { useEffect } from 'react'

import toast from 'react-hot-toast'
import { IoClose } from 'react-icons/io5'

import { useBreakoutRooms } from './useBreakoutRooms'

import { useRealtimeChannel } from '@/contexts/RealtimeChannelContext'

export const useBreakoutBroadcastMessage = () => {
  const { eventRealtimeChannel } = useRealtimeChannel()
  const { currentMeetingId } = useBreakoutRooms()

  useEffect(() => {
    if (!eventRealtimeChannel || !currentMeetingId) return

    eventRealtimeChannel.on(
      'broadcast',
      { event: 'broadcast-breakout-message' },
      (event) => {
        if (
          (event.payload.meetIds || []).includes(currentMeetingId) &&
          event.payload.message
        ) {
          toast(
            ({ id }) => (
              <div className="flex items-center justify-center">
                <p>
                  <span className="font-bold">From Host:</span>{' '}
                  {event.payload.message}
                </p>
                <IoClose
                  className="m-2 cursor-pointer text-xl"
                  onClick={() => toast.dismiss(id)}
                />
              </div>
            ),
            { duration: 1000 * 60, position: 'bottom-right' }
          )
          // const dyteNotificationObject = {
          //   id: new Date().getTime().toString(),
          //   message: `From Host: ${event.payload.message}`,
          //   duration: 1000 * 60,
          // }

          // sendNotification(dyteNotificationObject, 'message')
        }
      }
    )
  }, [eventRealtimeChannel, currentMeetingId])
}
