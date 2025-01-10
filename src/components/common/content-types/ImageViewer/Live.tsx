import { useQuery } from '@tanstack/react-query'

import { Embed } from './Embed'

import { getSignedUrl } from '@/services/storage.service'
import { IFrame } from '@/types/frame.type'

type LiveProps = {
  frame: IFrame
}

export function Live({ frame }: LiveProps) {
  const signedURLQuery = useQuery({
    queryKey: ['image-slide', frame.content?.imagePath],
    queryFn: () => getSignedUrl('assets-uploads', frame.content?.imagePath),
    enabled: !!frame.content?.imagePath,
    refetchOnMount: false,
    staleTime: Infinity,
  })

  return (
    <Embed
      path={signedURLQuery.data?.data?.signedUrl || ''}
      hotspots={frame.content?.hotspots}
      disableAddHotspot
    />
  )
}
