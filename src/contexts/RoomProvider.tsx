'use client'

import { ReactNode } from 'react'

// eslint-disable-next-line import/no-extraneous-dependencies
import { LiveMap } from '@liveblocks/core'
import {
  ClientSideSuspense,
  RoomProvider as LBRoomProvider,
} from '@liveblocks/react/suspense'

import { ContentLoading } from '@/components/common/ContentLoading'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'

export function RoomProvider({ children }: { children: ReactNode }) {
  const currentFrame = useCurrentFrame()

  return (
    <LBRoomProvider
      id={`moraaboard:${currentFrame?.id}`}
      initialPresence={{ presence: undefined }}
      initialStorage={{ records: new LiveMap() }}>
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
