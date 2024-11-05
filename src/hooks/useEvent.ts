import { useQuery } from '@tanstack/react-query'

import { useAuth } from './useAuth'

import { EventService } from '@/services/event.service'
import { EventModel } from '@/types/models'

export const useEvent = ({
  id,
  fetchActiveSession = false,
  validateWithUser = true,
}: {
  id: string
  fetchActiveSession?: boolean
  validateWithUser?: boolean
}) => {
  const { currentUser, isLoading: isUserLoading } = useAuth()

  const isEnabled = !validateWithUser ? !!id : !!currentUser?.id && !!id

  const eventQuery = useQuery({
    queryKey: ['event', id],
    queryFn: () =>
      EventService.getEvent({
        eventId: id,
        fetchActiveSession,
      }),
    enabled: isEnabled,
    refetchOnWindowFocus: false,
  })

  return {
    event: eventQuery.data?.event as unknown as EventModel,
    meeting: eventQuery.data?.meeting,
    participants: eventQuery.data?.participants,
    profile: eventQuery.data?.profile,
    activeSession: eventQuery.data?.session,
    isLoading: eventQuery.isLoading || isUserLoading,
    isFetching: eventQuery.isFetching,
    error: eventQuery.error,
    isError: eventQuery.isError,
    refetch: eventQuery.refetch,
  }
}
