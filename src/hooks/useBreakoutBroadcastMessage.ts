import { useEffect } from 'react'

import { sendNotification } from '@dytesdk/react-ui-kit'

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
          const dyteNotificationObject = {
            id: new Date().getTime().toString(),
            message: `From Host: ${event.payload.message}`,
            duration: 1000 * 60,
          }

          sendNotification(dyteNotificationObject, 'message')
        }
      }
    )
  }, [eventRealtimeChannel, currentMeetingId])
}
