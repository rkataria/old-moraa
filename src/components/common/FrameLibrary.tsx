/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react'

import { Button } from '@nextui-org/button'
import { Pagination } from '@nextui-org/react'
import { IconTrash } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { RxDotsVertical } from 'react-icons/rx'

// eslint-disable-next-line import/no-cycle
import { FrameThumbnailCard } from './AgendaPanel/FrameThumbnailCard'
import { ContentLoading } from './ContentLoading'
import { DropdownActions } from './DropdownActions'

import { RoomProvider } from '@/contexts/RoomProvider'
import { useDimensions } from '@/hooks/useDimensions'
import { useProfile } from '@/hooks/useProfile'
import { LibraryService } from '@/services/library.service'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export function FrameLibrary({
  onFrameClick,
  allowFrameDelete,
}: {
  onFrameClick?: (frame: IFrame) => void
  allowFrameDelete?: boolean
}) {
  const [page, setPage] = useState(1)
  const profile = useProfile()
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const libraryQuery = useQuery({
    queryKey: ['library-frames', page],
    queryFn: () => LibraryService.getFrameFromLibrary(profile!.data!.id, page),
    enabled: !!profile?.data?.id,
  })

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    undefined
  )

  const onFrameDeleteClick = (frameId: string) => async () => {
    await LibraryService.deleteFrameFromLibrary(frameId)
    libraryQuery.refetch()
  }

  if (libraryQuery.isLoading) {
    return (
      <div className="min-h-48 flex flex-col justify-center items-center">
        <ContentLoading />
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-5 gap-4 py-4">
        {libraryQuery.data?.data?.map((libraryItem: any) => (
          <div
            key={`frame-${libraryItem.id}`}
            onClick={() => onFrameClick?.(libraryItem?.frame)}
            className={cn(
              'cursor-pointer overflow-hidden rounded-lg group/frame-item shadow shadow-sm border border-gray-200 px-2 pb-2'
            )}>
            <div className="flex justify-between items-center py-1">
              <p className="text-gray-600 text-xs font-medium text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                {libraryItem.frame?.name}
              </p>
              {allowFrameDelete ? (
                <DropdownActions
                  triggerIcon={
                    <Button
                      size="sm"
                      isIconOnly
                      variant="light"
                      className="shrink-0">
                      <RxDotsVertical size={18} />
                    </Button>
                  }
                  actions={[
                    {
                      key: 'delete',
                      label: 'Remove',
                      icon: <IconTrash className="text-red-500" size={18} />,
                    },
                  ]}
                  onAction={onFrameDeleteClick(libraryItem.frame.id)}
                />
              ) : null}
            </div>
            <div className="relative">
              <div
                className={cn(
                  'w-full rounded-lg border border-gray-300 overflow-hidden aspect-video bg-gray-100'
                )}>
                <div
                  ref={thumbnailContainerRef}
                  className="relative w-full h-full">
                  {libraryItem.frame.type === FrameType.MORAA_BOARD ? (
                    <RoomProvider frameId={libraryItem.frame.id}>
                      <FrameThumbnailCard
                        frame={libraryItem.frame}
                        containerWidth={containerWidth}
                      />
                    </RoomProvider>
                  ) : (
                    <FrameThumbnailCard
                      frame={libraryItem.frame}
                      containerWidth={containerWidth}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="my-2 flex justify-center">
        <Pagination
          total={Math.ceil((libraryQuery.data?.count || 10) / 10)}
          page={page}
          onChange={setPage}
        />
      </div>
    </div>
  )
}
