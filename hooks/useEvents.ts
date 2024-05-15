import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { useAuth } from './useAuth'

import { EventService } from '@/services/event.service'

export const useEvents = (range: { from: number; to: number }) => {
  const { currentUser, isLoading: isUserLoading } = useAuth()

  const eventsQuery: UseQueryResult<
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      events: any[] | undefined
      count: number | null
    },
    Error
  > = useQuery({
    queryKey: ['events', range],
    queryFn: () => EventService.getEvents(range),
    enabled: !!currentUser?.id,
  })

  return {
    events: eventsQuery.data?.events,
    count: eventsQuery.data?.count,
    refetch: eventsQuery.refetch,
    isLoading: eventsQuery.isLoading || isUserLoading,
    isFetching: eventsQuery.isFetching,
    error: eventsQuery.error,
    isError: eventsQuery.isError,
  }
}
