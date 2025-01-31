/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query'

import { EventService } from '@/services/event.service'
import { EventModel } from '@/types/models'

export const useEvent = ({ id }: { id: string }) => {
  const eventQuery = useQuery({
    queryKey: ['event', id],
    queryFn: () =>
      EventService.getEvent({
        eventId: id,
      }),
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })

  const hosts =
    eventQuery.data?.participants?.filter(
      (p: any) => p.event_role === 'Host'
    ) || []

  return {
    event: eventQuery.data?.event as unknown as EventModel,
    meeting: eventQuery.data?.meeting,
    participants: eventQuery.data?.participants,
    hosts,
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

  const hosts =
    eventQuery.data?.participants?.filter(
      (p: any) => p.event_role === 'Host'
    ) || []

  return {
    event: eventQuery.data?.event as unknown as EventModel,
    meeting: eventQuery.data?.meeting,
    participants: eventQuery.data?.participants,
    hosts,
    isLoading: eventQuery.isLoading,
    isFetching: eventQuery.isFetching,
    error: eventQuery.error,
    isError: eventQuery.isError,
    refetch: eventQuery.refetch,
  }
}
