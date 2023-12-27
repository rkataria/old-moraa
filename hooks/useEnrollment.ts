import { useAuth } from "./useAuth"
import { useQuery } from "@tanstack/react-query"
import { EnrollmentService } from "@/services/enrollment.service"

export const useEnrollment = ({ eventId }: { eventId: string }) => {
  const { currentUser } = useAuth()
  const { data, error, isFetching, isLoading, isError, refetch } = useQuery({
    queryKey: ["enrollment", eventId, currentUser?.id],
    queryFn: () =>
      EnrollmentService.getEnrollment({ eventId, userId: currentUser.id }),
    enabled: !!eventId && !!currentUser,
  })

  return {
    enrollment: data,
    isLoading: isLoading,
    isFetching: isFetching,
    error,
    isError,
    refetch,
  }
}
