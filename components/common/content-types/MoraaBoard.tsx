'use client'

import { Tldraw, useFileSystem } from '@tldraw/tldraw'
import { useParams } from 'next/navigation'
import { useUsers } from 'y-presence'

import { useTldrawCollaboration } from '@/hooks/useTldrawCollaboration'
import { ISlide } from '@/types/slide.type'

export type MoraaBoardSlide = ISlide & {
  content: {
    document: string
  }
}

interface MoraaBoardProps {
  slide: MoraaBoardSlide
}

export function MoraaBoard({ slide }: MoraaBoardProps) {
  const { eventId } = useParams()
  const fileSystemEvents = useFileSystem()
  const roomId = `moraa-board-${slide.id}-${eventId}`
  // const [localSlide, setLocalSlide] = useState<MoraaBoardSlide | null>(null)
  // const debouncedLocalSlide = useDebounce(localSlide, 500)
  // const { preview, isOwner } = useContext(EventContext) as EventContextType
  const { awareness, onMount, ...events } = useTldrawCollaboration(roomId)

  if (!slide?.content) {
    return null
  }

  // const storedDocument = JSON.parse(slide.content.document as string)
  // const readOnly = preview || (!isOwner && slide.config.allowToDraw)

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className="relative w-full h-full flex flex-col justify-center items-center px-4">
      <Users awareness={awareness} />
      <Tldraw
        // readOnly={readOnly}
        showMultiplayerMenu={false}
        showSponsorLink={false}
        showMenu={false}
        autofocus
        disableAssets
        // document={storedDocument}
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
    <div className="absolute top-0 left-0 w-full p-md z-[1]">
      <div className="flex space-between">
        <span>Users: {users.size}</span>
      </div>
    </div>
  )
}
