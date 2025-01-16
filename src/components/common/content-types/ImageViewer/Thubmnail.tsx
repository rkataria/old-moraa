import { useQuery } from '@tanstack/react-query'

import { Embed } from './Embed'

import { getSignedUrl } from '@/services/storage.service'
import { IFrame } from '@/types/frame.type'

export function Thumbnail({ frame }: { frame: IFrame }) {
  const signedURLQuery = useQuery({
    queryKey: ['image-frame', frame.content?.imagePath],
    queryFn: () => getSignedUrl('assets-uploads', frame.content?.imagePath),
    enabled: !!frame.content?.imagePath && !frame.content?.url,
    refetchOnMount: false,
    staleTime: Infinity,
  })

  return (
    <Embed
      path={frame.content?.url || signedURLQuery.data?.data?.signedUrl || ''}
      disableHotspot
    />
  )
}
