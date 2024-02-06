import { useAuth } from "./useAuth"
import { useQuery } from "@tanstack/react-query"
import { EventService } from "@/services/event.service"
import { IMeetingSlidesPayload } from "@/types/event.type"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const useEvent = ({
  id,
  fetchMeetingSlides = false,
  fetchActiveSession = false,
}: {
  id: string
  fetchMeetingSlides?: boolean
  fetchActiveSession?: boolean
}) => {
  const supabase = createClientComponentClient()
  const { currentUser, isLoading: isUserLoading } = useAuth()

  const { data, error, isFetching, isLoading, isError, refetch } = useQuery({
    queryKey: ["event", id, fetchMeetingSlides],
    queryFn: () =>
      EventService.getEvent({
        eventId: id,
        fetchMeetingSlides,
        fetchActiveSession,
      }),
    enabled: !!currentUser?.id && !!id,
  })

  return {
    event: data?.event,
    meeting: data?.meeting,
    meetingSlides: data?.meetingSlides,
    activeSession: data?.session,
    isLoading: isLoading || isUserLoading,
    isFetching: isFetching,
    error,
    isError,
    refetch,
  }
}
