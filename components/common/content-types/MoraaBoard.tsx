'use client'

import { useState } from 'react'

import { Tldraw, createTLStore } from '@tldraw/tldraw'

import { ISlide } from '@/types/slide.type'

export type MoraaBoardSlideType = ISlide & {
  content: {
    snapshot: string
  }
}

interface MoraaBoardProps {
  slide: MoraaBoardSlideType
}

export function MoraaBoard({ slide }: MoraaBoardProps) {
  const { snapshot: stringified } = slide.content
  const [store] = useState(() => {
    // Create the store
    const newStore = createTLStore({})

    const snapshot = JSON.parse(stringified)

    // Load the snapshot
    newStore.loadSnapshot(snapshot)

    return newStore
  })

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="w-full h-full flex flex-col justify-center items-center px-4">
      <Tldraw store={store} />
    </div>
  )
}
