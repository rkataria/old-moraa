'use client'

import React, { useContext, useLayoutEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Tldraw } from 'tldraw'

import { ContentLoading } from '@/components/common/ContentLoading'
import { EventContext } from '@/contexts/EventContext'
import { initMoraaboardInstances } from '@/stores/reducers/moraaboard-reducer'
import { RootState } from '@/stores/redux'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'

type MoraaBoardSlide = ISlide

export function MoraaBoardEditor({ slide }: { slide: MoraaBoardSlide }) {
  const roomId = `edit-moraa-board-${slide.id}`
  const { preview } = useContext(EventContext) as EventContextType
  const dispatch = useDispatch()
  const tlStore = useSelector<RootState, RootState['moraaboard']['tlStore']>(
    (store) => store.moraaboard.tlStore
  )

  useLayoutEffect(() => {
    dispatch(
      initMoraaboardInstances({
        roomId,
        slideId: slide.id,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden z-[0]">
      {!tlStore && (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
          <ContentLoading />
        </div>
      )}
      <Tldraw
        // persistenceKey={roomId}
        autoFocus
        store={tlStore}
        hideUi={preview}
      />
    </div>
  )
}
