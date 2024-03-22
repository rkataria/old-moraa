import { useQuery } from '@tanstack/react-query'

import { ReactionService } from '@/services/reaction.services'

export const useSlideReactions = (slideId?: string) => {
  const ReactionQuery = useQuery({
    queryKey: ['slide-reflection-reaction', slideId],
    queryFn: () => ReactionService.getReactions(slideId!),
    enabled: !!slideId,
    refetchOnWindowFocus: false,
  })

  return {
    data: ReactionQuery?.data?.data || [],
    isLoading: ReactionQuery.isLoading,
    isFetching: ReactionQuery.isFetching,
    error: ReactionQuery.error,
    isError: ReactionQuery.isError,
    refetch: ReactionQuery.refetch,
  }
}
