import { useAuth } from "./useAuth"
import { useQuery } from "@tanstack/react-query"
import {
  EventSessionService,
  IUpsertEventSession,
} from "@/services/event-session.service"

export const useEventSession = ({ eventId }: { eventId: string }) => {
  const { currentUser, isLoading: isUserLoading } = useAuth()

  const { data, error, isFetching, isLoading, isError } = useQuery({
    queryKey: ["event_session", eventId],
    queryFn: () =>
      EventSessionService.getEventSession({
        eventId,
      }),
    enabled: !!currentUser?.id,
  })

  const upsertEventSession = async ({
    eventId,
    payload,
  }: {
    eventId: string
    payload: IUpsertEventSession
  }) => {
    const { error } = await EventSessionService.upsertEventSession({
      eventId,
      payload,
    })

    return {
      error,
    }
  }

  return {
    eventSession: data,
    isLoading: isLoading || isUserLoading,
    isFetching: isFetching,
    error,
    isError,
    upsertEventSession,
  }
}
