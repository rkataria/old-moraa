import { createContext, useContext, useEffect, useState } from 'react'

import { RealtimeChannel } from '@supabase/supabase-js'
import { useParams } from '@tanstack/react-router'

import { useStoreSelector } from '@/hooks/useRedux'
import { supabaseClient } from '@/utils/supabase/client'

// Create context for RealtimeChannel
const RealtimeChannelContext = createContext<{
  eventRealtimeChannel: RealtimeChannel | null
  meetingRealtimeChannel: RealtimeChannel | null
}>({ eventRealtimeChannel: null, meetingRealtimeChannel: null })

export function RealtimeChannelProvider({
  children,
}: React.PropsWithChildren<object>) {
  const { eventId } = useParams({ strict: false })
  const currentDyteMeetingId = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.dyte.currentDyteMeetingId
  )
  const [realtimeChannel, setRealtimeChannel] = useState<{
    eventRealtimeChannel: RealtimeChannel | null
    meetingRealtimeChannel: RealtimeChannel | null
  }>({
    eventRealtimeChannel: null,
    meetingRealtimeChannel: null,
  })

  useEffect(() => {
    // Initialize the realtime channel with Supabase client and eventId
    const channel = supabaseClient
      .channel(`event:${eventId}`, {
        config: { broadcast: { self: true } },
      })
      .subscribe()

    setRealtimeChannel((state) => ({ ...state, eventRealtimeChannel: channel }))

    // Cleanup on unmount
    return () => {
      channel.unsubscribe()
    }
  }, [eventId])

  useEffect(() => {
    if (!currentDyteMeetingId) return () => null
    // Initialize the realtime channel with Supabase client and eventId
    const channel = supabaseClient
      .channel(`dyte-meeting:${currentDyteMeetingId}`, {
        config: { broadcast: { self: true } },
      })
      .subscribe()

    setRealtimeChannel((state) => ({
      ...state,
      meetingRealtimeChannel: channel,
    }))

    // Cleanup on unmount
    return () => {
      channel.unsubscribe()
    }
  }, [currentDyteMeetingId])

  return (
    <RealtimeChannelContext.Provider value={realtimeChannel}>
      {children}
    </RealtimeChannelContext.Provider>
  )
}

// Custom hook to use the RealtimeChannelContext
export const useRealtimeChannel = () => {
  const context = useContext(RealtimeChannelContext)
  if (context === null) {
    throw new Error(
      'useEventRealtimeChannel must be used within a RealtimeChannelProvider'
    )
  }

  return context
}
