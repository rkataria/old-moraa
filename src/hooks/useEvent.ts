import { useQuery } from '@tanstack/react-query'

import { EventService } from '@/services/event.service'
import { EventModel } from '@/types/models'

export const useEvent = ({
  id,
  fetchActiveSession = false,
}: {
  id: string
  fetchActiveSession?: boolean
}) => {
  const eventQuery = useQuery({
    queryKey: ['event', id],
    queryFn: () =>
      EventService.getEvent({
        eventId: id,
        fetchActiveSession,
      }),
    enabled: !!id,
    refetchOnWindowFocus: false,
  })

  return {
    event: eventQuery.data?.event as unknown as EventModel,
    meeting: eventQuery.data?.meeting,
    participants: eventQuery.data?.participants,
    profile: eventQuery.data?.profile,
    activeSession: eventQuery.data?.session,
    isLoading: eventQuery.isLoading,
    isFetching: eventQuery.isFetching,
    error: eventQuery.error,
    isError: eventQuery.isError,
    refetch: eventQuery.refetch,
  }
}

export const usePublicEvent = ({ id }: { id: string }) => {
  const eventQuery = useQuery({
    queryKey: ['event', id],
    queryFn: () =>
      EventService.getPublicEvent({
        eventId: id,
      }),
    enabled: !!id,
    refetchOnWindowFocus: false,
  })

  return {
    event: eventQuery.data?.event as unknown as EventModel,
    meeting: eventQuery.data?.meeting,
    participants: eventQuery.data?.participants,
    isLoading: eventQuery.isLoading,
    isFetching: eventQuery.isFetching,
    error: eventQuery.error,
    isError: eventQuery.isError,
    refetch: eventQuery.refetch,
  }
}
