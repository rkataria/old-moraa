import { useQuery } from '@tanstack/react-query'

import { useAuth } from './useAuth'

import { EventService } from '@/services/event.service'

export const useEvents = () => {
  const { currentUser, isLoading: isUserLoading } = useAuth()

  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: EventService.getEvents,
    enabled: !!currentUser?.id,
  })

  return {
    events: eventsQuery.data,
    isLoading: eventsQuery.isLoading || isUserLoading,
    isFetching: eventsQuery.isFetching,
    error: eventsQuery.error,
    isError: eventsQuery.isError,
  }
}
