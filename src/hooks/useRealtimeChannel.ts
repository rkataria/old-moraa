import { useEffect } from 'react'

import { RealtimeChannel } from '@supabase/realtime-js'

import { useEventContext } from '@/contexts/EventContext'
import { supabaseClient } from '@/utils/supabase/client'

let realtimeChannel: RealtimeChannel | null

export const useRealtimeChannel = () => {
  const { eventId } = useEventContext()

  useEffect(() => {
    realtimeChannel = supabaseClient
      .channel(`event:${eventId}`, {
        config: { broadcast: { self: true } },
      })
      .subscribe()

    return () => {
      realtimeChannel?.unsubscribe()
    }
  }, [eventId])

  return {
    realtimeChannel,
  }
}
