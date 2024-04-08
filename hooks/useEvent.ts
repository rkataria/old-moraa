import { useQuery } from '@tanstack/react-query'

import { useAuth } from './useAuth'

import { EventService } from '@/services/event.service'

export const useEvent = ({
  id,
  fetchActiveSession = false,
}: {
  id: string
  fetchActiveSession?: boolean
}) => {
  const { currentUser, isLoading: isUserLoading } = useAuth()

  const eventQuery = useQuery({
    queryKey: ['event', id],
    queryFn: () =>
      EventService.getEvent({
        eventId: id,
        fetchActiveSession,
      }),
    enabled: !!currentUser?.id && !!id,
    refetchOnWindowFocus: false,
  })

  return {
    event: eventQuery.data?.event,
    meeting: eventQuery.data?.meeting,
    participants: eventQuery.data?.participants,
    activeSession: eventQuery.data?.session,
    isLoading: eventQuery.isLoading || isUserLoading,
    isFetching: eventQuery.isFetching,
    error: eventQuery.error,
    isError: eventQuery.isError,
    refetch: eventQuery.refetch,
  }
}
