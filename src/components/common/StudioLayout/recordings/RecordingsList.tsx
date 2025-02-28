/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useEffect, useState } from 'react'

import { Button } from '@heroui/button'
import { Image, Pagination } from '@heroui/react'
import { useNavigate, useParams, useRouter } from '@tanstack/react-router'
import { DateTime, Duration } from 'luxon'
import { BsClockHistory, BsSortDown, BsSortUp } from 'react-icons/bs'
import { CiCalendar } from 'react-icons/ci'

import { EmptyPlaceholder } from '../../EmptyPlaceholder'
import { Loading } from '../../Loading'
import { RenderIf } from '../../RenderIf/RenderIf'
import { ResponsiveVideoPlayer } from '../../ResponsiveVideoPlayer'

import { useGetRecordings } from '@/hooks/useEventRecordings'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { getEnrollmentThunk } from '@/stores/thunks/enrollment.thunk'
import { cn } from '@/utils/utils'

const itemsPerPage = 25

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

function formatAvailableTill(date: string) {
  return `Available till ${DateTime.fromISO(date).toFormat('MMMM dd, yyyy')}`
}

function formatStartTime(startTime: string) {
  return DateTime.fromISO(startTime).toFormat('MMMM dd, yyyy')
}

export function RecordingsList() {
  const dispatch = useStoreDispatch()
  const { eventId }: { eventId: string } = useParams({ strict: false })

  const [currentPage, setCurrentPage] = useState(1)
  const [sortType, setSortType] = useState('DESC')

  const router = useRouter()

  const searches = router.latestLocation.search as {
    action: string
  }

  const navigate = useNavigate()

  const enrollment = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.enrollment.data
  )

  const meeting = useStoreSelector(
    (state) => state.event.currentEvent.meetingState.meeting.data
  )

  const {
    recordings = [],
    metaData,
    isFetching: fetchingRecordings,
  } = useGetRecordings({
    token: enrollment?.meeting_token,
    meetingId: meeting?.dyte_meeting_id,
    query: { page_no: currentPage, sort_order: sortType },
  })

  const pages = Math.ceil(metaData.total_count / itemsPerPage)

  useEffect(() => {
    if (enrollment) return
    dispatch(
      getEnrollmentThunk({
        eventId,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollment])

  if (fetchingRecordings) {
    return <Loading />
  }

  const renderContent = () => {
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
        {/*  eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {recordings.map((recording: any, index: number) => (
          <div
            className="gap-4 border rounded-xl h-full overflow-hidden cursor-pointer shadow-md bg-white"
            onClick={() => {
              navigate({
                search: { ...searches, recordingId: recording.id },
              })
            }}>
            <ResponsiveVideoPlayer
              url={recording.download_url}
              showControls={false}
              showViewMode={false}
              className="rounded-none"
            />

            <div className="py-2 relative p-4">
              <p className="font-medium mb-2">Recording {index + 1} </p>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-1">
                  <CiCalendar size={18} />
                  <p className="text-xs">
                    {formatStartTime(recording.started_time)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <BsClockHistory size={18} />
                  <p className="text-xs">
                    {formatDuration(recording.recording_duration)}
                  </p>
                </div>
              </div>
              <p className="text-xs ml-auto text-[10px] text-right mt-4">
                {formatAvailableTill(recording.download_url_expiry)}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('w-full h-full px-[55px]', {
        'h-auto': !recordings.length,
      })}>
      <div className="flex items-center justify-between pt-4">
        <p className="text-2xl font-semibold">Recaps</p>
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
