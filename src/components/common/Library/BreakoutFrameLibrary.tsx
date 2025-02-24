/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useRef, useState } from 'react'

import { cn, Input, Pagination } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { IoSearch } from 'react-icons/io5'

// eslint-disable-next-line import/no-cycle
import { FrameThumbnailCard } from '../AgendaPanel/FrameThumbnailCard'
import { Loading } from '../Loading'

import { useDimensions } from '@/hooks/useDimensions'
import { FrameService } from '@/services/frame.service'
import { IFrame } from '@/types/frame.type'

export function BreakoutFrameLibrary({
  meetingId,
  onFrameClick,
}: {
  meetingId: string
  onFrameClick: (frame: IFrame) => void
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const meetingBreakoutActivityQuery = useQuery({
    queryKey: ['BREAKOUT_ACTIVITIES_LIBRARY', { meetingId, page, search }],
    queryFn: () =>
      FrameService.getBreakoutActivitiesOfMeeting({
        meetingId,
        page,
        search,
        pageSize: 8,
      }),
    select: (data) => data || [],
  })

  const totalPages = Math.ceil(
    (meetingBreakoutActivityQuery.data?.count || 8) / 10
  )
  console.log(meetingBreakoutActivityQuery.data)

  return (
    <div>
      <div className="mt-4 flex justify-between align-center">
        <Input
          value={search}
          className="w-96"
          variant="bordered"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          startContent={<IoSearch size={20} color="#ccc" />}
        />
      </div>

      <div className="grid grid-cols-4 gap-4 py-4">
        {meetingBreakoutActivityQuery.isLoading ? (
          <div className="col-span-4 flex justify-center items-center h-48 text-gray-400">
            <Loading />
          </div>
        ) : meetingBreakoutActivityQuery.data?.count === 0 ? (
          <div className="col-span-4 flex justify-center items-center h-48">
            <p className="text-gray-500">No activities found</p>
          </div>
        ) : (
          meetingBreakoutActivityQuery.data?.data?.map(
            (activity: { id: string; activity: IFrame }) => (
              <div
                key={`activity-${activity.id}`}
                onClick={() => onFrameClick?.(activity?.activity as IFrame)}
                className={cn(
                  'cursor-pointer overflow-hidden rounded-lg group/frame-item shadow shadow-sm border border-gray-200 px-2 pb-2'
                )}>
                <div className="flex justify-between items-center py-1">
                  <p className="text-gray-600 text-xs font-medium text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                    {activity.activity?.name}
                  </p>
                </div>
                <div className="relative">
                  <div
                    className={cn(
                      'w-full rounded-lg border border-gray-300 overflow-hidden aspect-video bg-gray-100'
                    )}>
                    <ThumbnailContainer frame={activity.activity as IFrame} />
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>
      <div className="my-4 flex justify-center">
        {totalPages !== 1 && (
          <Pagination
            key={meetingBreakoutActivityQuery.dataUpdatedAt}
            total={totalPages}
            page={page}
            onChange={setPage}
          />
        )}
      </div>
    </div>
  )
}

function ThumbnailContainer({ frame }: { frame: IFrame }) {
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    undefined
  )

  return (
    <div ref={thumbnailContainerRef} className="relative w-full h-full">
      <FrameThumbnailCard frame={frame} containerWidth={containerWidth} />
    </div>
  )
}
