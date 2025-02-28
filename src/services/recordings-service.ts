/* eslint-disable consistent-return, no-promise-executor-return, no-plusplus, no-await-in-loop */

import { DyteRecordingService } from './dyte-recording.service'

import { supabaseClient } from '@/utils/supabase/client'

export type GetRecordingsParams = {
  meetingId: string
  from: number
  to: number
  order: { ascending: boolean }
}

export type GetRecordingParams = {
  recordingId: string
  meetingToken: string
  dyteMeetingId: string
}

function isSignedUrlExpired(url: string) {
  if (!url) return true
  const urlObj = new URL(url)
  const expirySeconds = parseInt(
    urlObj.searchParams.get('X-Goog-Expires') as string,
    10
  )
  const signedDateStr = urlObj.searchParams.get('X-Goog-Date')

  if (!expirySeconds || !signedDateStr) {
    console.error('Invalid signed URL: Missing required parameters')

    return true // Assume expired if parameters are missing
  }

  // Convert X-Goog-Date (e.g., "20250228T053929Z") to a Date object
  const signedDate = new Date(
    `${signedDateStr.substring(0, 4)}-${signedDateStr.substring(4, 6)}-${signedDateStr.substring(6, 8)}T` +
      `${signedDateStr.substring(9, 11)}:${signedDateStr.substring(11, 13)}:${signedDateStr.substring(13, 15)}Z`
  )

  // Calculate expiration time
  const expiryTime = signedDate.getTime() + expirySeconds * 1000

  return Date.now() > expiryTime
}

const refreshRecordings = async (recordingIds: string[]) => {
  const data = await supabaseClient.functions.invoke('refresh-recording-url', {
    body: { recording_ids: recordingIds },
  })

  return JSON.parse(data.data)
}

const getRecordings = async ({
  meetingId,
  from,
  to,
  order,
}: GetRecordingsParams) => {
  if (!meetingId) return

  const { data: recordings, count } = await supabaseClient
    .from('recording')
    .select('*', { count: 'exact' })
    .eq('meeting_id', meetingId)
    .order('created_at', order)
    .range(from, to)

  const expiredRecordingIds = recordings
    ?.filter((recording) =>
      isSignedUrlExpired(recording.recording_url as string)
    )
    .map((r) => r.id)

  const refereshedRecordings: Record<
    string,
    {
      recordingSignedUrl: string
      transcriptSignedUrl: string
      summarySignedUrl: string
    }
  > = expiredRecordingIds?.length
    ? await refreshRecordings(expiredRecordingIds as string[])
    : {}

  const updatedRecordings = recordings?.map((recording) => {
    if (!expiredRecordingIds?.includes(recording.id)) {
      return recording
    }

    return {
      ...recording,
      recording_url: refereshedRecordings[recording.id].recordingSignedUrl,
      transcript_url: refereshedRecordings[recording.id].transcriptSignedUrl,
      summary_url: refereshedRecordings[recording.id].summarySignedUrl,
    }
  })

  return {
    recordings: updatedRecordings,
    totalItems: count,
  }
}

const getSummary = async ({
  meetingToken,
  sessionId,
}: {
  meetingToken: string
  sessionId: string
  maxRetries?: number
  initialDelay?: number
}) => {
  const response = await DyteRecordingService.getSummary({
    token: meetingToken,
    sessionId,
  })

  const summaryData = await response.json()

  return summaryData?.data || {}
}

const getRecording = async ({
  meetingToken,
  recordingId,
  dyteMeetingId,
}: GetRecordingParams) => {
  try {
    if (!meetingToken || !dyteMeetingId) {
      console.warn('Invalid meeting token or meeting ID')

      return {
        recording: null,
        transcripts: null,
      }
    }

    // Fetch recording data
    const recordingsResponse = await DyteRecordingService.getRecording({
      token: meetingToken,
      recordingId,
    })
    const recording = await recordingsResponse.json()

    if (!recording?.data?.session_id) {
      console.warn('No session ID in recording data')

      return {
        recording: null,
        transcripts: null,
      }
    }

    // Fetch transcripts
    const transcriptsResponse = await DyteRecordingService.getTranscripts({
      token: meetingToken,
      sessionId: recording.data.session_id,
    })
    const transcripts = await transcriptsResponse.json()

    return {
      recording,
      transcripts,
    }
  } catch (error) {
    console.error('Unexpected error:', error)

    return { event: null, contents: null, error }
  }
}

export const RecordingsService = {
  getRecordings,
  getRecording,
  getSummary,
}
