/* eslint-disable @typescript-eslint/no-explicit-any */

import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { useAuth } from './useAuth'

import { RecordingsService } from '@/services/recordings-service'

export const useGetRecordings = ({
  token,
  meetingId,
  query,
}: {
  token: string | undefined | null
  meetingId: string | undefined | null
  query?: Record<string, any>
}) => {
  const { currentUser, isLoading: isUserLoading } = useAuth()

  const eventsRecordingQuery: UseQueryResult<
    {
      recordings: any
    },
    Error
  > = useQuery({
    queryKey: ['recordings', meetingId, query],
    queryFn: () =>
      RecordingsService.getRecordings({
        token: token as string,
        meetingId: meetingId as string,
        query,
      }),
    enabled: !!currentUser?.id && !!token && !!meetingId,
    refetchOnWindowFocus: false,
  })

  return {
    recordings: eventsRecordingQuery.data?.recordings?.data || [],
    metaData: eventsRecordingQuery.data?.recordings?.paging || {},
    refetch: eventsRecordingQuery.refetch,
    isLoading: eventsRecordingQuery.isLoading || isUserLoading,
    isFetching: eventsRecordingQuery.isFetching,
    error: eventsRecordingQuery.error,
    isError: eventsRecordingQuery.isError,
  }
}

export const useGetRecording = ({
  token,
  meetingId,
  recordingId,
}: {
  token: string | undefined | null
  meetingId: string | undefined | null
  recordingId: string | undefined | null
}) => {
  const { currentUser, isLoading: isUserLoading } = useAuth()

  const eventsRecordingQuery: UseQueryResult<
    {
      recording: any
      transcripts: any
    },
    Error
  > = useQuery({
    queryKey: ['recordings', meetingId],
    queryFn: () =>
      RecordingsService.getRecording({
        recordingId: recordingId as string,
        dyteMeetingId: meetingId as string,
        meetingToken: token as string,
      }),
    enabled: !!currentUser?.id && !!token && !!meetingId,
    refetchOnWindowFocus: false,
  })

  return {
    recording: eventsRecordingQuery.data?.recording?.data,
    transcripts: eventsRecordingQuery.data?.transcripts?.data,
    refetch: eventsRecordingQuery.refetch,
    isLoading: eventsRecordingQuery.isLoading || isUserLoading,
    isFetching: eventsRecordingQuery.isFetching,
    error: eventsRecordingQuery.error,
    isError: eventsRecordingQuery.isError,
  }
}

export const useGetSummary = ({
  token,
  sessionId,
}: {
  token: string | undefined | null
  sessionId: string | undefined | null
}) => {
  const eventsRecordingQuery: UseQueryResult<any, Error> = useQuery({
    queryKey: ['recordings', 'summary', sessionId],
    queryFn: () =>
      RecordingsService.getSummary({
        meetingToken: token as string,
        sessionId: sessionId as string,
      }),
    enabled: !!token && !!sessionId,
    refetchOnWindowFocus: false,
  })

  return {
    summary: eventsRecordingQuery.data,
    refetch: eventsRecordingQuery.refetch,
    isLoading: eventsRecordingQuery.isLoading,
    isFetching: eventsRecordingQuery.isFetching,
    error: eventsRecordingQuery.error,
    isError: eventsRecordingQuery.isError,
  }
}
