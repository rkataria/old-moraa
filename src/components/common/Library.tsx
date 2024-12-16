import { useQuery } from '@tanstack/react-query'

import { Frame } from './Frame/Frame'

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
      {libraryQuery.data?.map((libraryItem) => (
        <Frame frame={libraryItem.frame} isThumbnail />
      ))}
    </div>
  )
}
