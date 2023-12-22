import { useAuth } from "./useAuth"
import { useQuery } from "@tanstack/react-query"
import { EventService } from "@/services/event.service"
import { IEventContentPayload } from "@/types/event.type"
import { createClient } from "@/utils/supabase/client"

export const useEvent = ({
  id,
  fetchEventContent = false,
}: {
  id: string
  fetchEventContent?: boolean
}) => {
  const supabase = createClient()
  const { currentUser, isLoading: isUserLoading } = useAuth()

  const { data, error, isFetching, isLoading, isError, refetch } = useQuery({
    queryKey: ["event", id, fetchEventContent],
    queryFn: () =>
      EventService.getEvent({
        eventId: id,
        fetchEventContent,
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
    const { error } = await supabase
      .from("event_content")
      .update({ ...payload })
      .eq("id", eventContentId)

    return { error }
  }

  return {
    event: data?.event,
    eventContent: data?.eventContent,
    isLoading: isLoading || isUserLoading,
    isFetching: isFetching,
    error,
    isError,
    updateEventContent,
    refetch,
  }
}
