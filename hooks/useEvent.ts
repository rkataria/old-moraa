import { useQuery } from '@tanstack/react-query'

import { useAuth } from './useAuth'

import { EventService } from '@/services/event.service'

export const useEvent = ({
  id,
  fetchMeetingSlides = false,
  fetchActiveSession = false,
}: {
  id: string
  fetchMeetingSlides?: boolean
  fetchActiveSession?: boolean
}) => {
  const { currentUser, isLoading: isUserLoading } = useAuth()

  const eventQuery = useQuery({
    queryKey: ['event', id, fetchMeetingSlides],
    queryFn: () =>
      EventService.getEvent({
        eventId: id,
        fetchMeetingSlides,
        fetchActiveSession,
      }),
    enabled: !!currentUser?.id && !!id,
  })

  return {
    event: eventQuery.data?.event,
    meeting: eventQuery.data?.meeting,
    participants: eventQuery.data?.participants,
    meetingSlides: eventQuery.data?.meetingSlides,
    activeSession: eventQuery.data?.session,
    isLoading: eventQuery.isLoading || isUserLoading,
    isFetching: eventQuery.isFetching,
    error: eventQuery.error,
    isError: eventQuery.isError,
    refetch: eventQuery.refetch,
  }
}
