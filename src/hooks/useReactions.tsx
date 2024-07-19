import { useQuery } from '@tanstack/react-query'

import { ReactionService } from '@/services/reaction.service'

export const useFrameReactions = (frameId?: string) => {
  const ReactionQuery = useQuery({
    queryKey: ['frame-reflection-reaction', frameId],
    queryFn: () => ReactionService.getReactions(frameId!),
    enabled: !!frameId,
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
