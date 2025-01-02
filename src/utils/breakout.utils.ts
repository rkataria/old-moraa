// eslint-disable-next-line import/no-extraneous-dependencies
import { RealtimeChannel } from '@supabase/realtime-js'

import { IFrame, ISection } from '@/types/frame.type'

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

export const getFrameActivities = (section: ISection, frameId: string) =>
  section?.frames
    .filter((frame: IFrame) => frame?.content?.breakoutFrameId === frameId)
    .map((frame) => frame.id) || []
