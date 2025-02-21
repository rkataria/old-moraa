import { useQuery, useQueryClient } from '@tanstack/react-query'

import { FrameService } from '@/services/frame.service'

export const useBreakoutActivities = ({
  frameId,
  enabled,
}: {
  frameId: string
  enabled?: boolean
}) => {
  const breakoutActivityQuery = useQuery({
    queryKey: ['BREAKOUT_ACTIVITIES', frameId],
    queryFn: () =>
      FrameService.getActivityOfBreakoutFrame({ breakoutFrameId: frameId }),
    select: (data) => data?.data || [],
    enabled,
  })

  return breakoutActivityQuery
}

export const useResetBreakoutActivitiesQuery = () => {
  const queryClient = useQueryClient()

  return {
    resetBreakoutActivitiesQuery: () =>
      queryClient.resetQueries({
        queryKey: ['BREAKOUT_ACTIVITIES'],
      }),
    refetchAllBreakoutActivitiesQuery: () =>
      queryClient.invalidateQueries({
        queryKey: ['BREAKOUT_ACTIVITIES'],
      }),
  }
}
