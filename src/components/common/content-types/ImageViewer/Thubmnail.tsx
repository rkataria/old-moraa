import { useQuery } from '@tanstack/react-query'

import { Embed } from './Embed'
import { FrameNoContentPlaceholder } from '../../FrameNoContentPlaceholder'
import { RenderIf } from '../../RenderIf/RenderIf'

import { getSignedUrl } from '@/services/storage.service'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'

export function Thumbnail({ frame }: { frame: IFrame }) {
  const signedURLQuery = useQuery({
    queryKey: ['image-frame', frame.content?.imagePath],
    queryFn: () => getSignedUrl('assets-uploads', frame.content?.imagePath),
    enabled: !!frame.content?.imagePath && !frame.content?.url,
    refetchOnMount: false,
    staleTime: Infinity,
  })

  const showPlaceholder = !frame.content?.imagePath

  return (
    <div className="w-full h-full">
      <RenderIf isTrue={showPlaceholder}>
        <FrameNoContentPlaceholder frameTyp={FrameType.IMAGE_VIEWER} />
      </RenderIf>
      <RenderIf isTrue={!showPlaceholder}>
        <Embed
          path={
            frame.content?.url || signedURLQuery.data?.data?.signedUrl || ''
          }
          disableHotspot
        />
      </RenderIf>
    </div>
  )
}
