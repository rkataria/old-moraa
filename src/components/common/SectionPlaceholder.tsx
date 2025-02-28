import { Skeleton } from '@heroui/react'

import { useStoreSelector } from '@/hooks/useRedux'

export function SectionPlaceholder() {
  const isAddSectionLoading = useStoreSelector(
    (state) =>
      state.event.currentEvent.sectionState.createSectionThunk.isLoading
  )

  if (isAddSectionLoading) {
    return (
      <div className="flex-none w-full flex justify-start items-center gap-2 px-2 mt-2">
        <Skeleton className="flex-none flex rounded-full w-8 h-8" />
        <Skeleton className="flex rounded-sm w-full h-8" />
      </div>
    )
  }

  return null
}
