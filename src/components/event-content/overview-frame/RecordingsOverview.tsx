import { useEffect } from 'react'

import { useParams, useRouter } from '@tanstack/react-router'
import { DateTime } from 'luxon'
import { IoPlayCircleOutline } from 'react-icons/io5'
import { LiaPhotoVideoSolid } from 'react-icons/lia'

import { ResponsiveVideoPlayer } from '@/components/common/ResponsiveVideoPlayer'
import { Button } from '@/components/ui/Button'
import { useGetRecordings } from '@/hooks/useEventRecordings'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { getEnrollmentThunk } from '@/stores/thunks/enrollment.thunk'

export function RecordingsOverview() {
  const { eventId }: { eventId: string } = useParams({ strict: false })

  const dispatch = useStoreDispatch()
  const enrollment = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.enrollment.data
  )

  const meeting = useStoreSelector(
    (state) => state.event.currentEvent.meetingState.meeting.data
  )

  const { recordings = [], metaData } = useGetRecordings({
    token: enrollment?.meeting_token,
    meetingId: meeting?.dyte_meeting_id,
    query: { per_page: 1 },
  })

  const router = useRouter()

  useEffect(() => {
    if (enrollment) return
    dispatch(
      getEnrollmentThunk({
        eventId,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollment])

  const recording = recordings[0]

  if (!recording) return null

  return (
    <div className="relative bg-white p-3 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-medium">Recording</p>
        <p className="text-gray-400 text-xs font-light">
          recorded on{' '}
          {DateTime.fromISO(recording.stopped_time).toFormat('MMMM dd, yyyy')}
        </p>
      </div>
      <div className="grid grid-cols-[0.6fr_1fr] items-start gap-4 mt-2">
        <div className="relative rounded-md overflow-hidden w-[130px] max-w-[130px]">
          <ResponsiveVideoPlayer
            url={recording.download_url}
            showControls={false}
            showViewMode={false}
          />
          <div className="absolute left-0 top-0 grid place-items-center w-full h-full bg-black/40">
            <IoPlayCircleOutline
              size={50}
              className="  text-white cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className="grid gap-2">
            <p className="text-xs flex items-center gap-2">
              <LiaPhotoVideoSolid size={18} />
              {metaData.total_count} recordings
            </p>
          </div>
          <div className="flex w-full justify-end">
            <Button
              className="text-primary text-xs font-medium text-right cursor-pointer bg-transparent h-auto w-auto min-w-[auto] w-fit p-0 m-0"
              onClick={() =>
                router.navigate({ to: `/events/${eventId}/recordings` })
              }>
              View Recordings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
