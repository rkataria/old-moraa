import { supabaseClient } from '@/utils/supabase/client'

export const getRealtimeChannelForEvent = (eventId: string) =>
  supabaseClient.realtime
    .getChannels()
    .find((channel) => channel.topic.startsWith(`realtime:event:${eventId}`))

export const getRealtimeChannelsForEvent = (eventId: string) =>
  supabaseClient.realtime
    .getChannels()
    .filter((channel) => channel.topic.startsWith(`realtime:event:${eventId}`))
