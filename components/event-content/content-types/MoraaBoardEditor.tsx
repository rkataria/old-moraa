'use client'

import React, { useContext } from 'react'

import { useDebounce } from '@uidotdev/usehooks'
import { Tldraw } from 'tldraw'

import { ContentLoading } from '@/components/common/ContentLoading'
import { EventContext } from '@/contexts/EventContext'
import { useYjsStoreSupabase } from '@/hooks/useYjsStoreSupabase'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'

type MoraaBoardSlide = ISlide

export function MoraaBoardEditor({ slide }: { slide: MoraaBoardSlide }) {
  const roomId = `edit-moraa-board-${slide.id}`
  const { preview } = useContext(EventContext) as EventContextType
  const store = useYjsStoreSupabase({
    roomId,
    slideId: slide.id,
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
