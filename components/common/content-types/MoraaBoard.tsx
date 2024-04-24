'use client'

import { Tldraw, useFileSystem } from '@tldraw/tldraw'
import { useParams } from 'next/navigation'
import { useUsers } from 'y-presence'

import { useTldrawCollaboration } from '@/hooks/useTldrawCollaboration'
import { ISlide } from '@/types/slide.type'
import { getProvider } from '@/utils/tldraw'

export type MoraaBoardSlideType = ISlide & {
  content: {
    document: string
  }
}

interface MoraaBoardProps {
  slide: MoraaBoardSlideType
}

export function MoraaBoard({ slide }: MoraaBoardProps) {
  const { eventId } = useParams()
  const fileSystemEvents = useFileSystem()
  const roomId = `moraa-board-${slide.id}-${eventId}`
  const { awareness } = getProvider({ roomId })
  const { onMount, ...events } = useTldrawCollaboration(roomId)

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="w-full h-full flex flex-col justify-center items-center px-4">
      <Users awareness={awareness} />
      <Tldraw
        autofocus
        disableAssets
        showPages={false}
        document={JSON.parse(slide.content.document || '{}')}
        onMount={onMount}
        {...fileSystemEvents}
        {...events}
      />
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Users({ awareness }: { awareness: any }) {
  const users = useUsers(awareness)

  return (
    <div className="absolute top-0 left-0 w-full p-md">
      <div className="flex space-between">
        <span>Users: {users.size}</span>
      </div>
    </div>
  )
}
