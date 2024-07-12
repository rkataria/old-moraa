import { useQuery } from '@tanstack/react-query'

import { useFlags } from '@/flags/client'
import { VercelService } from '@/services/vercel.service'

export const useFeatureFlags = () => {
  const { flags: happyKitFlags = {} } = useFlags()
  const flagsQuery = useQuery({
    queryKey: ['flags-query'],
    queryFn: () => VercelService.getFlags(),
    refetchOnWindowFocus: false,
  })

  const vercelFlags = flagsQuery.data || {}

  return { flags: { ...happyKitFlags, ...vercelFlags } }
}
