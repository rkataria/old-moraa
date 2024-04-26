'use client'

import { Tldraw, useFileSystem } from '@tldraw/tldraw'
import { useUsers } from 'y-presence'

import { useTldraw } from '@/hooks/useTldraw'
import { ISlide } from '@/types/slide.type'
import { awareness, roomID } from '@/utils/tldraw-yjs'

export type MoraaBoardSlide = ISlide & {
  content: {
    document: string
  }
}

interface MoraaBoardProps {
  slide: MoraaBoardSlide
}

export function MoraaBoard({ slide }: MoraaBoardProps) {
  const fileSystemEvents = useFileSystem()
  const { onMount, ...events } = useTldraw(roomID)

  if (!slide?.content) {
    return null
  }

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="relative w-full h-full flex flex-col justify-center items-center px-4">
      <Users />
      <Tldraw
        autofocus
        disableAssets
        showPages={false}
        onMount={onMount}
        {...fileSystemEvents}
        {...events}
      />
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Users() {
  const users = useUsers(awareness)

  return (
    <div className="absolute top-0 left-0 w-full p-md z-[1]">
      <div className="flex space-between">
        <span>Users: {users.size}</span>
      </div>
    </div>
  )
}
