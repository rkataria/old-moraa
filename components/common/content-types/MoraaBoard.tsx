'use client'

import { Tldraw } from '@tldraw/tldraw'
import { useParams } from 'next/navigation'

import { useYjsStore } from '@/hooks/useYjsStore'
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
  const { eventId } = useParams()
  // const { snapshot: stringified } = slide.content

  const store = useYjsStore({
    roomId: `moraa-board-${slide.id}-${eventId}`,
  })
  // const [store] = useState(() => {
  //   // Create the store
  //   const newStore = createTLStore({})

  //   const snapshot = JSON.parse(stringified || '{}')

  //   // Load the snapshot
  //   newStore.loadSnapshot(snapshot)

  //   return newStore
  // })

  console.log('MoraaBoard slide', slide, store)

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="w-full h-full flex flex-col justify-center items-center px-4">
      <Tldraw store={store} />
    </div>
  )
}
