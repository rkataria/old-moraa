import { useAuth } from "./useAuth"
import { useQuery } from "@tanstack/react-query"
import { EventService } from "@/services/event.service"
import { IEventContentPayload } from "@/types/event.type"

export const useEvent = (id: string) => {
  const { currentUser, isLoading: isUserLoading } = useAuth()

  const { data, error, isFetching, isLoading, isError } = useQuery({
    queryKey: ["event", id, true],
    queryFn: () =>
      EventService.getEvent({
        eventId: id,
        fetchEventContent: true,
      }),
    enabled: !!currentUser?.id && !!id,
  })

  const updateEventContent = async ({
    eventContentId,
    payload,
  }: {
    eventContentId: string
    payload: IEventContentPayload
  }) => {
    
  }

  return {
    event: data?.event,
    eventContent: data?.eventContent,
    isLoading: isLoading || isUserLoading,
    isFetching: isFetching,
    error,
    isError,
  }
}
