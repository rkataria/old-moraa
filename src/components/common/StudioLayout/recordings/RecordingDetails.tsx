/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import { Button } from '@heroui/button'
import { useNavigate, useRouter } from '@tanstack/react-router'
import reduce from 'lodash.reduce'
import { marked } from 'marked'
import { HiOutlineChatBubbleLeft } from 'react-icons/hi2'

import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'
import { Loading } from '@/components/common/Loading'
import { ResponsiveVideoPlayer } from '@/components/common/ResponsiveVideoPlayer'
import { useCsvData } from '@/hooks/useCsv'
import { useGetSummary, useGetRecording } from '@/hooks/useEventRecordings'
import { useStoreSelector } from '@/hooks/useRedux'
import { useTxtData } from '@/hooks/useTxt'
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

export function RecordingDetails() {
  const router = useRouter()
  const navigate = useNavigate()

  const { recordingId = '', ...searches } = router.latestLocation.search as {
    recordingId?: string
  }

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

  const { summary, isFetching: isFetchingSummary } = useGetSummary({
    token: enrollment?.meeting_token,
    sessionId: recording?.session_id,
  })

  const { data: summaryData } = useTxtData(summary?.summary_download_url)

  const { data: transcriptsData } = useCsvData(
    transcripts?.transcript_download_url
  )

  type Transcript = Array<string>
  type GroupedTranscript = {
    speakerId: string
    speakerName: string
    startTimestamp: string
    endTimestamp: string
    text: string
  }
  // TODO:Need to do this from BE.
  function groupTranscripts(
    _transcripts: Transcript[],
    timeOffset = 3
  ): GroupedTranscript[] {
    const grouped = reduce(
      _transcripts,
      (result: GroupedTranscript[], current: Transcript) => {
        const prev = result[result.length - 1]
        const currentTimestamp = parseInt(current[0], 10)

        if (
          prev &&
          prev.speakerId === current[1] && // speakerId check
          currentTimestamp - parseInt(prev.endTimestamp, 10) <= timeOffset
        ) {
          // Combine current text with the previous one
          prev.text += ` ${current[5]}`
          // eslint-disable-next-line prefer-destructuring
          prev.endTimestamp = current[0] // Update the end timestamp
        } else {
          // Start a new group with the current transcript
          result.push({
            speakerId: current[1],
            speakerName: current[4], // Assuming speaker name is directly part of the transcript
            startTimestamp: current[0],
            endTimestamp: current[0],
            text: current[5],
          })
        }

        return result
      },
      []
    )

    // Return an array of objects with speaker info and transcript text
    return grouped
  }
  const groupedTranscripts = groupTranscripts(transcriptsData, 5)

  if (isFetching) {
    return <Loading />
  }

  if (!recording) return null

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
      <div className="grid gap-6 bg-white p-4 rounded-sm mt-2 overflow-y-auto max-h-[84vh] scrollbar-none">
        {groupedTranscripts.map((transcript) => (
          <div className="">
            <p className="font-medium">{transcript.speakerName}</p>
            <p className="text-xs text-gray-500 mt-1 break-words">
              {transcript.text}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[1fr_0.3fr] items-start w-full gap-4 overflow-hidden h-[calc(100vh_-_56px)]">
      <div className="flex flex-col gap-4 px-[55px] pt-4 h-full pb-[5rem] overflow-y-auto scrollbar-none max-h-[calc(100vh_-_56px)]">
        <p
          className="text-2xl font-semibold cursor-pointer"
          onClick={() => {
            navigate({
              search: { ...searches },
            })
          }}>
          Recaps
        </p>
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
