'use client'

import React, { useContext } from 'react'

import { useDebounce } from '@uidotdev/usehooks'
import { Tldraw } from 'tldraw'

import { ContentLoading } from '@/components/common/ContentLoading'
import { EventContext } from '@/contexts/EventContext'
import { useYjsStoreSupabase } from '@/hooks/useYjsStoreSupabase'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

type MoraaBoardFrame = IFrame

export function MoraaBoardEditor({ frame }: { frame: MoraaBoardFrame }) {
  const roomId = `edit-moraa-board-${frame.id}`
  const { preview } = useContext(EventContext) as EventContextType
  const store = useYjsStoreSupabase({
    roomId,
    frameId: frame.id,
  })
  const debouncedStatus = useDebounce(store.status, 2000)

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden z-[0]">
      {debouncedStatus !== 'synced-remote' && (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
          <ContentLoading />
        </div>
      )}
      <Tldraw
        // persistenceKey={roomId}
        autoFocus
        store={store}
        hideUi={preview}
      />
    </div>
  )
}
