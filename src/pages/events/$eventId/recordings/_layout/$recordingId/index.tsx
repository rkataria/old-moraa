import { useEffect } from 'react'

import { Button } from '@nextui-org/button'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { marked } from 'marked'
import { HiOutlineChatBubbleLeft } from 'react-icons/hi2'

import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'
import { Loading } from '@/components/common/Loading'
import { ResponsiveVideoPlayer } from '@/components/common/ResponsiveVideoPlayer'
import { useSyncValueInRedux } from '@/hooks/syncValueInRedux'
import { useCsvData } from '@/hooks/useCsv'
import { useEvent } from '@/hooks/useEvent'
import {
  useGetOrGenerateSummary,
  useGetRecording,
} from '@/hooks/useEventRecordings'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useTxtData } from '@/hooks/useTxt'
import { setCurrentEventIdAction } from '@/stores/slices/event/current-event/event.slice'
import { getEnrollmentThunk } from '@/stores/thunks/enrollment.thunk'
import 'github-markdown-css'

const summaryRenderer = (content: string) => {
  const createMarkup = () => {
    const rawHTML = marked(content, {
      breaks: true,
      gfm: true,
    })

    return { __html: rawHTML }
  }

  return (
    <div className="markdown-body" dangerouslySetInnerHTML={createMarkup()} />
  )
}

function RecordingDetails() {
  const dispatch = useStoreDispatch()
  const { eventId, recordingId }: { eventId: string; recordingId: string } =
    useParams({ strict: false })
  const { event } = useEvent({ id: eventId })

  const enrollment = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.enrollment.data
  )

  const meeting = useStoreSelector(
    (state) => state.event.currentEvent.meetingState.meeting.data
  )

  const { recording, isFetching, transcripts } = useGetRecording({
    token: enrollment?.meeting_token,
    meetingId: meeting?.dyte_meeting_id,
    recordingId,
  })

  const { summary, isFetching: isFetchingSummary } = useGetOrGenerateSummary({
    token: enrollment?.meeting_token,
    sessionId: recording?.session_id,
  })

  const { data: summaryData } = useTxtData(summary?.summary_download_url)

  const { data: transcriptsData } = useCsvData(
    transcripts?.transcript_download_url
  )

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

  if (isFetching) {
    return <Loading />
  }

  if (!event || !recording) return null

  const renderSummary = () => {
    if (isFetchingSummary) {
      return (
        <div className="h-10">
          <Loading />
        </div>
      )
    }

    if (!summaryData.trim().length) {
      return <p className="w-full text-center mt-10">No summary found!</p>
    }

    return <p className="mt-10">{summaryRenderer(summaryData)}</p>
  }

  const renderRightPanelContent = () => {
    if (!transcriptsData.length) {
      return (
        <div className="grid place-items-center h-full">
          <EmptyPlaceholder
            description="No transcripts found"
            title=""
            icon={
              <HiOutlineChatBubbleLeft size={100} className="text-gray-300" />
            }
          />
        </div>
      )
    }

    return (
      <div className="grid gap-6 bg-white p-4 rounded-sm mt-2">
        {transcriptsData.map((transcript) => (
          <div className="">
            <p className="font-medium">{Object.keys(transcript)[4]}</p>
            <p className="text-xs text-gray-500 mt-1">
              {Object.keys(transcript)[5]}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[1fr_0.3fr] items-start w-full gap-4 overflow-hidden h-[calc(100vh_-_56px)]">
      <div className="grid gap-4 px-40 pt-4 h-full pb-[5rem] overflow-y-auto scrollbar-none">
        <p className="text-2xl">{event.name}</p>
        <div className="aspect-video w-full bg-gray-400 rounded-lg grid place-items-center">
          <ResponsiveVideoPlayer url={recording.download_url} />
        </div>
        {renderSummary()}
      </div>
      <div className="bg-gray-100 p-4 h-full">
        <Button className="bg-white shadow-md" size="sm">
          Transcripts
        </Button>
        {renderRightPanelContent()}
      </div>
    </div>
  )
}

export const Route = createFileRoute(
  '/events/$eventId/recordings/_layout/$recordingId/'
)({
  component: () => <RecordingDetails />,
})
