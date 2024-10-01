// eslint-disable-next-line import/no-extraneous-dependencies
import { LiveMap } from '@liveblocks/core'

export type PresenceStates = 'playing' | 'seeking' | 'paused'

declare global {
  interface Liveblocks {
    // Each user's Presence, for room.getPresence, room.subscribe("others"), etc.
    Presence: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      presence: any // Used by tldraw
    }
    Storage: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      records: LiveMap<string, any> // Used by tldraw
    }
    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string // Accessible through `user.id`
      info: {
        name: string
        color: string
        avatar: string
      } // Accessible through `user.info`
    }
  }
}
