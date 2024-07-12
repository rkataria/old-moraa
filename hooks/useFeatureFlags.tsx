import { useQuery } from '@tanstack/react-query'

import { useFlags } from '@/flags/client'
import { VercelService } from '@/services/vercel.service'

export const useFeatureFlags = () => {
  const { flags: happyKitFlags } = useFlags()
  const flagsQuery = useQuery({
    queryKey: ['flags-query'],
    queryFn: () => VercelService.getFlags(),
    refetchOnWindowFocus: false,
  })

  const vercelFlags = flagsQuery.data || {}

  const getFlagsFrom = () => {
    if (Object.keys(vercelFlags).length !== 0) {
      return vercelFlags
    }

    return happyKitFlags
  }

  return { flags: getFlagsFrom() }
}
