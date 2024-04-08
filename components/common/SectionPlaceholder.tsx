import { useContext } from 'react'

import { Skeleton } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function SectionPlaceholder({ sectionId }: { sectionId: string }) {
  const { insertAfterSectionId, showSectionPlaceholder } = useContext(
    EventContext
  ) as EventContextType

  if (insertAfterSectionId === sectionId && showSectionPlaceholder) {
    return (
      <div className="flex-none w-full flex justify-start items-center gap-2 px-2">
        <Skeleton className="flex-none flex rounded-full w-8 h-8" />
        <Skeleton className="flex rounded-sm w-full h-8" />
      </div>
    )
  }

  return null
}
