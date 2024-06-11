import { useContext } from 'react'

import { Skeleton } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { type AgendaFrameDisplayType } from '@/types/event.type'

export function FramePlaceholder({
  displayType,
}: {
  displayType: AgendaFrameDisplayType
}) {
  const { showFramePlaceholder } = useContext(EventContext) as EventContextType

  if (!showFramePlaceholder) return null

  if (displayType === 'list') {
    return (
      <div className="flex-none w-full flex justify-start items-center gap-2">
        <Skeleton className="flex-none flex rounded-full w-8 h-8" />
        <Skeleton className="flex rounded-sm w-full h-8" />
      </div>
    )
  }

  return (
    <div className="flex-none w-full flex justify-start items-center">
      <Skeleton className="relative rounded-md w-full aspect-video cursor-pointer border-2" />
    </div>
  )
}
