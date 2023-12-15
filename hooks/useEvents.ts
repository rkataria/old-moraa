import { useAuth } from "./useAuth"
import { useQuery } from "@tanstack/react-query"
import { EventService } from "@/services/event.service"

export const useEvents = () => {
  const { currentUser, isLoading: isUserLoading } = useAuth()

  const { data, error, isFetching, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: EventService.getEvents,
    enabled: !!currentUser?.id,
  })

  return {
    events: data,
    isLoading: isLoading || isUserLoading,
    isFetching: isFetching,
    error,
    isError,
  }
}
