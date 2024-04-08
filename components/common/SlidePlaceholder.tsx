import { useContext } from 'react'

import { Skeleton } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { type AgendaSlideDisplayType } from '@/types/event.type'

export function SlidePlaceholder({
  slideId,
  displayType,
}: {
  slideId: string
  displayType: AgendaSlideDisplayType
}) {
  const { insertAfterSlideId, showSlidePlaceholder } = useContext(
    EventContext
  ) as EventContextType

  if (insertAfterSlideId !== slideId) return null

  if (!showSlidePlaceholder) return null

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
