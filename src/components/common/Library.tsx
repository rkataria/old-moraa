/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query'

import { FrameGridView } from './AgendaPanel/FrameGridView'

import { useProfile } from '@/hooks/useProfile'
import { LibraryService } from '@/services/library.service'

export function FrameLibrary() {
  const profile = useProfile()
  const libraryQuery = useQuery({
    queryKey: ['library-frames'],
    queryFn: () => LibraryService.getFrameFromLibrary(profile!.data!.id),
    enabled: !!profile?.data?.id,
  })

  return (
    <div className="grid grid-cols-5 gap-4 ">
      {libraryQuery.data?.map((libraryItem: any) => (
        <FrameGridView
          frameActive={false}
          frame={libraryItem.frame}
          handleFrameAction={() => null}
          onClick={() => null}
          sidebarExpanded
        />
      ))}
    </div>
  )
}
