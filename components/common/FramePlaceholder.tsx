import { useContext } from 'react'

import { Skeleton } from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { EventContextType } from '@/types/event-context.type'

export function FramePlaceholder() {
  const { showFramePlaceholder } = useContext(EventContext) as EventContextType
  const { listDisplayMode } = useAgendaPanel()

  if (!showFramePlaceholder) return null

  const renderSkeleton = () => {
    if (listDisplayMode === 'list') {
      return <Skeleton className="rounded-md w-full h-10" />
    }

    return (
      <div className="w-4/5">
        <Skeleton className="rounded-md w-full h-[166px]" />
      </div>
    )
  }

  return <div className="mt-2 flex w-full">{renderSkeleton()}</div>
}
