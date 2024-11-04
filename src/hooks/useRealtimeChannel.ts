import { useEffect } from 'react'

import { RealtimeChannel } from '@supabase/realtime-js'

import { useBreakoutRooms } from './useBreakoutRooms'

import { useEventContext } from '@/contexts/EventContext'
import { supabaseClient } from '@/utils/supabase/client'

let realtimeChannel: RealtimeChannel | null

export const useRealtimeChannel = () => {
  const { eventId } = useEventContext()
  const { isBreakoutActive, currentMeetingId } = useBreakoutRooms()

  useEffect(() => {
    realtimeChannel = supabaseClient
      .channel(
        `event:${eventId}${isBreakoutActive ? `-breakout-${currentMeetingId}` : ''}`,
        {
          config: { broadcast: { self: true } },
        }
      )
      .subscribe()

    return () => {
      realtimeChannel?.unsubscribe()
    }
  }, [eventId, currentMeetingId, isBreakoutActive])

  return {
    realtimeChannel,
  }
}
