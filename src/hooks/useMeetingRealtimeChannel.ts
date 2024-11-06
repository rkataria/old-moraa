import { useEffect } from 'react'

import { RealtimeChannel } from '@supabase/supabase-js'

import { useBreakoutRooms } from './useBreakoutRooms'

import { useEventContext } from '@/contexts/EventContext'
import { supabaseClient } from '@/utils/supabase/client'

let meetingRealtimeChannel: RealtimeChannel | null

export const useMeetingRealtimeChannel = () => {
  const { eventId } = useEventContext()
  const { currentMeetingId } = useBreakoutRooms()

  useEffect(() => {
    meetingRealtimeChannel = supabaseClient
      .channel(`event:${eventId}:dyte-meeting:${currentMeetingId}`, {
        config: { broadcast: { self: true } },
      })
      .subscribe()

    return () => {
      meetingRealtimeChannel?.unsubscribe()
    }
  }, [eventId, currentMeetingId])

  return {
    meetingRealtimeChannel,
  }
}
