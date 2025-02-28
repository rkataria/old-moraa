/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import { Dispatch, SetStateAction } from 'react'

import { Button } from '@heroui/button'
import { Image, Pagination } from '@heroui/react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { DateTime, Duration } from 'luxon'
import { BsClockHistory, BsSortDown, BsSortUp } from 'react-icons/bs'
import { CiCalendar } from 'react-icons/ci'

import { itemsPerPage } from './constants'
import { EmptyPlaceholder } from '../../EmptyPlaceholder'
import { Loading } from '../../Loading'
import { RenderIf } from '../../RenderIf/RenderIf'
import { ResponsiveVideoPlayer } from '../../ResponsiveVideoPlayer'

import { RecordingsModel } from '@/types/models'
import { cn } from '@/utils/utils'

function formatDuration(seconds: number) {
  const duration = Duration.fromObject({ seconds }).shiftTo(
    'hours',
    'minutes',
    'seconds'
  )

  const hrDisplay = duration.hours ? `${duration.hours}h ` : ''
  const minDisplay = duration.minutes ? `${duration.minutes}m ` : ''
  const secDisplay = duration.seconds ? `${Math.floor(duration.seconds)}s` : ''

  return `${hrDisplay}${minDisplay}${secDisplay}`.trim()
}

export function RecordingsList({
  recordings,
  isLoading,
  currentPage,
  totalItems,
  sortType,
  setCurrentPage,
  setSortType,
}: {
  recordings: RecordingsModel[]
  isLoading: boolean
  currentPage: number
  totalItems: number
  sortType: string
  setCurrentPage: Dispatch<SetStateAction<number>>
  setSortType: Dispatch<SetStateAction<string>>
}) {
  const router = useRouter()

  const searches = router.latestLocation.search as {
    action: string
  }

  const navigate = useNavigate()

  const pages = Math.ceil(totalItems / itemsPerPage)

  const renderContent = () => {
    if (isLoading) {
      return <Loading />
    }

    if (!recordings.length) {
      return (
        <EmptyPlaceholder
          title="No recaps yet - stay tuned!"
          description={
            "Once a session is recorded, you'll find key takeaways and summaries here."
          }
          icon={
            <Image src="/images/recordings/empty-placeholder.svg" width={400} />
          }
        />
      )
    }

    return (
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,1fr))] gap-4 mt-4 mb-10">
        {recordings.map((recording) => (
          <div
            className="gap-4 border rounded-xl h-full overflow-hidden cursor-pointer shadow-md bg-white"
            onClick={() => {
              navigate({
                search: { ...searches, recordingId: recording.id },
              })
            }}>
            <ResponsiveVideoPlayer
              url={recording.recording_url as string}
              showControls={false}
              showViewMode={false}
              className="rounded-none"
            />

            <div className="py-3 relative p-4">
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-1">
                  <CiCalendar size={22} />
                  <p className="text-xs font-medium">
                    {DateTime.fromISO(recording.created_at).toLocaleString({
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-gray-700 text-white p-1.5 px-2 rounded-lg">
                  <BsClockHistory size={16} />
                  <p className="text-xs font-medium">
                    {formatDuration(recording.duration as number)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('w-full h-full px-[55px] overflow-auto', {
        'h-auto': !recordings.length,
      })}>
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="light"
          className="text-2xl font-semibold cursor-pointer w-fit pl-0 !bg-transparent">
          Recaps
        </Button>
        <RenderIf isTrue={recordings.length > 1}>
          <Button
            variant="light"
            className="bg-transparent"
            startContent={
              sortType === 'DESC' ? (
                <BsSortDown size={18} />
              ) : (
                <BsSortUp size={18} />
              )
            }
            onClick={() => setSortType(sortType === 'DESC' ? 'ASC' : 'DESC')}>
            Sort
          </Button>
        </RenderIf>
      </div>

      {renderContent()}

      <RenderIf isTrue={recordings.length > itemsPerPage}>
        <div className="justify-center flex pb-5">
          <Pagination
            variant="bordered"
            showShadow
            boundaries={2}
            color="primary"
            showControls
            isCompact={false}
            page={currentPage}
            total={pages}
            initialPage={1}
            onChange={(page) => {
              setCurrentPage(page)
            }}
          />
        </div>
      </RenderIf>
    </div>
  )
}
