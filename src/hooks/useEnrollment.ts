import { useQuery } from '@tanstack/react-query'

import { useAuth } from './useAuth'

import { EnrollmentService } from '@/services/enrollment.service'

export const useEnrollment = ({ eventId }: { eventId: string }) => {
  const { currentUser } = useAuth()
  const enrollmentQuery = useQuery({
    queryKey: ['enrollment', eventId, currentUser?.id],
    queryFn: () =>
      EnrollmentService.getEnrollment({ eventId, userId: currentUser.id }),
    enabled: !!eventId && !!currentUser,
    refetchOnWindowFocus: false,
  })

  return {
    enrollment: enrollmentQuery.data,
    isLoading: enrollmentQuery.isLoading,
    isFetching: enrollmentQuery.isFetching,
    error: enrollmentQuery.error,
    isError: enrollmentQuery.isError,
    refetch: enrollmentQuery.refetch,
  }
}
