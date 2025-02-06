'use client'

import { ReactNode } from 'react'

// eslint-disable-next-line import/no-extraneous-dependencies
import { LiveMap } from '@liveblocks/core'
import {
  ClientSideSuspense,
  RoomProvider as LBRoomProvider,
} from '@liveblocks/react/suspense'

import { ContentLoading } from '@/components/common/ContentLoading'

type RoomProviderProps = {
  children: ReactNode
  frameId: string
}

export function RoomProvider({ children, frameId }: RoomProviderProps) {
  return (
    <LBRoomProvider
      id={`moraaboard:${frameId}`}
      initialPresence={{ presence: undefined, isHost: false }}
      initialStorage={{
        records: new LiveMap(),
        thumbnail: '',
        UserPresenceEvent: {
          type: 'BRING_ALL_TO_HOST',
          message: { userId: '', frameId: '' },
        },
      }}>
      <ClientSideSuspense
        fallback={
          <div className="h-full w-full flex items-center justify-content">
            <ContentLoading />
          </div>
        }>
        {children}
      </ClientSideSuspense>
    </LBRoomProvider>
  )
}
