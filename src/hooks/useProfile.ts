import { useQuery } from '@tanstack/react-query'

import { useAuth } from './useAuth'

import { ProfileService } from '@/services/profile.service'

export const useProfile = () => {
  const { currentUser } = useAuth()
  const profileQuery = useQuery({
    queryKey: ['event', currentUser?.id],
    queryFn: () => ProfileService.getProfile(currentUser.id),
    enabled: !!currentUser?.id,
    refetchOnWindowFocus: false,
  })
  const isRequiredNames =
    typeof profileQuery?.data?.data?.first_name !== 'string' &&
    typeof profileQuery?.data?.data?.last_name !== 'string'

  return {
    data: profileQuery?.data?.data,
    isLoading: profileQuery.isLoading,
    isFetching: profileQuery.isFetching,
    error: profileQuery.error,
    isError: profileQuery.isError,
    refetch: profileQuery.refetch,
    isRequiredNames,
  }
}
