/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react'

import { Pagination } from '@heroui/react'
import { createFileRoute, useParams, useRouter } from '@tanstack/react-router'
import { DateTime, Duration } from 'luxon'
import { BsClockHistory, BsSortDown, BsSortUp } from 'react-icons/bs'
import { CiCalendar } from 'react-icons/ci'

import { Loading } from '@/components/common/Loading'
import { ResponsiveVideoPlayer } from '@/components/common/ResponsiveVideoPlayer'
import { Button } from '@/components/ui/Button'
import { useSyncValueInRedux } from '@/hooks/syncValueInRedux'
import { useGetRecordings } from '@/hooks/useEventRecordings'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setCurrentEventIdAction } from '@/stores/slices/event/current-event/event.slice'
import { getEnrollmentThunk } from '@/stores/thunks/enrollment.thunk'

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

function Recordings() {
  const dispatch = useStoreDispatch()
  const { eventId }: { eventId: string } = useParams({ strict: false })
  const [currentPage, setCurrentPage] = useState(1)
  const [sortType, setSortType] = useState('DESC')

  const router = useRouter()

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

  const pages = Math.ceil(metaData.total_count / 25)

  useEffect(() => {
    if (enrollment) return
    dispatch(
      getEnrollmentThunk({
        eventId,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollment])

  useSyncValueInRedux({
    value: eventId || null,
    reduxStateSelector: (state) => state.event.currentEvent.eventState.eventId,
    actionFn: setCurrentEventIdAction,
  })

  const renderContent = () => {
    if (fetchingRecordings) {
      return <Loading />
    }

    return (
      <div className="mx-10 grid grid-cols-[repeat(auto-fill,_minmax(400px,1fr))] gap-4 mt-4 mb-10">
        {/*  eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {recordings.map((recording: any, index: number) => (
          <div
            className="grid grid-cols-[200px_1fr] gap-4 border rounded-lg h-full overflow-hidden cursor-pointer shadow-md"
            onClick={() =>
              router.navigate({
                to: `${router.state.location.pathname}/${recording.id}`,
              })
            }>
            <ResponsiveVideoPlayer
              url={recording.download_url}
              showControls={false}
              showViewMode={false}
              className="rounded-none w-[12.5rem]"
            />

            <div className="py-2 relative">
              <p className="text-lg mb-2">Recording {index + 1} </p>
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
              <p className="text-xs absolute bottom-2">
                {formatAvailableTill(recording.download_url_expiry)}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-end pl-6 pr-8 pt-8">
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
      </div>

      {renderContent()}

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
    </>
  )
}

export const Route = createFileRoute('/events/$eventId/recordings/_layout/')({
  component: () => <Recordings />,
})
