import { useContext } from 'react'

import { useSelf } from '@liveblocks/react/suspense'
import { ErrorBoundary } from '@sentry/react'
import { Tldraw } from 'tldraw'

import { EventContext } from '@/contexts/EventContext'
import { useStorageStore } from '@/hooks/useStorageStore'
import { EventContextType } from '@/types/event-context.type'

export function MoraaBoardEditor() {
  const { preview } = useContext(EventContext) as EventContextType
  const id = useSelf((me) => me.id)
  const info = useSelf((me) => me.info)
  const store = useStorageStore({
    user: { id, color: info?.color, name: info?.name },
  })

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center rounded-md overflow-hidden z-[0]">
      <ErrorBoundary>
        <Tldraw
          // persistenceKey={roomId}
          autoFocus
          store={store}
          hideUi={preview}
        />
      </ErrorBoundary>
    </div>
  )
}
