// eslint-disable-next-line import/no-extraneous-dependencies
import { RealtimeChannel } from '@supabase/realtime-js'

export const notifyBreakoutStart = (realtimeChannel: RealtimeChannel) => {
  realtimeChannel.send({
    type: 'broadcast',
    event: 'start-breakout-notify',
    payload: {},
  })
}

export const notifyBreakoutEnd = (realtimeChannel: RealtimeChannel) => {
  realtimeChannel.send({
    type: 'broadcast',
    event: 'stop-breakout-notify',
    payload: {},
  })
}

export const notificationDuration = 5
