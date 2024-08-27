import { Skeleton } from '@nextui-org/react'

import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useStoreSelector } from '@/hooks/useRedux'

export function FramePlaceholder() {
  const isAddFrameLoading = useStoreSelector(
    (state) => state.event.currentEvent.frameState.addFrameThunk.isLoading
  )
  const { listDisplayMode } = useAgendaPanel()

  if (!isAddFrameLoading) return null

  const renderSkeleton = () => {
    if (listDisplayMode === 'list') {
      return <Skeleton className="rounded-md w-full h-8" />
    }

    return <Skeleton className="rounded-md w-full h-[132px]" />
  }

  return <div className="mt-2 flex w-full">{renderSkeleton()}</div>
}
