/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react'

import { Button } from '@nextui-org/button'
import { useQuery } from '@tanstack/react-query'
import { IoTrashBin } from 'react-icons/io5'

import { FrameThumbnailCard } from './AgendaPanel/FrameThumbnailCard'

import { RoomProvider } from '@/contexts/RoomProvider'
import { useDimensions } from '@/hooks/useDimensions'
import { useProfile } from '@/hooks/useProfile'
import { LibraryService } from '@/services/library.service'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export function FrameLibrary() {
  const profile = useProfile()
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const libraryQuery = useQuery({
    queryKey: ['library-frames'],
    queryFn: () => LibraryService.getFrameFromLibrary(profile!.data!.id),
    enabled: !!profile?.data?.id,
  })

  const { width: containerWidth } = useDimensions(thumbnailContainerRef, [])

  const onFrameDeleteClick = () => {}

  return (
    <div className="grid grid-cols-5 gap-4 ">
      {libraryQuery.data?.map((libraryItem: any) => (
        <div
          key={`frame-${libraryItem.id}`}
          className={cn(
            'relative mr-6 cursor-pointer overflow-hidden rounded-lg group/frame-item'
          )}>
          <div
            className={cn(
              'relative flex flex-col transition-all duration-400 ease-in-out '
            )}>
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

          <Button
            className="absolute top-0 right-0"
            isIconOnly
            variant="light"
            color="danger"
            onClick={onFrameDeleteClick}>
            <IoTrashBin />
          </Button>
        </div>
      ))}
    </div>
  )
}
