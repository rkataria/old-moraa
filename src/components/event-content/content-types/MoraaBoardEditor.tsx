import { useContext } from 'react'

import { Tldraw } from 'tldraw'

import { EventContext } from '@/contexts/EventContext'
import { useYjsStore } from '@/hooks/useYjsStore'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

type MoraaBoardFrame = IFrame

export function MoraaBoardEditor({ frame }: { frame: MoraaBoardFrame }) {
  const { preview } = useContext(EventContext) as EventContextType
  // const store = useLiveblocksStore()
  const store = useYjsStore({
    roomId: frame.id,
    hostUrl: import.meta.env.VITE_PARTYKIT_HOST_URL,
  })

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden z-[0]">
      <Tldraw
        // persistenceKey={roomId}
        autoFocus
        store={store}
        hideUi={preview}
      />
    </div>
  )
}
