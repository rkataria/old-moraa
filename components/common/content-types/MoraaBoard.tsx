/* eslint-disable import/order */

'use client'

import React, { useContext, useLayoutEffect } from 'react'

import { ISlide } from '@/types/slide.type'
import 'tldraw/tldraw.css'

import { EventContextType } from '@/types/event-context.type'
import { EventContext } from '@/contexts/EventContext'

import { Tldraw } from 'tldraw'

import { ContentLoading } from '@/components/common/ContentLoading'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/stores/redux'
import { initMoraaboardInstances } from '@/stores/reducers/moraaboard-reducer'

export type MoraaBoardSlide = ISlide & {
  content: {
    document: string
  }
}

interface MoraaBoardProps {
  slide: MoraaBoardSlide
}

export function MoraaBoard({ slide }: MoraaBoardProps) {
  const { preview, isOwner } = useContext(EventContext) as EventContextType
  const roomId = `present-moraa-board-${slide.id}`
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

  const readOnly = preview || (!isOwner && slide.config?.allowToDraw)

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="relative w-full flex-auto flex flex-col justify-center items-center px-4 z-[0] h-full">
      {!tlStore ? (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
          <ContentLoading />
        </div>
      ) : (
        <Tldraw
          // persistenceKey={roomId}
          autoFocus
          store={tlStore}
          components={
            {
              // SharePanel: preview ? null : NameEditor,
            }
          }
          onMount={(editor) => {
            editor.updateInstanceState({ isReadonly: !!readOnly })
          }}
        />
      )}
    </div>
  )
}

// const NameEditor = track(() => {
//   const editor = useEditor()
//   const name = 'Test'

//   useEffect(() => {
//     editor.user.updateUserPreferences({
//       name,
//     })
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [name])

//   const { color } = editor.user.getUserPreferences()

//   return (
//     <div className="flex justify-end items-center gap-1 pointer-events-auto">
//       <input
//         type="color"
//         className="w-12 cursor-pointer"
//         value={color}
//         onChange={(e) => {
//           editor.user.updateUserPreferences({
//             color: e.currentTarget.value,
//           })
//         }}
//       />
//       <span>{name}</span>
//     </div>
//   )
// })
