import { Skeleton } from '@nextui-org/react'

import { useAgendaPanel } from '@/hooks/useAgendaPanel'

export function FramePlaceholder() {
  const { listDisplayMode } = useAgendaPanel()

  const renderSkeleton = () => {
    if (listDisplayMode === 'list') {
      return <Skeleton className="rounded-md w-full h-8" />
    }

    return <Skeleton className="rounded-md w-full h-[132px]" />
  }

  return <div className="mt-2 flex w-full">{renderSkeleton()}</div>
}
