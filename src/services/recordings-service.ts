/* eslint-disable consistent-return, no-promise-executor-return, no-plusplus, no-await-in-loop */

import { DyteRecordingService } from './dyte-recording.service'

export type GetRecordingsParams = {
  token: string
  meetingId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: Record<string, any>
}

export type GetRecordingParams = {
  recordingId: string
  meetingToken: string
  dyteMeetingId: string
}

const getRecordings = async ({
  token,
  meetingId,
  query,
}: GetRecordingsParams) => {
  if (!token || !meetingId) return

  const recordingsResponse = await DyteRecordingService.getRecordings({
    token,
    dyteMeetingId: meetingId,
    queryParams: query,
  })

  const recordings = await recordingsResponse.json()

  return {
    recordings,
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
