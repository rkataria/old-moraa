import { Embed } from './Embed'

import { NoFramePreview } from '@/components/common/NoFramePreview'
import { IFrame } from '@/types/frame.type'

type ThumbnailProps = {
  frame: IFrame
}

export function Thumbnail({ frame }: ThumbnailProps) {
  const videoUrl = frame.content?.videoUrl as string

  if (!videoUrl) {
    return <NoFramePreview />
  }

  return <Embed url={videoUrl} showControls={false} />
}
